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

  const generateLLMSTxt = async () => {
    if (!websiteUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to generate LLMS.txt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const normalizedUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
      const baseUrl = normalizedUrl.endsWith('/') ? normalizedUrl.slice(0, -1) : normalizedUrl;
      const domain = new URL(baseUrl).hostname;
      const siteName = domain.replace('www.', '').split('.')[0];
      const capitalizedSiteName = siteName.charAt(0).toUpperCase() + siteName.slice(1);
      
      // Try to fetch the website to discover actual content
      let discoveredLinks: { title: string; url: string; description: string }[] = [];
      
      try {
        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(baseUrl)}`);
        if (response.ok) {
          const html = await response.text();
          
          // Extract navigation links and common pages
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const links = Array.from(doc.querySelectorAll('a[href]'));
          
          const commonPages = ['about', 'blog', 'contact', 'services', 'products', 'resources', 'help', 'faq', 'pricing'];
          const foundPages: { title: string; url: string; description: string }[] = [];
          
          // Look for common pages in navigation
          links.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent?.trim() || '';
            
            if (href && text && href.length > 1) {
              const fullUrl = href.startsWith('http') ? href : 
                            href.startsWith('/') ? `${baseUrl}${href}` : 
                            `${baseUrl}/${href}`;
              
              // Check if it's a page we're interested in
              const pageName = href.toLowerCase().replace(/^\//, '').split('/')[0];
              if (commonPages.includes(pageName) || text.toLowerCase().includes('about') || 
                  text.toLowerCase().includes('contact') || text.toLowerCase().includes('blog')) {
                foundPages.push({
                  title: text,
                  url: fullUrl,
                  description: `${text} page`
                });
              }
            }
          });
          
          // Remove duplicates and limit to reasonable number
          const uniquePages = foundPages.filter((page, index, arr) => 
            arr.findIndex(p => p.url.toLowerCase() === page.url.toLowerCase()) === index
          ).slice(0, 8);
          
          discoveredLinks = uniquePages;
        }
      } catch (fetchError) {
        console.warn('Could not fetch website content for analysis:', fetchError);
      }
      
      // Generate content based on discovered links or fallback to basic structure
      let content = `# ${domain}

> ${capitalizedSiteName} provides valuable content and resources. This file helps AI systems discover important content on this website.

`;

      if (discoveredLinks.length > 0) {
        content += `## Discovered Content
- [Home Page](${baseUrl}): Main landing page
`;
        discoveredLinks.forEach(link => {
          content += `- [${link.title}](${link.url}): ${link.description}\n`;
        });
        
        content += `
## Note
This content was automatically discovered from your website. Please review and customize the descriptions and add any additional important pages that may have been missed.`;
      } else {
        content += `## Main Content
- [Home Page](${baseUrl}): Main landing page with site overview

## Important Note
⚠️ **Please customize this template!**

The following are common page examples. Replace them with your actual website pages and content:

- [About Us](${baseUrl}/about): Information about your mission and team
- [Contact](${baseUrl}/contact): How to get in touch with you

## Additional Pages
Add links to your most important content here:
- [Your Important Page 1](${baseUrl}/page1): Description of the content
- [Your Important Page 2](${baseUrl}/page2): Description of the content

## Instructions
1. Replace the example links above with your actual website pages
2. Add descriptions that help AI understand what each page contains
3. Focus on your most valuable and informative content
4. Remove this note section when you're done customizing`;
      }

      setGeneratedContent(content);
      setIsGenerating(false);
      
      toast({
        title: "LLMS.txt Generated!",
        description: "Your LLMS.txt file has been generated successfully.",
      });
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: "Could not generate LLMS.txt. Please check the URL and try again.",
        variant: "destructive",
      });
    }
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