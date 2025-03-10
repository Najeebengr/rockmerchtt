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
            if (row.imgSrc1) {
              imagesToUpload.push({ url: row.imgSrc1, index: `imgSrc1_${rowIndex}` });
            }
            if (row.imgSrc2) {
              imagesToUpload.push({ url: row.imgSrc2, index: `imgSrc2_${rowIndex}` });
            }
            if (row.imgSrc3) {
              imagesToUpload.push({ url: row.imgSrc3, index: `imgSrc3_${rowIndex}` });
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
                  description: row.description,
                  price: parseFloat(row.price),
                  category: row.category,
                  filterBrands: brandReferences,
                  filterColor: row.filterColor ? row.filterColor.split(',').map(item => item.trim()) : [],
                };

                // Handle sale information if present
                if (row.isOnSale === 'true') {
                  productDoc.sale = {
                    isOnSale: true,
                    saleType: row.saleType,
                    saleValue: parseFloat(row.saleValue)
                  };
                }

                // Handle multiple images
                const images = [];
                for (let i = 1; i <= 3; i++) {
                  const imageKey = `imgSrc${i}`;
                  if (row[imageKey]) {
                    const uploadedImage = uploadedImages.get(`${imageKey}_${batchIndex}`);
                    if (uploadedImage) {
                      images.push(uploadedImage);
                    }
                  }
                }
                if (images.length > 0) {
                  productDoc.images = images;
                }

                // Validate required fields
                if (!row.description) {
                  throw new Error('Description is required');
                }

                // Parse and validate size quantities
                if (row.sizeQuantities) {
                  try {
                    const sizeQuantities = JSON.parse(row.sizeQuantities);
                    if (!Array.isArray(sizeQuantities)) {
                      throw new Error('Size quantities must be an array');
                    }
                    
                    productDoc.sizeQuantities = sizeQuantities.map((sq, index) => ({
                      _key: `size${index}`,
                      size: sq.size,
                      quantity: parseInt(sq.quantity)
                    }));

                    // Extract unique sizes for filterSizes
                    productDoc.filterSizes = [...new Set(sizeQuantities.map(sq => sq.size))];
                  } catch (error) {
                    throw new Error(`Invalid size quantities format: ${error.message}`);
                  }
                } else {
                  throw new Error('Size quantities are required');
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
    const sampleData = [
      {
        title: "Sample T-Shirt",
        description: "Classic cotton t-shirt with comfortable fit.",
        price: "29.99",
        category: "men",
        imgSrc1: "https://example.com/tshirt1.jpg",
        imgSrc2: "https://example.com/tshirt2.jpg",
        imgSrc3: "https://example.com/tshirt3.jpg",
        isOnSale: "true",
        saleType: "percentage",
        saleValue: "20",
        filterBrands: "Nike",
        filterColor: "Red, Blue, Black",
        sizeQuantities: JSON.stringify([
          { size: "S", quantity: 10 },
          { size: "M", quantity: 15 },
          { size: "L", quantity: 20 }
        ])
      },
      {
        title: "Sample Dress",
        description: "Elegant summer dress with floral pattern.",
        price: "49.99",
        category: "women",
        imgSrc1: "https://example.com/dress1.jpg",
        imgSrc2: "https://example.com/dress2.jpg",
        imgSrc3: "",  // Optional third image
        isOnSale: "true",
        saleType: "fixed",
        saleValue: "39.99",
        filterBrands: "Zara",
        filterColor: "Black, White",
        sizeQuantities: JSON.stringify([
          { size: "XS", quantity: 5 },
          { size: "S", quantity: 10 },
          { size: "M", quantity: 8 }
        ])
      }
    ];

    try {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(sampleData);

      const colWidths = [
        { wch: 30 }, // title
        { wch: 50 }, // description
        { wch: 10 }, // price
        { wch: 10 }, // category
        { wch: 50 }, // imgSrc1
        { wch: 50 }, // imgSrc2
        { wch: 50 }, // imgSrc3
        { wch: 10 }, // isOnSale
        { wch: 15 }, // saleType
        { wch: 10 }, // saleValue
        { wch: 15 }, // filterBrands
        { wch: 20 }, // filterColor
        { wch: 40 }  // sizeQuantities
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Products Template");
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