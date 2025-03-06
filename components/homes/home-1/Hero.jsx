"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { slides as defaultSlides } from "@/data/heroSlides";
import Image from "next/image";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";

export default function Hero() {
  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    async function fetchHeroSlides() {
      try {
        const query = `
          *[_type == "homepage"][0] {
            heroSlides[] {
              "imageUrl": image.asset->url,
              alt,
              link
            }
          }
        `;
        
        const result = await client.fetch(query);
        
        if (result?.heroSlides && result.heroSlides.length > 0) {
          // Transform the data to match the expected format
          const sanitySlides = result.heroSlides.map(slide => ({
            imgSrc: slide.imageUrl,
            alt: slide.alt,
            link: slide.link || '#'
          }));
          setSlides(sanitySlides);
        }
      } catch (error) {
        console.error("Error fetching hero slides:", error);
        // Fallback to default slides (already set in initial state)
      }
    }

    fetchHeroSlides();
  }, []);

  return (
    <section className="flat-slider">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="swiper-container mainslider">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination",
                }}
              >
                {slides.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <div className="image-slider">
                      {slide.link ? (
                        <a href={slide.link} className="slider-link">
                          <Image
                            src={slide.imgSrc}
                            alt={slide.alt}
                            width={1920}
                            height={760}
                            style={{
                              width: '100%',
                              height: 'auto',
                              objectFit: 'contain',
                              '@media (maxWidth: 768px)': {
                                objectFit: 'contain',
                                maxHeight: '400px'
                              }
                            }}
                            priority
                          />
                        </a>
                      ) : (
                        <Image
                          src={slide.imgSrc}
                          alt={slide.alt}
                          width={1920}
                          height={760}
                          style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'contain',
                            '@media (maxWidth: 768px)': {
                              objectFit: 'contain',
                              maxHeight: '400px'
                            }
                          }}
                          priority
                        />
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
