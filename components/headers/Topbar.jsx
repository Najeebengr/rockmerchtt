import React from "react";
import Link from "next/link";
export default function Topbar() {
  return (
    <div className="tf-topbar bg-main">
      <div className="container">
        <div className="tf-topbar_wrap d-flex align-items-center justify-content-center justify-content-xl-between">
          <ul className="topbar-left">
            <li>
              <a className="text-caption-1 text-white" target="_blank" rel="noopener noreferrer" href="https://wa.me/18684676929">
              WhatsApp only: +1 (868) 467-6929
              </a>
            </li>
            <li>
              <a className="text-caption-1 text-white" href="mailto:sales@rockmerchtt.com">
              sales@rockmerchtt.com
              </a>
            </li>
            
          </ul>
        
        </div>
      </div>
    </div>
  );
}
