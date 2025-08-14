import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SupportButtons } from "@/components/SupportButtons";
import { InfoSection } from "@/components/InfoSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <SupportButtons />
        <InfoSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
