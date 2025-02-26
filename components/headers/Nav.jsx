"use client";
import Link from "next/link";
import React from "react";

import {
  demoItems,
  otherShopMenus,
  productStyles,
  shopFeatures,
  shopLayout,
} from "@/data/menu";
import { usePathname } from "next/navigation";
export default function Nav() {
  const pathname = usePathname();
  return (
    <>
      {" "}
      <li
        className={`menu-item ${
          [...demoItems].some(
            (elm) => elm.href.split("/")[1] == pathname.split("/")[1]
          )
            ? "active"
            : ""
        } `}
      >
        <Link href={'/'} className="item-link">
          Home
        </Link>
      </li>
      <li
        className={`menu-item ${
          [
            ...shopLayout,
            ...shopFeatures,
            ...productStyles,
            ...otherShopMenus,
          ].some((elm) => elm.href.split("/")[1] == pathname.split("/")[1])
            ? "active"
            : ""
        } `}
      >
        <Link href="/shop-left-sidebar" className="item-link">
          Shop
        </Link>
      </li>
      <li className={`menu-item ${pathname === "/about-us" ? "active" : ""}`}>
        <Link href="/about-us" className="item-link">
          About Us
        </Link>
      </li>
      <li className={`menu-item ${pathname === "/contact" ? "active" : ""}`}>
        <Link href="/contact" className="item-link">
          Contact Us
        </Link>
      </li>
    </>
  );
}
