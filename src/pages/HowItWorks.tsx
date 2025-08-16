import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RedditBar } from "@/components/RedditBar";
import { updateSEO } from "@/utils/seo";
import { CheckCircle, FileText, Upload, Search } from "lucide-react";

const HowItWorks = () => {
  useEffect(() => {
    updateSEO({
      title: "How It Works - LLMS.txt Validation and Generation Process",
      description: "Learn how to validate existing LLMS.txt files, generate new ones for your website, and properly implement them for AI system compliance.",
      keywords: ["how to use LLMS.txt", "validate AI policies", "generate LLMS.txt file", "website AI compliance"]
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <RedditBar />
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">How It Works</h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-xl text-center text-muted-foreground mb-12">
              Our comprehensive platform makes it easy to validate existing LLMS.txt files and generate new ones for your website.
            </p>

            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Search className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-semibold">Validation Process</h2>
              </div>
              
              <div className="bg-card p-6 rounded-lg border mb-8">
                <h3 className="text-xl font-semibold mb-4">Check Your Website's LLMS.txt Compliance</h3>
                <p className="text-lg leading-relaxed mb-4">
                  Simply enter your website URL in our validator tool, and we'll instantly check if your 
                  website has a properly formatted LLMS.txt file. Our validator examines:
                </p>
                
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>File existence and accessibility</li>
                  <li>Proper formatting and syntax</li>
                  <li>Policy completeness and clarity</li>
                  <li>Compliance with LLMS.txt standards</li>
                </ul>
                
                <p className="text-lg leading-relaxed">
                  You'll receive detailed feedback on any issues found and recommendations for improvement.
                </p>
              </div>
            </section>

            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-semibold">Generation Process</h2>
              </div>
              
              <div className="bg-card p-6 rounded-lg border mb-8">
                <h3 className="text-xl font-semibold mb-4">Create Your Custom LLMS.txt File</h3>
                <p className="text-lg leading-relaxed mb-4">
                  Our intuitive generator helps you create a comprehensive LLMS.txt file tailored to your 
                  website's needs. The process includes:
                </p>
                
                <div className="grid gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Website Information</h4>
                      <p>Provide basic details about your website and content type</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">AI Usage Permissions</h4>
                      <p>Specify how AI systems can interact with and use your content</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Content Licensing</h4>
                      <p>Define licensing terms and usage restrictions for your intellectual property</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Research Material Designation</h4>
                      <p>Enable chatbots and AI systems to use your website as research material and index it appropriately</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg leading-relaxed">
                  The generator creates a properly formatted LLMS.txt file that you can download and 
                  implement on your website.
                </p>
              </div>
            </section>

            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Upload className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-semibold">Implementation Process</h2>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Upload Your LLMS.txt to Your Website</h3>
                <p className="text-lg leading-relaxed mb-4">
                  Once you've generated your LLMS.txt file, implementing it on your website is straightforward:
                </p>
                
                <ol className="list-decimal pl-6 mb-6 space-y-3">
                  <li className="text-lg">
                    <strong>Download the generated file</strong> - Save the LLMS.txt file from our generator
                  </li>
                  <li className="text-lg">
                    <strong>Upload to your root directory</strong> - Place the file in your website's root directory (alongside robots.txt)
                  </li>
                  <li className="text-lg">
                    <strong>Verify accessibility</strong> - Ensure the file is accessible at yourdomain.com/llms.txt
                  </li>
                  <li className="text-lg">
                    <strong>Test with our validator</strong> - Use our validation tool to confirm proper implementation
                  </li>
                </ol>
                
                <div className="bg-muted p-4 rounded border-l-4 border-primary">
                  <p className="text-lg">
                    <strong>Pro Tip:</strong> After uploading, always test your LLMS.txt file with our validator 
                    to ensure it's properly formatted and accessible to AI systems.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-6">Ready to Get Started?</h2>
              <p className="text-lg leading-relaxed">
                Whether you need to validate an existing LLMS.txt file or create a new one from scratch, 
                our tools make the process simple and efficient. Start by checking your current compliance 
                or jump straight to generating a comprehensive LLMS.txt file for your website.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;