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
      
      // Deep crawl and content discovery
      const discoveredContent = await performDeepCrawl(baseUrl, domain);
      
      // Generate intelligent site description
      const siteAnalysis = analyzeSiteContent(discoveredContent.siteContent);
      
      // Generate content based on discovered links
      let content = `# ${domain}

> ${siteAnalysis.description}

`;

      if (discoveredContent.pages.length > 0) {
        // Group content by intelligent categorization
        const contentGroups = categorizeContent(discoveredContent.pages, siteAnalysis.siteType);
        
        // Add organized content groups
        Object.entries(contentGroups).forEach(([category, pages]) => {
          if (pages.length > 0) {
            content += `## ${category}\n`;
            pages.forEach(page => {
              content += `- [${page.title}](${page.url}): ${page.description}\n`;
            });
            content += '\n';
          }
        });
      } else {
        // Fallback content with customization instructions
        content += `## Main Content
- [Home Page](${baseUrl}): Main landing page and site overview

## Important Note
⚠️ **Content Discovery Limited**

We couldn't automatically discover your site's content structure. This may be due to:
- Site protection mechanisms
- JavaScript-heavy content loading
- Complex navigation structure

Please customize this template with your actual valuable content:

## Your Content Categories
Add your most important pages here with descriptive summaries that help AI understand their value.

Example format:
- [Your Page Title](${baseUrl}/page-url): Detailed description of what this page offers to users

## Instructions
1. Replace the example content above with your actual website pages
2. Focus on content that provides real value to visitors
3. Use descriptive summaries that explain the page's purpose and content
4. Remove this instruction section when complete`;
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

  // Deep crawling function
  const performDeepCrawl = async (baseUrl: string, domain: string) => {
    const discoveredPages: { title: string; url: string; description: string; priority: number; category: string }[] = [];
    let siteContent = '';
    
    try {
      // First, crawl the homepage
      const homepageResponse = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(baseUrl)}`);
      if (!homepageResponse.ok) throw new Error('Failed to fetch homepage');
      
      const homepageHtml = await homepageResponse.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(homepageHtml, 'text/html');
      
      // Extract comprehensive site content for analysis
      const title = doc.querySelector('title')?.textContent || '';
      const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const headings = Array.from(doc.querySelectorAll('h1, h2, h3')).map(h => h.textContent?.trim()).filter(Boolean);
      const bodyText = doc.querySelector('body')?.textContent?.slice(0, 2000) || '';
      
      siteContent = [title, metaDesc, ...headings, bodyText].join(' ');
      
      // Find all internal links for deeper crawling
      const links = Array.from(doc.querySelectorAll('a[href]'));
      const internalLinks = new Set<string>();
      
      // Collect internal links
      links.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent?.trim() || '';
        
        if (href && text && href.length > 1 && !href.includes('#') && !href.includes('mailto:')) {
          let fullUrl = href;
          
          if (!href.startsWith('http')) {
            fullUrl = href.startsWith('/') ? `${baseUrl}${href}` : `${baseUrl}/${href}`;
          }
          
          // Only include internal links and avoid duplicates
          if (fullUrl.includes(domain) && fullUrl !== baseUrl && !isGenericPage(href)) {
            internalLinks.add(fullUrl);
          }
        }
      });
      
      // Crawl discovered internal pages (limit to prevent overload)
      const pagesToCrawl = Array.from(internalLinks).slice(0, 15);
      const crawlPromises = pagesToCrawl.map(async (pageUrl) => {
        try {
          const pageResponse = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(pageUrl)}`);
          if (pageResponse.ok) {
            const pageHtml = await pageResponse.text();
            const pageDoc = parser.parseFromString(pageHtml, 'text/html');
            
            const pageTitle = pageDoc.querySelector('title')?.textContent?.trim() || 
                            pageDoc.querySelector('h1')?.textContent?.trim() || 
                            pageUrl.split('/').pop() || 'Unknown Page';
            
            const pageContent = pageDoc.querySelector('body')?.textContent?.slice(0, 1000) || '';
            const pageDescription = generatePageDescription(pageTitle, pageContent, pageUrl);
            const { priority, category } = analyzePageImportance(pageTitle, pageContent, pageUrl);
            
            return {
              title: pageTitle,
              url: pageUrl,
              description: pageDescription,
              priority,
              category
            };
          }
        } catch (error) {
          console.warn(`Failed to crawl ${pageUrl}:`, error);
        }
        return null;
      });
      
      const crawledPages = (await Promise.all(crawlPromises)).filter(Boolean) as typeof discoveredPages;
      discoveredPages.push(...crawledPages);
      
      // Add homepage
      discoveredPages.unshift({
        title: 'Home Page',
        url: baseUrl,
        description: 'Main landing page with site overview and navigation to key content areas',
        priority: 2,
        category: 'Main Content'
      });
      
    } catch (error) {
      console.warn('Deep crawl failed:', error);
    }
    
    return {
      pages: discoveredPages.sort((a, b) => b.priority - a.priority),
      siteContent
    };
  };
  
  // Intelligent site content analysis
  const analyzeSiteContent = (content: string) => {
    const contentLower = content.toLowerCase();
    
    // Advanced content analysis patterns
    const patterns = {
      gaming: ['gaming', 'pc build', 'graphics card', 'cpu', 'motherboard', 'gaming rig', 'fps'],
      tech: ['tech review', 'technology', 'gadget', 'device', 'smartphone', 'laptop', 'hardware'],
      vacuum: ['vacuum', 'cleaning', 'carpet', 'floor', 'suction', 'filtration', 'pet hair'],
      coffee: ['coffee', 'espresso', 'brewing', 'grinder', 'roast', 'barista', 'caffeine'],
      health: ['health', 'fitness', 'wellness', 'nutrition', 'exercise', 'medical', 'doctor'],
      finance: ['finance', 'money', 'investment', 'banking', 'loan', 'insurance', 'budget'],
      food: ['recipe', 'cooking', 'kitchen', 'ingredient', 'meal', 'chef', 'restaurant'],
      travel: ['travel', 'vacation', 'hotel', 'flight', 'destination', 'tourism', 'trip'],
      education: ['education', 'learn', 'course', 'tutorial', 'training', 'skill', 'study'],
      business: ['business', 'marketing', 'entrepreneur', 'startup', 'company', 'corporate']
    };
    
    let siteType = 'general';
    let maxMatches = 0;
    
    for (const [type, keywords] of Object.entries(patterns)) {
      const matches = keywords.filter(keyword => contentLower.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        siteType = type;
      }
    }
    
    // Generate intelligent descriptions
    const descriptions = {
      gaming: 'Expert gaming PC reviews, hardware recommendations, and performance guides for gamers and enthusiasts',
      tech: 'Technology reviews, product comparisons, and expert insights on the latest gadgets and devices',
      vacuum: 'Comprehensive vacuum cleaner reviews, cleaning guides, and expert recommendations for home maintenance',
      coffee: 'Coffee equipment reviews, brewing guides, and expert recommendations for coffee enthusiasts',
      health: 'Health and wellness information, fitness guides, and expert advice for better living',
      finance: 'Financial advice, investment guides, and money management resources for personal finance',
      food: 'Recipes, cooking guides, and culinary expertise for food lovers and home chefs',
      travel: 'Travel guides, destination reviews, and expert tips for travelers and adventurers',
      education: 'Educational resources, learning guides, and skill development content for students and professionals',
      business: 'Business insights, entrepreneurship guides, and professional development resources',
      general: 'Valuable content and expert insights across various topics and interests'
    };
    
    return {
      siteType,
      description: descriptions[siteType as keyof typeof descriptions]
    };
  };
  
  // Intelligent content categorization
  const categorizeContent = (pages: any[], siteType: string) => {
    const categories: { [key: string]: any[] } = {};
    
    pages.forEach(page => {
      let category = page.category || 'Main Content';
      
      // Intelligent recategorization based on content
      const urlLower = page.url.toLowerCase();
      const titleLower = page.title.toLowerCase();
      
      if (urlLower.includes('review') || titleLower.includes('review')) {
        category = 'Reviews & Analysis';
      } else if (urlLower.includes('guide') || titleLower.includes('guide') || titleLower.includes('how')) {
        category = 'Guides & Tutorials';
      } else if (urlLower.includes('best') || titleLower.includes('best') || titleLower.includes('top')) {
        category = 'Recommendations';
      } else if (urlLower.includes('blog') || urlLower.includes('article') || urlLower.includes('news')) {
        category = 'Articles & News';
      } else if (urlLower.includes('product') || urlLower.includes('catalog')) {
        category = 'Products & Services';
      } else if (urlLower.includes('about') || urlLower.includes('contact') || urlLower.includes('support')) {
        category = 'About & Support';
      }
      
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(page);
    });
    
    // Sort categories by importance
    const categoryOrder = ['Reviews & Analysis', 'Guides & Tutorials', 'Recommendations', 'Products & Services', 'Articles & News', 'Main Content', 'About & Support'];
    const sortedCategories: { [key: string]: any[] } = {};
    
    categoryOrder.forEach(cat => {
      if (categories[cat]) {
        sortedCategories[cat] = categories[cat].slice(0, 8); // Limit per category
      }
    });
    
    return sortedCategories;
  };
  
  // Generate intelligent page descriptions
  const generatePageDescription = (title: string, content: string, url: string) => {
    const titleLower = title.toLowerCase();
    const contentLower = content.toLowerCase();
    const urlLower = url.toLowerCase();
    
    // Pattern matching for description generation
    if (titleLower.includes('review') || contentLower.includes('review')) {
      return `Detailed review and analysis with expert insights and recommendations`;
    } else if (titleLower.includes('guide') || titleLower.includes('how')) {
      return `Comprehensive guide with step-by-step instructions and expert tips`;
    } else if (titleLower.includes('best') || titleLower.includes('top')) {
      return `Curated recommendations and expert picks for top products and solutions`;
    } else if (titleLower.includes('comparison') || contentLower.includes('vs')) {
      return `In-depth comparison analysis to help you make informed decisions`;
    } else if (urlLower.includes('blog') || urlLower.includes('article')) {
      return `Informative article with expert insights and valuable information`;
    } else if (titleLower.includes('tips') || contentLower.includes('tip')) {
      return `Expert tips and practical advice from industry professionals`;
    } else {
      return `Valuable content with expert information and practical insights`;
    }
  };
  
  // Analyze page importance for prioritization
  const analyzePageImportance = (title: string, content: string, url: string) => {
    let priority = 1;
    let category = 'Main Content';
    
    const titleLower = title.toLowerCase();
    const urlLower = url.toLowerCase();
    
    // High priority content
    if (titleLower.includes('review') || urlLower.includes('review')) {
      priority = 5;
      category = 'Reviews';
    } else if (titleLower.includes('guide') || titleLower.includes('how')) {
      priority = 4;
      category = 'Guides';
    } else if (titleLower.includes('best') || titleLower.includes('top')) {
      priority = 4;
      category = 'Recommendations';
    } else if (urlLower.includes('blog') || urlLower.includes('article')) {
      priority = 3;
      category = 'Articles';
    } else if (titleLower.includes('about') || titleLower.includes('contact')) {
      priority = 1;
      category = 'About';
    }
    
    return { priority, category };
  };
  
  // Filter out generic/administrative pages
  const isGenericPage = (href: string) => {
    const genericPages = ['privacy', 'terms', 'cookie', 'sitemap', 'robots.txt', 'admin', 'login', 'register', 'cart', 'checkout'];
    return genericPages.some(generic => href.toLowerCase().includes(generic));
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