"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";

export default function Collections() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // Fetch brands from Sanity
        const query = `*[_type == "brand"] {
          _id,
          name,
          "imgSrc": logo.asset->url,
          "count": count(*[_type == "product" && references(^._id)])
        }`;
        
        const result = await client.fetch(query);
        setBrands(result);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <section className="flat-spacing-2 pb_0">
      <div className="container">
        <div className="heading-section-2 wow fadeInUp">
          <h3>Brands you might like</h3>
          <Link href={`/shop-brands`} className="btn-line">
            View All Brands
          </Link>
        </div>
        <div
          className="flat-collection-circle wow fadeInUp"
          data-wow-delay="0.1s"
        >
          <Swiper
            dir="ltr"
            slidesPerView={5}
            spaceBetween={20}
            breakpoints={{
              1200: { slidesPerView: 5, spaceBetween: 20 },
              1000: { slidesPerView: 4, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              480: { slidesPerView: 2, spaceBetween: 15 },
              0: { slidesPerView: 2, spaceBetween: 15 },
            }}
            modules={[Pagination, Navigation]}
            pagination={{
              clickable: true,
              el: ".spd54",
            }}
            navigation={{
              prevEl: ".snbp12",
              nextEl: ".snbn12",
            }}
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand._id}>
                <div className="collection-circle hover-img">
                  <Link href={`/shop-brands/${brand._id}`} className="img-style">
                    <Image
                      className="lazyload"
                      src={brand.imgSrc}
                      alt={brand.name}
                      width={363}
                      height={363}
                    />
                  </Link>
                  <div className="collection-content text-center">
                    <div>
                      <Link href={`/shop-brands/${brand._id}`} className="cls-title">
                        <h6 className="text">{brand.name}</h6>
                        <i className="icon icon-arrowUpRight" />
                      </Link>
                    </div>
                    <div className="count text-secondary">
                      {brand.count} Products
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="d-flex d-lg-none sw-pagination-collection sw-dots type-circle justify-content-center spd54" />
          <div className="nav-prev-collection d-none d-lg-flex nav-sw style-line nav-sw-left snbp12">
            <i className="icon icon-arrLeft" />
          </div>
          <div className="nav-next-collection d-none d-lg-flex nav-sw style-line nav-sw-right snbn12">
            <i className="icon icon-arrRight" />
          </div>
        </div>
      </div>
    </section>
  );
}
