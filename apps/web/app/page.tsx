import { FeaturesSection } from "@/components/features-section";
import FooterSection from "@/components/footer-section";
import { Hero } from "@/components/hero-section2";

export const metadata = {
  description: "Your calendar, reimagined with AI",
  title: "Weekday",
};

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturesSection />
      <FooterSection />
    </div>
  );
}
