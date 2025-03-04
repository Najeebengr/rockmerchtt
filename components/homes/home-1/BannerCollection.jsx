"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";

// Default content as fallback
const defaultBannerContent = {
  leftBanner: {
    image: "/images/collections/banner-collection/banner-cls1.jpg", 
    title: "Classic Rock Tees",
    description: "Iconic band shirts from legendary rock artists",
    link: "/shop-collection"
  },
  rightBanner: {
    image: "/images/collections/banner-collection/banner-cls2.jpg",
    title: "Limited Edition Collection", 
    description: "Exclusive rock merch you won't find anywhere else",
    link: "/shop-collection",
    isWhiteText: true
  }
};

export default function BannerCollection() {
  const [bannerContent, setBannerContent] = useState(defaultBannerContent);

  useEffect(() => {
    const fetchHomepageContent = async () => {
      try {
        const query = `*[_type == "homepage"][0] {
          bannerCollection {
            leftBanner {
              "image": image.asset->url,
              title,
              description,
              link
            },
            rightBanner {
              "image": image.asset->url,
              title,
              description,
              link,
              isWhiteText
            }
          }
        }`;
        
        const result = await client.fetch(query);
        
        if (result?.bannerCollection) {
          // Only update banners that exist in the result
          const newContent = {
            leftBanner: result.bannerCollection.leftBanner || defaultBannerContent.leftBanner,
            rightBanner: result.bannerCollection.rightBanner || defaultBannerContent.rightBanner
          };
          setBannerContent(newContent);
        }
      } catch (error) {
        console.error("Error fetching homepage content:", error);
        // Keep default content on error
      }
    };

    fetchHomepageContent();
  }, []);

  const { leftBanner, rightBanner } = bannerContent;

  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="tf-grid-layout md-col-2">
          {leftBanner && (
            <div className="collection-default hover-img">
              <a className="img-style">
                <Image
                  className="lazyload"
                  src={leftBanner.image}
                  alt={leftBanner.title}
                  width={945}
                  height={709}
                  priority
                />
              </a>
              <div className="content">
                <h3 className="title wow fadeInUp">
                  <Link href={leftBanner.link} className="link">
                    {leftBanner.title}
                  </Link>
                </h3>
                <p className="desc wow fadeInUp">
                  {leftBanner.description}
                </p>
                <div className="wow fadeInUp">
                  <Link href={leftBanner.link} className="btn-line">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          )}
          {rightBanner && (
            <div className="collection-position hover-img">
              <a className="img-style">
                <Image
                  className="lazyload"
                  src={rightBanner.image}
                  alt={rightBanner.title}
                  width={945}
                  height={945}
                  priority
                />
              </a>
              <div className="content">
                <h3 className="title">
                  <Link
                    href={rightBanner.link}
                    className={`link ${rightBanner.isWhiteText ? 'text-white' : ''} wow fadeInUp`}
                  >
                    {rightBanner.title}
                  </Link>
                </h3>
                <p className={`desc ${rightBanner.isWhiteText ? 'text-white' : ''} wow fadeInUp`}>
                  {rightBanner.description}
                </p>
                <div className="wow fadeInUp">
                  <Link
                    href={rightBanner.link}
                    className={`btn-line ${rightBanner.isWhiteText ? 'style-white' : ''}`}
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
