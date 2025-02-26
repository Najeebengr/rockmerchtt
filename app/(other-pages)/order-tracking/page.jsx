import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Topbar from "@/components/headers/Topbar";
import OrderTrac from "@/components/otherPages/OrderTrac";
import Link from "next/link";
import React from "react";

export const metadata = {
  title:
    "Order Tracking || Modave - Multipurpose React Nextjs eCommerce Template",
  description: "Modave - Multipurpose React Nextjs eCommerce Template",
};

export default function page() {
  return (
    <>
      <Topbar bgColor="bg-main" />
      <Header1 />
      <div
        className="page-title"
        style={{ backgroundImage: "url(/images/section/page-title.jpg)" }}
      >
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <h3 className="heading text-center">Order Tracking</h3>
              <ul className="breadcrumbs d-flex align-items-center justify-content-center">
                <li>
                  <Link className="link" href={`/`}>
                    Homepage
                  </Link>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>
                  <Link className="link" href={`/shop-left-sidebar`}>
                    Shop
                  </Link>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>Order Tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <OrderTrac />
      <Footer1 />
    </>
  );
}
