"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "../common/Countdown";
import { useContextElement } from "@/context/Context";

export default function ProductCard1({ product, gridClass = "" }) {
  const [currentImage, setCurrentImage] = useState(product.imgSrc);

  const {
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
    setQuickViewItem,
    addProductToCart,
    isAddedToCartProducts,
  } = useContextElement();

  useEffect(() => {
    setCurrentImage(product.imgSrc);
  }, [product]);

  // Calculate sale price if product is on sale
  const calculatePrice = () => {
    if (!product.sale?.isOnSale) return product.price;
    
    if (product.sale.saleType === 'percentage') {
      return product.price * (1 - product.sale.saleValue / 100);
    }
    return product.sale.saleValue; // fixed price
  };

  const displayPrice = calculatePrice();

  return (
    <div
      className={`card-product wow fadeInUp ${gridClass} ${
        product.sale?.isOnSale ? "on-sale" : ""
      } ${product.sizeQuantities ? "card-product-size" : ""}`}
    >
      <div className="card-product-wrapper">
        <Link href={`/product-detail/${product._id}`} className="product-img">
          <Image
            className="lazyload img-product"
            src={product.imgSrc}
            alt={product.title}
            width={600}
            height={800}
          />

          <Image
            className="lazyload img-hover"
            src={product.imgHover || product.imgSrc} // Fallback to main image if no hover
            alt={product.title}
            width={600}
            height={800}
          />
        </Link>
        {product.hotSale && (
          <div className="marquee-product bg-main">
            <div className="marquee-wrapper">
              <div className="initial-child-container">
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
              </div>
            </div>
            <div className="marquee-wrapper">
              <div className="initial-child-container">
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
              </div>
            </div>
          </div>
        )}
        {product.sale?.isOnSale && (
          <div className="on-sale-wrap">
            {product.sale.saleType === 'percentage' && (
              <span className="on-sale-item">-{product.sale.saleValue}%</span>
            )}
          </div>
        )}
        {product.sizeQuantities && (
          <div className="variant-wrap size-list">
            <ul className="variant-box">
              {product.sizeQuantities.map((sizeObj) => (
                <li key={sizeObj.size} className="size-item">
                  {sizeObj.size}
                </li>
              ))}
            </ul>
          </div>
        )}
        {product.countdown && (
          <div className="variant-wrap countdown-wrap">
            <div className="variant-box">
              <div
                className="js-countdown"
                data-timer={product.countdown}
                data-labels="D :,H :,M :,S"
              >
                <CountdownTimer />
              </div>
            </div>
          </div>
        )}
        {product.oldPrice ? (
          <div className="on-sale-wrap">
            <span className="on-sale-item">-25%</span>
          </div>
        ) : (
          ""
        )}
        <div className="list-product-btn">
          <a
            onClick={() => addToWishlist(product._id)}
            className="box-icon wishlist btn-icon-action"
          >
            <span className="icon icon-heart" />
            <span className="tooltip">
              {isAddedtoWishlist(product._id)
                ? "Already Wishlisted"
                : "Wishlist"}
            </span>
          </a>
          <a
            href="#compare"
            data-bs-toggle="offcanvas"
            aria-controls="compare"
            onClick={() => addToCompareItem(product._id)}
            className="box-icon compare btn-icon-action"
          >
            <span className="icon icon-gitDiff" />
            <span className="tooltip">
              {isAddedtoCompareItem(product._id)
                ? "Already compared"
                : "Compare"}
            </span>
          </a>
          <a
            href="#quickView"
            onClick={() => setQuickViewItem(product)}
            data-bs-toggle="modal"
            className="box-icon quickview tf-btn-loading"
          >
            <span className="icon icon-eye" />
            <span className="tooltip">Quick View</span>
          </a>
        </div>
        <div className="list-btn-main">
          <a
            className="btn-main-product"
            onClick={() => addProductToCart(product._id)}
          >
            {isAddedToCartProducts(product._id)
              ? "Already Added"
              : "ADD TO CART"}
          </a>
        </div>
      </div>
      <div className="card-product-info">
        <Link href={`/product-detail/${product._id}`} className="title link">
          {product.title}
        </Link>
        <span className="price">
          {product.sale?.isOnSale && (
            <span className="old-price">${product.price.toFixed(2)}</span>
          )}{" "}
          ${displayPrice.toFixed(2)}
        </span>
        {/* {product.filterColor && (
          <ul className="list-color-product">
            {product.filterColor.map((color, index) => (
              <li
                key={index}
                className={`list-color-item color-swatch ${
                  currentImage === product.imgSrc ? "active" : ""
                } ${color === "white" ? "line" : ""}`}
                onMouseOver={() => setCurrentImage(product.imgSrc)}
              >
                <span className={`swatch-value bg-${color}`} />
                <Image
                  className="lazyload"
                  src={product.imgSrc}
                  alt={`${color} variant`}
                  width={600}
                  height={800}
                />
              </li>
            ))}
          </ul>
        )} */}
      </div>
    </div>
  );
}
