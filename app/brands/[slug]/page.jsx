"use client";
import { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import ProductCard1 from '@/components/productCards/ProductCard1';
import Loading from '@/components/Loading';
import { useParams } from 'next/navigation';

export default function BrandPage() {
  const [brandData, setBrandData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    if (!params?.slug) return;

    const fetchBrandData = async () => {
      try {
        // Updated query to correctly fetch products by brand reference
        const query = `{
          "brand": *[_type == "brand" && slug.current == $slug][0] {
            _id,
            name,
            "logo": logo.asset->url,
            description
          },
          "products": *[_type == "products" && references(*[_type == "brand" && slug.current == $slug][0]._id)] {
            _id,
            title,
            price,
            "imgSrc": mainImage.asset->url,
            "imgHover": image2.asset->url,
            sale {
              isOnSale,
              saleType,
              saleValue
            },
            category,
            filterColor,
            sizeQuantities,
            "id": _id,
            "colors": filterColor[] {
              "bgColor": "bg-" + @,
              "imgSrc": ^.mainImage.asset->url
            },
            "sizes": sizeQuantities[].size
          }
        }`;

        const result = await client.fetch(query, { slug: params.slug });
        
        console.log('Fetched results:', result); // Add this for debugging

        // Transform the products data to match ProductCard1 expectations
        const transformedProducts = result.products.map(product => ({
          ...product,
          isOnSale: product.sale?.isOnSale || false,
          salePercentage: product.sale?.saleType === 'percentage' ? product.sale.saleValue + '%' : '',
          oldPrice: product.sale?.isOnSale ? product.price : null,
          price: product.sale?.isOnSale 
            ? product.sale.saleType === 'percentage'
              ? product.price * (1 - product.sale.saleValue / 100)
              : product.sale.saleValue
            : product.price
        }));

        console.log('Transformed products:', transformedProducts); // Add this for debugging

        setBrandData(result.brand);
        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching brand data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [params?.slug]); // Only depend on params.slug when it's available

  if (loading) return <Loading />;
  if (!brandData) return <div>Brand not found</div>;

  return (
    <section className="shop-area">
      <div className="container">
        <div className="brand-header tf-section">
          <div className="d-flex align-items-center gap-4 mb-4">
            <img 
              src={brandData.logo} 
              alt={brandData.name} 
              className="w-20 h-20 object-contain"
            />
            <h1 className="heading">{brandData.name}</h1>
          </div>
          {brandData.description && (
            <p className="text-secondary mb-8">{brandData.description}</p>
          )}
        </div>

        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <ProductCard1 product={product} />
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-8">
            <p className="text-secondary">No products found for this brand.</p>
          </div>
        )}
      </div>
    </section>
  );
} 