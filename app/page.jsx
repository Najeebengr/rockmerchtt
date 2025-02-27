import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Topbar from "@/components/headers/Topbar";
import BannerCollection from "@/components/homes/home-1/BannerCollection";
import BannerCountdown from "@/components/homes/home-1/BannerCountdown";
import Collections from "@/components/homes/home-1/Collections";
import Features from "@/components/common/Features";
import Hero from "@/components/homes/home-1/Hero";
import Products from "@/components/common/Products3";
import ShopGram from "@/components/common/ShopGram";

export const metadata = {
  title: "Rock Merch TT | Premium Band T-Shirts & Music Merchandise",
  description: "Official rock band t-shirts and music merchandise. Find limited edition concert tees, band shirts, and exclusive rock apparel from your favorite artists.",
  keywords: "rock t-shirts, band merchandise, concert tees, music apparel, rock merch, band shirts, rock clothing",
  openGraph: {
    title: "Rock Merch TT | Premium Band T-Shirts & Music Merchandise",
    description: "Shop premium quality rock band t-shirts, concert merchandise, and limited edition music apparel from your favorite artists.",
    images: [{ url: "/images/rock-merch-social.jpg" }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Rock Merch TT | Premium Band Shirts & Music Merch",
    description: "Official rock band t-shirts and music merchandise. Find your perfect band tee today!",
    images: ["/images/rock-merch-social.jpg"]
  },
  alternates: {
    canonical: "https://rockmerchtt.com"
  }
};

export default function Home() {
  return (
    <>
      <Topbar />
      <Header1 />
      <Hero />
      <Collections />
      <Products />
      <BannerCollection />
      <BannerCountdown />
      <ShopGram />
      <Features />
      <Footer1 />
    </>
  );
}
