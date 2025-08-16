import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RedditBar } from "@/components/RedditBar";
import { updateSEO } from "@/utils/seo";

const About = () => {
  useEffect(() => {
    updateSEO({
      title: "About ezllmstxt.com - Shaping Content Discovery in the AI Era",
      description: "Learn about ezllmstxt.com's mission to revolutionize how AI systems interact with web content through LLMS.txt validation and generation.",
      keywords: ["about ezllmstxt", "AI content policy", "LLMS.txt standard", "content licensing for AI"]
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <RedditBar />
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">About ezllmstxt.com</h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
              <p className="text-lg leading-relaxed mb-6">
                At ezllmstxt.com, we're pioneering the future of how AI systems interact with web content. 
                We provide comprehensive tools to validate and generate LLMS.txt files, empowering website 
                owners to have control over how their content is used by AI systems and language models.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Our dual-purpose platform offers both validation services to check if websites have proper 
                LLMS.txt files and generation tools to help content creators establish clear policies for 
                AI training and content usage.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Commitment to Change</h2>
              <p className="text-lg leading-relaxed mb-6">
                We're committed to fundamentally changing how content is ranked, discovered, and utilized 
                in the age of artificial intelligence. Just as robots.txt became the standard for web 
                crawler permissions, we believe LLMS.txt will become the essential standard for AI system 
                interactions with web content.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Our vision extends beyond simple file validation - we're building the infrastructure for 
                a more transparent, ethical, and collaborative relationship between content creators and 
                AI systems.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">The New Standard for AI</h2>
              <p className="text-lg leading-relaxed mb-6">
                LLMS.txt represents the evolution of web standards for the AI era. While robots.txt guides 
                traditional search crawlers, LLMS.txt provides comprehensive guidelines for AI systems, 
                covering everything from training permissions to content licensing and usage policies.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                This new standard enables website owners to:
              </p>
              
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Specify which content can be used for AI training</li>
                <li>Define licensing terms for their intellectual property</li>
                <li>Establish clear boundaries for AI system interactions</li>
                <li>Maintain control over their digital assets in the AI age</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Join the Movement</h2>
              <p className="text-lg leading-relaxed">
                By adopting LLMS.txt standards and using our validation and generation tools, you're 
                joining a movement toward more responsible AI development and content utilization. 
                Together, we're shaping a future where content creators maintain agency over their 
                work while enabling beneficial AI applications.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;