import { Card } from "@/components/ui/card";
import { FileText, Shield, Bot, Globe } from "lucide-react";

export const InfoSection = () => {
  return (
    <section id="info-section" className="py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About ezllmstxt.com
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            We're pioneering the future of AI-content interaction through LLMS.txt validation and generation. 
            Our platform empowers website owners to take control of how AI systems interact with their content.
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            In the age of AI, we're committed to changing how content is ranked and accessed. Just as robots.txt 
            became the standard for web crawlers, LLMS.txt is emerging as the new standard for AI systems - 
            enabling transparent, respectful AI-content relationships.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center border-0 shadow-soft hover:shadow-elegant transition-smooth">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Standard Format</h3>
            <p className="text-sm text-muted-foreground">
              A standardized text file format for declaring AI training policies
            </p>
          </Card>

          <Card className="p-6 text-center border-0 shadow-soft hover:shadow-elegant transition-smooth">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Content Protection</h3>
            <p className="text-sm text-muted-foreground">
              Helps protect copyrighted content from unauthorized AI training
            </p>
          </Card>

          <Card className="p-6 text-center border-0 shadow-soft hover:shadow-elegant transition-smooth">
            <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">AI Compliance</h3>
            <p className="text-sm text-muted-foreground">
              Enables AI systems to respect website owner preferences
            </p>
          </Card>

          <Card className="p-6 text-center border-0 shadow-soft hover:shadow-elegant transition-smooth">
            <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Web Standard</h3>
            <p className="text-sm text-muted-foreground">
              Promotes responsible AI development across the web
            </p>
          </Card>
        </div>

        <div id="how-to-check" className="mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
            How It Works
          </h3>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 border-0 shadow-elegant">
              <h4 className="text-xl font-bold mb-4 text-primary">Validate Existing LLMS.txt</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h5 className="font-semibold">Enter Website URL</h5>
                    <p className="text-sm text-muted-foreground">Input any website URL into our validation tool</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h5 className="font-semibold">Automatic Check</h5>
                    <p className="text-sm text-muted-foreground">Our system scans for LLMS.txt file at domain.com/llms.txt</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h5 className="font-semibold">Get Results</h5>
                    <p className="text-sm text-muted-foreground">See validation status and review the content policies</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border-0 shadow-elegant">
              <h4 className="text-xl font-bold mb-4 text-primary">Generate New LLMS.txt</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h5 className="font-semibold">Use Our Generator</h5>
                    <p className="text-sm text-muted-foreground">Visit our LLMS.txt generator and enter your website URL</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h5 className="font-semibold">Download File</h5>
                    <p className="text-sm text-muted-foreground">Generate and download your customized LLMS.txt file</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h5 className="font-semibold">Upload to Website</h5>
                    <p className="text-sm text-muted-foreground">Place the file in your website's root directory as llms.txt</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};