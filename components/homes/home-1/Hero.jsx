"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay,  Pagination } from "swiper/modules";
import { slides } from "@/data/heroSlides";
import Image from "next/image";
export default function Hero() {
  return (
    <section className="flat-slider">
      <div className="container-fluid" >
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
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="swiper-pagination" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
