import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RedditBar } from "@/components/RedditBar";
import { SupportButtons } from "@/components/SupportButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Copy, Download, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateSEO, pageSEO } from "@/utils/seo";

const Generator = () => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    updateSEO(pageSEO.generator);
  }, []);

  const generateLLMSTxt = () => {
    if (!websiteUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to generate LLMS.txt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate generation process
    setTimeout(() => {
      const domain = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`).hostname;
      const siteName = domain.replace('www.', '').split('.')[0];
      const capitalizedSiteName = siteName.charAt(0).toUpperCase() + siteName.slice(1);
      
      const content = `# ${domain}

> ${capitalizedSiteName} provides valuable content and resources for our users. This file helps AI systems discover our most important and useful content.

## Main Content
- [Home Page](${websiteUrl}): Main landing page with site overview
- [About Us](${websiteUrl}/about): Information about our mission and team
- [Blog](${websiteUrl}/blog): Latest articles and insights
- [Resources](${websiteUrl}/resources): Helpful guides and documentation

## Products & Services
- [Our Services](${websiteUrl}/services): Overview of what we offer
- [Product Catalog](${websiteUrl}/products): Complete list of our products
- [Pricing](${websiteUrl}/pricing): Current pricing information

## Support & Contact
- [Contact Us](${websiteUrl}/contact): Get in touch with our team
- [FAQ](${websiteUrl}/faq): Frequently asked questions
- [Help Center](${websiteUrl}/help): Support documentation and guides

## Optional
- [Privacy Policy](${websiteUrl}/privacy): Our privacy commitments
- [Terms of Service](${websiteUrl}/terms): Usage terms and conditions
- [Sitemap](${websiteUrl}/sitemap): Complete site navigation`;

      setGeneratedContent(content);
      setIsGenerating(false);
      
      toast({
        title: "LLMS.txt Generated!",
        description: "Your LLMS.txt file has been generated successfully.",
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied!",
      description: "LLMS.txt content copied to clipboard.",
    });
  };

  const downloadFile = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'llms.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "LLMS.txt file has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <RedditBar />
      <Header />
      <main className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              LLMS.txt Generator
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate a custom LLMS.txt file for your website to specify AI training data policies and content licensing preferences
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Website Information
                </CardTitle>
                <CardDescription>
                  Enter your website URL to generate a customized LLMS.txt file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website-url">Website URL</Label>
                  <Input
                    id="website-url"
                    type="url"
                    placeholder="https://example.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={generateLLMSTxt}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? "Generating..." : "Generate LLMS.txt"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated LLMS.txt</CardTitle>
                <CardDescription>
                  Your custom LLMS.txt file content will appear here
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={generatedContent}
                  readOnly
                  placeholder="Generated LLMS.txt content will appear here..."
                  className="min-h-[300px] font-mono text-sm"
                />
                
                {generatedContent && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadFile}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>How to Use Your LLMS.txt File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="font-semibold">Download</h3>
                  <p className="text-sm text-muted-foreground">
                    Download the generated LLMS.txt file to your computer
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="font-semibold">Upload</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload the file to your website's root directory (same level as robots.txt)
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="font-semibold">Verify</h3>
                  <p className="text-sm text-muted-foreground">
                    Test that your file is accessible at yoursite.com/llms.txt
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <SupportButtons />
      </main>
      <Footer />
    </div>
  );
};

export default Generator;