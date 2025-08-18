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
      
      // Generate intelligent site description with enhanced analysis
      const siteAnalysis = analyzeSiteContent(discoveredContent.siteContent, discoveredContent.pages);
      
      // Generate content based on discovered links
      let content = `# ${domain}

> ${siteAnalysis.description}

`;

      if (discoveredContent.pages.length > 0) {
        // Update page descriptions with site type context
        const updatedPages = discoveredContent.pages.map(page => ({
          ...page,
          description: generatePageDescription(page.title, '', page.url, siteAnalysis.siteType)
        }));
        
        // Group content by intelligent categorization
        const contentGroups = categorizeContent(updatedPages, siteAnalysis.siteType);
        
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
            // Ensure no double slashes when constructing URLs
            if (href.startsWith('/')) {
              fullUrl = baseUrl + href;
            } else {
              fullUrl = `${baseUrl}/${href}`;
            }
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
  
  // Advanced site content analysis with deeper niche detection
  const analyzeSiteContent = (content: string, pages: any[]) => {
    const contentLower = content.toLowerCase();
    
    // Enhanced pattern matching with weighted scoring
    const patterns = {
      gaming: {
        keywords: ['gaming', 'pc build', 'graphics card', 'cpu', 'motherboard', 'gaming rig', 'fps', 'rtx', 'amd', 'intel', 'benchmark'],
        weight: 2,
        indicators: ['pc', 'build', 'review', 'best gaming']
      },
      coffee: {
        keywords: ['coffee', 'espresso', 'brewing', 'grinder', 'roast', 'barista', 'caffeine', 'beans', 'cappuccino'],
        weight: 2,
        indicators: ['coffee maker', 'espresso machine', 'brewing guide']
      },
      vacuum: {
        keywords: ['vacuum', 'cleaning', 'carpet', 'floor', 'suction', 'filtration', 'pet hair', 'dyson', 'shark'],
        weight: 2,
        indicators: ['vacuum cleaner', 'cleaning guide', 'best vacuum']
      },
      tech: {
        keywords: ['tech', 'technology', 'gadget', 'device', 'smartphone', 'laptop', 'hardware', 'software'],
        weight: 1.5,
        indicators: ['tech review', 'device review', 'gadget']
      },
      health: {
        keywords: ['health', 'fitness', 'wellness', 'nutrition', 'exercise', 'medical', 'diet'],
        weight: 1.5,
        indicators: ['health guide', 'fitness tips', 'wellness']
      },
      finance: {
        keywords: ['finance', 'money', 'investment', 'banking', 'loan', 'insurance', 'budget'],
        weight: 1.5,
        indicators: ['financial advice', 'investment guide', 'money management']
      }
    };
    
    let bestMatch = { type: 'general', score: 0, confidence: 0 };
    
    // Analyze content with weighted scoring
    for (const [type, config] of Object.entries(patterns)) {
      let score = 0;
      
      // Count keyword matches
      const keywordMatches = config.keywords.filter(keyword => contentLower.includes(keyword)).length;
      score += keywordMatches * config.weight;
      
      // Boost score for strong indicators
      const indicatorMatches = config.indicators.filter(indicator => contentLower.includes(indicator)).length;
      score += indicatorMatches * 3;
      
      // Analyze page titles for context
      const pageTitleMatches = pages.filter(page => 
        config.keywords.some(keyword => page.title.toLowerCase().includes(keyword))
      ).length;
      score += pageTitleMatches * 2;
      
      const confidence = Math.min(score / (config.keywords.length + config.indicators.length), 1);
      
      if (score > bestMatch.score) {
        bestMatch = { type, score, confidence };
      }
    }
    
    // Generate contextual descriptions based on analysis
    const generateDescription = (type: string, pages: any[]) => {
      const sampleTitles = pages.slice(0, 3).map(p => p.title.toLowerCase()).join(' ');
      
      switch (type) {
        case 'gaming':
          if (sampleTitles.includes('pc') || sampleTitles.includes('build')) {
            return 'Expert gaming PC reviews, build guides, and hardware recommendations for gamers and PC enthusiasts';
          }
          return 'Gaming reviews, performance analysis, and expert recommendations for gaming enthusiasts';
          
        case 'coffee':
          if (sampleTitles.includes('machine') || sampleTitles.includes('maker')) {
            return 'Coffee equipment reviews, brewing guides, and expert recommendations for coffee enthusiasts and baristas';
          }
          return 'Coffee brewing techniques, equipment analysis, and expert insights for coffee lovers';
          
        case 'vacuum':
          return 'Comprehensive vacuum cleaner reviews, cleaning performance tests, and expert buying guides for home maintenance';
          
        case 'tech':
          return 'Technology product reviews, device comparisons, and expert insights on the latest gadgets and innovations';
          
        case 'health':
          return 'Health and wellness guides, fitness advice, and expert recommendations for better living';
          
        case 'finance':
          return 'Financial planning advice, investment strategies, and money management resources for personal finance';
          
        default:
          // Try to detect from page content
          if (sampleTitles.includes('review') || sampleTitles.includes('best')) {
            return 'Expert product reviews, buying guides, and recommendations across various categories';
          }
          return 'Valuable content and expert insights for informed decision-making';
      }
    };
    
    return {
      siteType: bestMatch.type,
      confidence: bestMatch.confidence,
      description: generateDescription(bestMatch.type, pages)
    };
  };
  
  // Smart content categorization with niche-specific categories
  const categorizeContent = (pages: any[], siteType: string) => {
    const categories: { [key: string]: any[] } = {};
    
    // Define niche-specific category mappings
    const nicheCategories = {
      gaming: {
        'PC Builds & Components': ['build', 'component', 'cpu', 'gpu', 'motherboard', 'ram', 'ssd'],
        'Gaming Reviews': ['review', 'game', 'gaming'],
        'Hardware Guides': ['guide', 'how to', 'setup', 'install'],
        'Product Recommendations': ['best', 'top', 'recommend']
      },
      coffee: {
        'Coffee Equipment Reviews': ['review', 'machine', 'maker', 'grinder'],
        'Brewing Guides': ['guide', 'how to', 'brew', 'method'],
        'Product Recommendations': ['best', 'top', 'recommend'],
        'Coffee Knowledge': ['beans', 'roast', 'origin', 'flavor']
      },
      vacuum: {
        'Vacuum Reviews': ['review', 'vacuum', 'cleaner'],
        'Cleaning Guides': ['guide', 'how to', 'clean', 'maintain'],
        'Product Comparisons': ['vs', 'comparison', 'compare'],
        'Buying Guides': ['best', 'top', 'buying guide']
      },
      tech: {
        'Product Reviews': ['review', 'device', 'gadget'],
        'Tech Guides': ['guide', 'how to', 'setup'],
        'Comparisons & Analysis': ['vs', 'comparison', 'analysis'],
        'Recommendations': ['best', 'top', 'recommend']
      }
    };
    
    const categoryMap = nicheCategories[siteType as keyof typeof nicheCategories] || {
      'Reviews & Analysis': ['review', 'analysis'],
      'Guides & Tutorials': ['guide', 'how to', 'tutorial'],
      'Recommendations': ['best', 'top', 'recommend'],
      'Product Information': ['product', 'spec', 'feature']
    };
    
    pages.forEach(page => {
      const urlLower = page.url.toLowerCase();
      const titleLower = page.title.toLowerCase();
      let assignedCategory = 'Featured Content';
      
      // Skip generic pages
      if (urlLower.includes('about') || urlLower.includes('contact') || 
          urlLower.includes('privacy') || urlLower.includes('terms')) {
        return;
      }
      
      // Find best matching category
      for (const [categoryName, keywords] of Object.entries(categoryMap)) {
        if (keywords.some(keyword => titleLower.includes(keyword) || urlLower.includes(keyword))) {
          assignedCategory = categoryName;
          break;
        }
      }
      
      if (!categories[assignedCategory]) {
        categories[assignedCategory] = [];
      }
      categories[assignedCategory].push(page);
    });
    
    // Sort categories by relevance and limit items
    const sortedCategories: { [key: string]: any[] } = {};
    const categoryOrder = Object.keys(categoryMap).concat(['Featured Content']);
    
    categoryOrder.forEach(cat => {
      if (categories[cat] && categories[cat].length > 0) {
        // Sort by priority and limit to 6 items per category
        sortedCategories[cat] = categories[cat]
          .sort((a, b) => b.priority - a.priority)
          .slice(0, 6);
      }
    });
    
    return sortedCategories;
  };
  
  // Generate unique, contextual page descriptions
  const generatePageDescription = (title: string, content: string, url: string, siteType?: string) => {
    const titleLower = title.toLowerCase();
    const contentLower = content.toLowerCase();
    const urlLower = url.toLowerCase();
    
    // Extract specific details for unique descriptions
    const extractSpecificDetails = () => {
      // Look for price mentions
      const priceMatch = content.match(/\$[\d,]+|\d+\s*dollars?|\d+k|budget|cheap|expensive/i);
      const priceInfo = priceMatch ? ` with pricing insights` : '';
      
      // Look for brand names
      const brandMatch = content.match(/\b(nvidia|amd|intel|corsair|asus|msi|gigabyte|evga|razer|logitech|samsung|lg|dell|hp|lenovo|apple|sony|bose|sennheiser|steelseries|hyperx|cooler master|nzxt|thermaltake|fractal design|be quiet|seasonic|evga|antec|phanteks|lian li|deepcool|arctic|noctua|dyson|shark|bissell|hoover|eureka|black\+decker|tineco|roborock|irobot|breville|cuisinart|hamilton beach|keurig|nespresso|delonghi|ninja|vitamix|kitchenaid|oster|mr\.?\s*coffee|bodum|chemex|hario|v60|aeropress|french press)\b/gi);
      const brandInfo = brandMatch ? ` featuring ${brandMatch.slice(0, 2).join(' and ')} products` : '';
      
      // Look for specific features or specs
      const specMatch = content.match(/\b(4k|1080p|1440p|144hz|165hz|240hz|rtx|gtx|ryzen|core i[3579]|ddr[45]|ssd|nvme|wifi|bluetooth|rgb|mechanical|wireless|gaming|professional|budget|premium|flagship|entry-level)\b/gi);
      const specInfo = specMatch ? ` covering ${specMatch.slice(0, 3).join(', ')} specifications` : '';
      
      return { priceInfo, brandInfo, specInfo };
    };
    
    const details = extractSpecificDetails();
    
    // Generate context-aware descriptions
    if (titleLower.includes('review') || contentLower.includes('review')) {
      if (titleLower.includes('best') || titleLower.includes('top')) {
        return `Comprehensive review roundup comparing top products${details.brandInfo}${details.priceInfo} with performance analysis and recommendations`;
      }
      return `In-depth product review with hands-on testing${details.specInfo}${details.brandInfo} and expert analysis`;
    } 
    
    if (titleLower.includes('guide') || titleLower.includes('how to')) {
      return `Step-by-step guide with expert recommendations${details.priceInfo}${details.specInfo} and practical tips`;
    } 
    
    if (titleLower.includes('best') || titleLower.includes('top')) {
      return `Curated selection of top-rated products${details.brandInfo}${details.priceInfo} with expert analysis and buying recommendations`;
    } 
    
    if (titleLower.includes('comparison') || titleLower.includes('vs')) {
      return `Detailed comparison analysis${details.brandInfo}${details.specInfo} to help you choose the right product`;
    } 
    
    if (titleLower.includes('buying guide') || titleLower.includes('buyer')) {
      return `Comprehensive buying guide with expert insights${details.priceInfo}${details.specInfo} and product recommendations`;
    }
    
    if (urlLower.includes('blog') || urlLower.includes('article')) {
      return `Expert insights and analysis${details.specInfo}${details.brandInfo} with practical information and recommendations`;
    } 
    
    if (titleLower.includes('tips') || contentLower.includes('tip')) {
      return `Professional tips and expert advice${details.specInfo} from industry specialists`;
    }
    
    // Fallback with some context
    return `Expert analysis and recommendations${details.brandInfo}${details.priceInfo} with valuable insights for informed decisions`;
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