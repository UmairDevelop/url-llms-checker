import { Card } from "@/components/ui/card";
import { FileText, Shield, Bot, Globe } from "lucide-react";

export const InfoSection = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What is LLMS.txt?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            LLMS.txt is a proposed standard for websites to communicate their AI training data policies, 
            content licensing, and usage permissions to Large Language Models and AI systems.
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

        <Card className="p-8 border-0 shadow-elegant">
          <h3 className="text-2xl font-bold mb-6">How to Check for LLMS.txt</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-2">Enter Website URL</h4>
                <p className="text-muted-foreground">
                  Type the website URL you want to check. You can enter it with or without the protocol (http/https).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-2">Automatic Validation</h4>
                <p className="text-muted-foreground">
                  Our tool automatically checks for the presence of an LLMS.txt file at the root domain (website.com/llms.txt).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-2">Get Results</h4>
                <p className="text-muted-foreground">
                  Receive instant feedback on whether the website has implemented LLMS.txt and can access the file directly.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-2">Review Content</h4>
                <p className="text-muted-foreground">
                  If found, you can click the link to review the actual LLMS.txt content and understand the website's AI policies.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};