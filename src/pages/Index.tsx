import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SupportButtons } from "@/components/SupportButtons";
import { InfoSection } from "@/components/InfoSection";
import { Footer } from "@/components/Footer";
import { RedditBar } from "@/components/RedditBar";
import { updateSEO, pageSEO } from "@/utils/seo";

const Index = () => {
  useEffect(() => {
    updateSEO(pageSEO.home);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <RedditBar />
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
