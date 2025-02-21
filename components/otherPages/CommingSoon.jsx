"use client";
import React from "react";
import CountdownTimer from "../common/Countdown";

export default function CommingSoon() {
  return (
    <section className="flat-spacing coming-soon">
      <div className="coming-soon-inner">
        <div className="content">
          <div className="logo">
            <img src="/images/logo/main-logo.png" alt="coming-soon"  />
          </div>
          <div className="heading title-display">Coming Soon</div>
          <div className="tf-countdown-lg">
            <div
              className="js-countdown"
              data-timer={1007500}
              data-labels="DAYS,HOURS,MINUTES,SECONDS"
            >
              <CountdownTimer style={3} />
            </div>
          </div>
         
        
        </div>
      </div>
    </section>
  );
}
