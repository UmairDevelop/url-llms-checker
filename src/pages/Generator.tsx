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
      let siteDescription = '';
      let sitePurpose = '';
      
      try {
        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(baseUrl)}`);
        if (response.ok) {
          const html = await response.text();
          
          // Extract navigation links and analyze content
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // Analyze site content to understand its purpose
          const title = doc.querySelector('title')?.textContent || '';
          const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
          const h1Elements = Array.from(doc.querySelectorAll('h1')).map(h => h.textContent?.trim()).filter(Boolean);
          const h2Elements = Array.from(doc.querySelectorAll('h2')).map(h => h.textContent?.trim()).filter(Boolean);
          
          // Determine site type and purpose
          const content = (title + ' ' + metaDesc + ' ' + h1Elements.join(' ') + ' ' + h2Elements.join(' ')).toLowerCase();
          
          if (content.includes('gaming') || content.includes('pc') || content.includes('computer') || content.includes('tech review')) {
            sitePurpose = 'gaming and tech reviews';
            siteDescription = 'Expert gaming PC reviews, hardware guides, and tech product recommendations';
          } else if (content.includes('coffee') || content.includes('espresso') || content.includes('maker')) {
            sitePurpose = 'coffee equipment reviews';
            siteDescription = 'Coffee equipment reviews, brewing guides, and product recommendations';
          } else if (content.includes('vacuum') || content.includes('cleaning')) {
            sitePurpose = 'vacuum and cleaning advice';
            siteDescription = 'Vacuum cleaner reviews, cleaning guides, and home maintenance advice';
          } else if (content.includes('review') || content.includes('guide') || content.includes('best')) {
            sitePurpose = 'product reviews and guides';
            siteDescription = 'Product reviews, buying guides, and recommendations';
          } else if (content.includes('blog') || content.includes('article') || content.includes('news')) {
            sitePurpose = 'content and articles';
            siteDescription = 'Articles, insights, and valuable content';
          } else if (content.includes('service') || content.includes('business')) {
            sitePurpose = 'services and solutions';
            siteDescription = 'Professional services and business solutions';
          } else {
            sitePurpose = 'information and resources';
            siteDescription = 'Valuable information and resources';
          }
          
          const links = Array.from(doc.querySelectorAll('a[href]'));
          const foundPages: { title: string; url: string; description: string }[] = [];
          
          // Look for valuable content pages
          const contentKeywords = {
            'review': 'detailed reviews and analysis',
            'guide': 'comprehensive guides and tutorials', 
            'best': 'top recommendations and comparisons',
            'how': 'step-by-step instructions and tips',
            'buying': 'buying advice and product selection',
            'comparison': 'product comparisons and analysis',
            'test': 'testing results and performance data',
            'blog': 'latest articles and insights',
            'news': 'latest news and updates',
            'tutorial': 'educational tutorials and how-tos',
            'tips': 'expert tips and advice',
            'about': 'information about the site and team',
            'contact': 'contact information and support'
          };
          
          // Prioritize content-rich pages
          links.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent?.trim() || '';
            
            if (href && text && href.length > 1 && !href.includes('#') && !href.includes('mailto:')) {
              let fullUrl = href;
              
              if (!href.startsWith('http')) {
                if (href.startsWith('/')) {
                  fullUrl = `${baseUrl}${href}`;
                } else {
                  fullUrl = `${baseUrl}/${href}`;
                }
              }
              
              // Skip external links unless they're subdomains
              if (fullUrl.startsWith('http') && !fullUrl.includes(domain)) {
                return;
              }
              
              const urlLower = href.toLowerCase();
              const textLower = text.toLowerCase();
              
              // Find matching keywords and create meaningful descriptions
              let description = text;
              let priority = 0;
              
              for (const [keyword, desc] of Object.entries(contentKeywords)) {
                if (urlLower.includes(keyword) || textLower.includes(keyword)) {
                  description = desc;
                  priority = keyword === 'review' || keyword === 'guide' || keyword === 'best' ? 3 : 
                            keyword === 'blog' || keyword === 'tutorial' || keyword === 'tips' ? 2 : 1;
                  break;
                }
              }
              
              // Special handling for numbered lists or "best of" content
              if (textLower.includes('best') || textLower.match(/\d+\s*(best|top)/)) {
                description = 'curated recommendations and top picks';
                priority = 3;
              }
              
              foundPages.push({
                title: text,
                url: fullUrl,
                description,
                priority
              } as any);
            }
          });
          
          // Sort by priority and remove duplicates
          const uniquePages = foundPages
            .filter((page, index, arr) => 
              arr.findIndex(p => p.url.toLowerCase() === page.url.toLowerCase()) === index
            )
            .sort((a: any, b: any) => (b.priority || 0) - (a.priority || 0))
            .slice(0, 12);
          
          discoveredLinks = uniquePages.map(({ title, url, description }) => ({ title, url, description }));
        }
      } catch (fetchError) {
        console.warn('Could not fetch website content for analysis:', fetchError);
        // Fallback values
        siteDescription = 'Valuable content and resources for users';
        sitePurpose = 'information and resources';
      }
      
      // Generate content based on discovered links or fallback to basic structure
      let content = `# ${domain}

> ${siteDescription}

`;

      if (discoveredLinks.length > 0) {
        // Group content by type
        const contentGroups: { [key: string]: typeof discoveredLinks } = {};
        
        discoveredLinks.forEach(link => {
          const desc = link.description.toLowerCase();
          let category = 'Main Content';
          
          if (desc.includes('review') || desc.includes('analysis') || desc.includes('comparison')) {
            category = 'Reviews & Analysis';
          } else if (desc.includes('guide') || desc.includes('tutorial') || desc.includes('how-to')) {
            category = 'Guides & Tutorials';
          } else if (desc.includes('recommendation') || desc.includes('best') || desc.includes('top')) {
            category = 'Recommendations';
          } else if (desc.includes('news') || desc.includes('article') || desc.includes('blog')) {
            category = 'Articles & News';
          } else if (desc.includes('about') || desc.includes('contact') || desc.includes('support')) {
            category = 'About & Support';
          }
          
          if (!contentGroups[category]) {
            contentGroups[category] = [];
          }
          contentGroups[category].push(link);
        });
        
        // Add home page first
        content += `## Main Content\n- [Home Page](${baseUrl}): Main ${sitePurpose} hub and site overview\n\n`;
        
        // Add organized content groups
        Object.entries(contentGroups).forEach(([category, links]) => {
          if (category !== 'Main Content') {
            content += `## ${category}\n`;
            links.forEach(link => {
              content += `- [${link.title}](${link.url}): ${link.description}\n`;
            });
            content += '\n';
          }
        });
        
        // Add any ungrouped main content
        if (contentGroups['Main Content']) {
          contentGroups['Main Content'].forEach(link => {
            content += `- [${link.title}](${link.url}): ${link.description}\n`;
          });
        }
      } else {
        content += `## Main Content
- [Home Page](${baseUrl}): Main landing page and ${sitePurpose} overview

## Important Note
⚠️ **Please customize this template!**

The following are example links. Replace them with your actual website pages and content:

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