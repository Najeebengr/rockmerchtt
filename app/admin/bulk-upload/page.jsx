"use client";
import { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { writeClient } from '@/sanity/lib/client';
import { FiUploadCloud, FiDownload, FiFile, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import styles from './styles.module.css';
import ProgressBar from './components/ProgressBar';

async function uploadImageFromUrl(imageUrl) {
  try {
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const BATCH_SIZE = 50; // Number of products to process at once
  const [imageProgress, setImageProgress] = useState({ current: 0, total: 0 });
  const [isComplete, setIsComplete] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    setIsComplete(false);
    setResults(null);

    try {
      // First, fetch all existing brands
      const brands = await writeClient.fetch(`
        *[_type == "brand"]{
          _id,
          name
        }
      `);

      // Create a map of brand names to their IDs for quick lookup
      const brandMap = new Map(brands.map(brand => [brand.name.toLowerCase(), brand._id]));

      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Collect all images first
          const imagesToUpload = [];
          jsonData.forEach((row, rowIndex) => {
            if (row.imgSrc) {
              imagesToUpload.push({ url: row.imgSrc, index: `main_${rowIndex}` });
            }
            if (row.imgHover) {
              imagesToUpload.push({ url: row.imgHover, index: `hover_${rowIndex}` });
            }
            if (row.colors) {
              try {
                const colors = JSON.parse(row.colors);
                colors.forEach((color, colorIndex) => {
                  if (color.imgSrc) {
                    imagesToUpload.push({
                      url: color.imgSrc,
                      index: `color_${rowIndex}_${colorIndex}`
                    });
                  }
                });
              } catch (error) {
                console.warn('Invalid colors format:', error);
              }
            }
          });

          // Set total images to upload
          setImageProgress({ current: 0, total: imagesToUpload.length });

          // Upload all images first
          console.log(`Uploading ${imagesToUpload.length} images...`);
          const uploadedImages = await uploadImagesBatch(imagesToUpload);

          // Process products with uploaded images
          let successful = 0;
          let failed = 0;
          const errors = [];
          const total = jsonData.length;

          setProgress({ current: 0, total });

          // Process products in batches
          for (let i = 0; i < jsonData.length; i += BATCH_SIZE) {
            const batch = jsonData.slice(i, i + BATCH_SIZE);
            
            await Promise.all(batch.map(async (row, batchIndex) => {
              try {
                if (!row.title || !row.price || !row.category) {
                  throw new Error('Missing required fields: title, price, or category');
                }

                // Handle brand references
                let brandReferences = [];
                if (row.filterBrands) {
                  const brandNames = row.filterBrands.split(',').map(b => b.trim());
                  brandReferences = brandNames.map((brandName, index) => {
                    const brandId = brandMap.get(brandName.toLowerCase());
                    if (!brandId) {
                      console.warn(`Brand not found: ${brandName}`);
                      return null;
                    }
                    return {
                      _key: `brand${index}`,
                      _type: 'reference',
                      _ref: brandId
                    };
                  }).filter(Boolean);
                }

                const productDoc = {
                  _type: 'products',
                  title: row.title,
                  price: parseFloat(row.price),
                  oldPrice: row.oldPrice ? parseFloat(row.oldPrice) : undefined,
                  category: row.category,
                  isOnSale: row.isOnSale === 'true',
                  salePercentage: row.salePercentage,
                  inStock: row.inStock !== 'false',
                  rating: row.rating ? parseFloat(row.rating) : undefined,
                  reviews: row.reviews ? parseInt(row.reviews) : undefined,
                  countdown: row.countdown ? parseInt(row.countdown) : undefined,
                  filterBrands: brandReferences,
                  filterColor: row.filterColor ? row.filterColor.split(',').map(item => item.trim()) : [],
                  filterSizes: row.filterSizes ? row.filterSizes.split(',').map(item => item.trim()) : [],
                  tabFilterOptions: row.tabFilterOptions ? row.tabFilterOptions.split(',').map(item => item.trim()) : [],
                  tabFilterOptions2: row.tabFilterOptions2 ? row.tabFilterOptions2.split(',').map(item => item.trim()) : [],
                };

                // Add uploaded images
                const mainImage = uploadedImages.get(`main_${i + batchIndex}`);
                const hoverImage = uploadedImages.get(`hover_${i + batchIndex}`);
                
                if (row.imgSrc && mainImage) {
                  productDoc.mainImage = mainImage;
                }
                if (row.imgHover && hoverImage) {
                  productDoc.hoverImage = hoverImage;
                }

                // Handle color variants
                if (row.colors) {
                  try {
                    const colors = JSON.parse(row.colors);
                    productDoc.colors = colors.map((color, colorIndex) => {
                      const variantImage = uploadedImages.get(`color_${i + batchIndex}_${colorIndex}`);
                      return {
                        _key: `color${colorIndex}`,
                        _type: 'color',
                        bgColor: color.bgColor,
                        variantImage: variantImage || null
                      };
                    });
                  } catch (error) {
                    console.warn('Invalid colors format:', error);
                  }
                }

                // Create the product
                const response = await fetch('/api/bulk-upload', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(productDoc)
                });

                if (!response.ok) throw new Error('Failed to create product');
                successful++;
              } catch (error) {
                failed++;
                errors.push(`Row ${i + batchIndex + 1}: ${error.message}`);
              }
            }));

            setProgress({ current: Math.min(i + BATCH_SIZE, total), total });
          }

          setIsComplete(true);
          setResults({
            total: jsonData.length,
            successful,
            failed,
            errors
          });
        } catch (error) {
          console.error('Error processing file:', error);
          setResults({
            total: 0,
            successful: 0,
            failed: 1,
            errors: [`Error processing file: ${error.message}`]
          });
          setIsComplete(true);
        }
      };

      reader.onerror = () => {
        setResults({
          total: 0,
          successful: 0,
          failed: 1,
          errors: ['Error reading file']
        });
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Upload error:', error);
      setResults({
        total: 0,
        successful: 0,
        failed: 1,
        errors: [`Upload error: ${error.message}`]
      });
      setIsComplete(true);
    }
  };

  const isValidImageUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
    }
  };

  const downloadSampleFile = () => {
    // Sample data with proper structure
    const sampleData = [
      {
        title: "Sample T-Shirt",
        price: "29.99",
        oldPrice: "39.99",
        category: "men", // men, women, or children
        imgSrc: "https://cdn.sanity.io/images/your-project-id/production/image1.jpg",
        imgHover: "https://cdn.sanity.io/images/your-project-id/production/image1-hover.jpg",
        isOnSale: "true",
        salePercentage: "25%",
        inStock: "true",
        rating: "4.5",
        reviews: "12",
        countdown: "86400",
        filterBrands: "Nike, Adidas",
        filterColor: "Red, Blue",
        filterSizes: "S, M, L",
        tabFilterOptions: "New, Featured",
        tabFilterOptions2: "Casual, Formal",
        colors: '[{"bgColor":"red","imgSrc":"https://example.com/red-variant.jpg"},{"bgColor":"blue","imgSrc":"https://example.com/blue-variant.jpg"}]'
      },
      {
        title: "Sample Dress",
        price: "49.99",
        oldPrice: "59.99",
        category: "women",
        imgSrc: "https://cdn.sanity.io/images/your-project-id/production/image2.jpg",
        imgHover: "https://cdn.sanity.io/images/your-project-id/production/image2-hover.jpg",
        isOnSale: "false",
        inStock: "true",
        rating: "4.8",
        reviews: "24",
        filterBrands: "Zara, H&M",
        filterColor: "Black, White",
        filterSizes: "XS, S, M, L",
        tabFilterOptions: "Featured, Best Seller",
        tabFilterOptions2: "Party, Casual",
        colors: '[{"bgColor":"black","imgSrc":"https://example.com/black-variant.jpg"},{"bgColor":"white","imgSrc":"https://example.com/white-variant.jpg"}]'
      }
    ];

    try {
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Convert JSON to worksheet
      const ws = XLSX.utils.json_to_sheet(sampleData);

      // Add column widths for better readability
      const colWidths = [
        { wch: 20 }, // title
        { wch: 10 }, // price
        { wch: 10 }, // oldPrice
        { wch: 10 }, // category
        { wch: 30 }, // imgSrc
        { wch: 30 }, // imgHover
        { wch: 8 },  // isOnSale
        { wch: 10 }, // salePercentage
        { wch: 8 },  // inStock
        { wch: 8 },  // rating
        { wch: 8 },  // reviews
        { wch: 10 }, // countdown
        { wch: 20 }, // filterBrands
        { wch: 20 }, // filterColor
        { wch: 20 }, // filterSizes
        { wch: 25 }, // tabFilterOptions
        { wch: 25 }, // tabFilterOptions2
        { wch: 40 }  // colors
      ];
      ws['!cols'] = colWidths;

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Products Template");

      // Save the file
      XLSX.writeFile(wb, "products_upload_template.xlsx");
    } catch (error) {
      console.error("Error creating template:", error);
      alert("Error creating template file. Please try again.");
    }
  };

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  // Batch image upload function
  async function uploadImagesBatch(images) {
    const batchSize = 10; // Process 10 images at a time
    const results = new Map();
    
    for (let i = 0; i < images.length; i += batchSize) {
      const batch = images.slice(i, Math.min(i + batchSize, images.length));
      const batchPromises = batch.map(async ({ url, index }) => {
        try {
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: url })
          });
          
          if (!response.ok) throw new Error('Failed to upload image');
          const result = await response.json();
          results.set(index, result);
        } catch (error) {
          console.error(`Error uploading image ${index}:`, error);
          results.set(index, null);
        }
        setImageProgress(prev => ({
          ...prev,
          current: prev.current + 1
        }));
      });

      await Promise.all(batchPromises);
    }
    
    return results;
  }

  useEffect(() => {
    if (isComplete && uploading) {
      const timer = setTimeout(() => {
        setUploading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isComplete, uploading]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Bulk Product Upload</h1>
        <p className={styles.description}>
          Upload multiple products at once using an Excel file. Download the template below to ensure correct formatting.
        </p>

        <div className={styles.templateSection}>
          <button
            onClick={downloadSampleFile}
            className={styles.downloadButton}
          >
            <FiDownload />
            Download Template
          </button>
        </div>

        <div 
          className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''} ${file ? styles.hasFile : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleDropzoneClick}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.dropzoneContent}>
            {file ? (
              <>
                <FiFile className={styles.icon} />
                <div>
                  <p className={styles.fileName}>{file.name}</p>
                  <p className={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </>
            ) : (
              <>
                <FiUploadCloud className={styles.icon} />
                <div>
                  <p className={styles.dropzoneText}>Drag and drop your Excel file here</p>
                  <p className={styles.dropzoneSubtext}>or click to browse</p>
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className={styles.fileInput}
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
        </div>

        <button
          className={`${styles.uploadButton} ${!file || uploading ? styles.disabled : ''}`}
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Products'}
        </button>
      </div>

      {uploading && (
        <div className={styles.card}>
          <h2 className={styles.subtitle}>Upload Progress</h2>
          
          {imageProgress.total > 0 && (
            <>
              <h3 className={styles.progressTitle}>
                Uploading Images {isComplete && '(Complete)'}
              </h3>
              <ProgressBar
                current={imageProgress.current}
                total={imageProgress.total}
                uploading={!isComplete}
              />
            </>
          )}
          
          <h3 className={styles.progressTitle}>
            Processing Products {isComplete && '(Complete)'}
          </h3>
          <ProgressBar
            current={progress.current}
            total={progress.total}
            uploading={!isComplete}
          />

          {isComplete && (
            <div className={styles.completionMessage}>
              <FiCheck className={styles.checkIcon} />
              <span>Processing complete! Showing results below...</span>
            </div>
          )}
        </div>
      )}

      {isComplete && results && (
        <div className={styles.card}>
          <h2 className={styles.subtitle}>Upload Results</h2>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Total Records</p>
              <p className={styles.statValue}>{results.total}</p>
            </div>
            <div className={`${styles.statCard} ${styles.success}`}>
              <p className={styles.statLabel}>Successfully Uploaded</p>
              <p className={styles.statValue}>{results.successful}</p>
            </div>
            <div className={`${styles.statCard} ${styles.error}`}>
              <p className={styles.statLabel}>Failed</p>
              <p className={styles.statValue}>{results.failed}</p>
            </div>
          </div>

          {results.errors.length > 0 && (
            <div className={styles.errorList}>
              <h3 className={styles.errorTitle}>Errors</h3>
              <ul>
                {results.errors.map((error, index) => (
                  <li key={index} className={styles.errorItem}>
                    <FiAlertTriangle />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}