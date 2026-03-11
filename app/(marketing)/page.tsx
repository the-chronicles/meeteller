import { CTASection } from "@/components/marketing/Cta";
import FeatureGrid from "@/components/marketing/Feature";
import Home from "@/components/marketing/Hero";
import Testimonials from "@/components/marketing/Testimonials";

export default function HomePage() {
  return (
    <>
      <Home />
      {/* <ProductCards /> */}
      <FeatureGrid />
      <Testimonials />
      <CTASection />
    </>
  );
}
