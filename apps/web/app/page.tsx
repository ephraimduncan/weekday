import { FeaturesSection } from "@/components/features-section";
import FooterSection from "@/components/footer-section";
import { HeroSection } from "@/components/hero-section";

export const metadata = {
  description: "Your calendar, reimagined with AI",
  title: "Weekday",
};

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <FooterSection />
    </div>
  );
}
