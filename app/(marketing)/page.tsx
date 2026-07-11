import { CTASection } from "@/components/marketing/Cta";
import FeatureGrid from "@/components/marketing/Feature";
import Home from "@/components/marketing/Hero";
import { ProductCards } from "@/components/marketing/Product";
import RefinedMeeting from "@/components/marketing/RefinedMeeting";
import Security from "@/components/marketing/Security";
import Testimonials from "@/components/marketing/Testimonials";

export default function HomePage() {
  return (
    <>
      <Home />
      <RefinedMeeting />
      <ProductCards />
      <FeatureGrid />
      <Security />
      {/* <Testimonials /> */}
      <CTASection />
    </>
  );
}
