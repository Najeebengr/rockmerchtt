"use client";
import { products2 } from "@/data/products";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Pagination } from "swiper/modules";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";

const defaultContent = {
  heading: "Shop Instagram",
  subheading: "Elevate your wardrobe with fresh finds today!",
  images: products2.slice(0, 5).map((item, index) => ({
    imgSrc: item.imgSrc,
    productId: item.id,
    delay: `${index * 0.2}s`
  }))
};

export default function ShopGram({ parentClass = "" }) {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    async function fetchShopGramContent() {
      try {
        const query = `
          *[_type == "homepage"][0] {
            shopGram {
              heading,
              subheading,
              images[] {
                "imageUrl": image.asset->url,
                productId,
                delay
              }
            }
          }
        `;
        
        const result = await client.fetch(query);
        
        if (result?.shopGram) {
          const sanityContent = {
            heading: result.shopGram.heading || defaultContent.heading,
            subheading: result.shopGram.subheading || defaultContent.subheading,
            images: result.shopGram.images?.length > 0 
              ? result.shopGram.images.map(img => ({
                  imgSrc: img.imageUrl,
                  productId: img.productId,
                  delay: img.delay || '0s'
                }))
              : defaultContent.images
          };
          setContent(sanityContent);
        }
      } catch (error) {
        console.error("Error fetching Shop Instagram content:", error);
        // Fallback to default content (already set in initial state)
      }
    }

    fetchShopGramContent();
  }, []);

  return (
    <section className={parentClass} style={{ paddingTop: '40px' }}>
      <div className="container">
        <div className="heading-section text-center">
          <h3 className="heading wow fadeInUp">{content.heading}</h3>
          <p className="subheading text-secondary wow fadeInUp">
            {content.subheading}
          </p>
        </div>
        <Swiper
          dir="ltr"
          className="swiper tf-sw-shop-gallery"
          spaceBetween={10}
          breakpoints={{
            1200: { slidesPerView: 5 },
            768: { slidesPerView: 3 },
            0: { slidesPerView: 2 },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spb222",
          }}
        >
          {content.images.map((item, i) => (
            <SwiperSlide key={i}>
              <div
                className="gallery-item hover-overlay hover-img wow fadeInUp"
                data-wow-delay={item.delay}
              >
                <div className="img-style">
                  <Image
                    className="lazyload img-hover"
                    src={item.imgSrc}
                    alt="Shop Instagram"
                    width={640}
                    height={640}
                  />
                </div>
                <Link
                  href={`/product-detail/${item.productId}`}
                  className="box-icon hover-tooltip"
                >
                  <span className="icon icon-eye" />
                  <span className="tooltip">View Product</span>
                </Link>
              </div>
            </SwiperSlide>
          ))}
          <div className="sw-pagination-gallery sw-dots type-circle justify-content-center spb222"></div>
        </Swiper>
      </div>
    </section>
  );
}
