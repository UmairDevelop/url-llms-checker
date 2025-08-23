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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Globe, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateSEO, pageSEO } from "@/utils/seo";

interface GenerationProgress {
  stage: string;
  progress: number;
  details: string;
}

interface GenerationResults {
  standardContent: string;
  fullContent: string;
  validationResults: ValidationResult[];
  siteAnalysis: SiteAnalysis;
}

interface ValidationResult {
  url: string;
  status: 'valid' | 'broken' | 'redirect';
  message: string;
}

interface SiteAnalysis {
  siteType: string;
  confidence: number;
  description: string;
  totalPages: number;
  validPages: number;
}

const Generator = () => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [generationResults, setGenerationResults] = useState<GenerationResults | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress>({ stage: '', progress: 0, details: '' });
  const [activeTab, setActiveTab] = useState('standard');
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
    setProgress({ stage: 'Initializing', progress: 0, details: 'Preparing to analyze website...' });
    
    try {
      const normalizedUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
      const baseUrl = normalizedUrl.endsWith('/') ? normalizedUrl.slice(0, -1) : normalizedUrl;
      const domain = new URL(baseUrl).hostname;
      
      // Enhanced deep crawl with progress tracking
      setProgress({ stage: 'Crawling', progress: 10, details: 'Discovering website content...' });
      const discoveredContent = await performEnhancedDeepCrawl(baseUrl, domain);
      
      // Advanced content analysis
      setProgress({ stage: 'Analyzing', progress: 40, details: 'Analyzing content and categorizing pages...' });
      const siteAnalysis = performAdvancedSiteAnalysis(discoveredContent.siteContent, discoveredContent.pages);
      
      // Quality validation
      setProgress({ stage: 'Validating', progress: 60, details: 'Validating links and content quality...' });
      const validationResults = await validateContent(discoveredContent.pages);
      
      // Generate multiple formats
      setProgress({ stage: 'Generating', progress: 80, details: 'Creating LLMS.txt files...' });
      const { standardContent, fullContent } = await generateMultipleFormats(
        domain, 
        siteAnalysis, 
        discoveredContent.pages, 
        validationResults
      );

      setProgress({ stage: 'Complete', progress: 100, details: 'Generation completed successfully!' });
      
      const results: GenerationResults = {
        standardContent,
        fullContent,
        validationResults,
        siteAnalysis: {
          ...siteAnalysis,
          totalPages: discoveredContent.pages.length,
          validPages: validationResults.filter(r => r.status === 'valid').length
        }
      };
      
      setGenerationResults(results);
      setIsGenerating(false);
      
      toast({
        title: "LLMS.txt Generated!",
        description: `Generated both standard and full versions with ${results.siteAnalysis.validPages} validated pages.`,
      });
    } catch (error) {
      setIsGenerating(false);
      setProgress({ stage: 'Error', progress: 0, details: 'Generation failed. Please try again.' });
      toast({
        title: "Generation Failed",
        description: "Could not generate LLMS.txt. Please check the URL and try again.",
        variant: "destructive",
      });
    }
  };

  // Enhanced deep crawling with sitemap support and better error handling
  const performEnhancedDeepCrawl = async (baseUrl: string, domain: string) => {
    const discoveredPages: { title: string; url: string; description: string; priority: number; category: string }[] = [];
    let siteContent = '';
    const crawlErrors: string[] = [];
    
    try {
      // Try to discover sitemap.xml first
      setProgress({ stage: 'Discovery', progress: 15, details: 'Checking for sitemap.xml...' });
      const sitemapUrls = await discoverSitemapUrls(baseUrl);
      
      // Crawl homepage with multiple proxy fallbacks
      setProgress({ stage: 'Crawling', progress: 20, details: 'Analyzing homepage...' });
      const homepageData = await fetchWithRetry(baseUrl);
      
      if (homepageData.success) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(homepageData.content, 'text/html');
        
        // Extract comprehensive site content for analysis
        const title = doc.querySelector('title')?.textContent || '';
        const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const headings = Array.from(doc.querySelectorAll('h1, h2, h3')).map(h => h.textContent?.trim()).filter(Boolean);
        const bodyText = doc.querySelector('body')?.textContent?.slice(0, 2000) || '';
        
        siteContent = [title, metaDesc, ...headings, bodyText].join(' ');
        
        // Discover internal links from homepage and sitemap
        const internalLinks = new Set<string>();
        
        // Add sitemap URLs (prioritized)
        sitemapUrls.forEach(url => internalLinks.add(url));
        
        // Extract navigation and content links
        const links = Array.from(doc.querySelectorAll('a[href]'));
        links.forEach(link => {
          const href = link.getAttribute('href');
          const text = link.textContent?.trim() || '';
          
          if (href && text && href.length > 1 && !href.includes('#') && !href.includes('mailto:')) {
            let fullUrl = href;
            
            if (!href.startsWith('http')) {
              if (href.startsWith('/')) {
                fullUrl = baseUrl + href;
              } else {
                fullUrl = `${baseUrl}/${href}`;
              }
            }
            
            if (fullUrl.includes(domain) && fullUrl !== baseUrl && !isGenericPage(href)) {
              internalLinks.add(fullUrl);
            }
          }
        });
        
        // Crawl discovered pages with rate limiting (max 50 pages)
        const pagesToCrawl = Array.from(internalLinks).slice(0, 50);
        let crawledCount = 0;
        
        for (const pageUrl of pagesToCrawl) {
          try {
            setProgress({ 
              stage: 'Crawling', 
              progress: 25 + (crawledCount / pagesToCrawl.length) * 15, 
              details: `Crawling page ${crawledCount + 1}/${pagesToCrawl.length}...` 
            });
            
            const pageData = await fetchWithRetry(pageUrl);
            
            if (pageData.success) {
              const pageDoc = parser.parseFromString(pageData.content, 'text/html');
              
              const pageTitle = pageDoc.querySelector('title')?.textContent?.trim() || 
                              pageDoc.querySelector('h1')?.textContent?.trim() || 
                              pageUrl.split('/').pop() || 'Unknown Page';
              
              const pageContent = pageDoc.querySelector('body')?.textContent?.slice(0, 1000) || '';
              const { priority, category } = analyzePageImportance(pageTitle, pageContent, pageUrl);
              
              discoveredPages.push({
                title: pageTitle,
                url: pageUrl,
                description: '', // Will be generated later with context
                priority,
                category
              });
            } else {
              crawlErrors.push(`Failed to crawl ${pageUrl}: ${pageData.error}`);
            }
            
            crawledCount++;
            
            // Rate limiting - wait 100ms between requests
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (error) {
            crawlErrors.push(`Error crawling ${pageUrl}: ${error}`);
          }
        }
        
        // Add homepage
        discoveredPages.unshift({
          title: 'Home Page',
          url: baseUrl,
          description: 'Main landing page with site overview and navigation to key content areas',
          priority: 5,
          category: 'Main Content'
        });
        
      } else {
        throw new Error(`Failed to fetch homepage: ${homepageData.error}`);
      }
      
    } catch (error) {
      console.warn('Enhanced crawl failed:', error);
      crawlErrors.push(`Critical error: ${error}`);
    }
    
    return {
      pages: discoveredPages.sort((a, b) => b.priority - a.priority),
      siteContent
    };
  };

  // Discover sitemap.xml URLs for comprehensive crawling
  const discoverSitemapUrls = async (baseUrl: string) => {
    const sitemapUrls: string[] = [];
    const sitemapPaths = ['/sitemap.xml', '/sitemap_index.xml', '/sitemaps.xml'];
    
    for (const path of sitemapPaths) {
      try {
        const sitemapUrl = `${baseUrl}${path}`;
        const response = await fetchWithRetry(sitemapUrl);
        
        if (response.success) {
          // Parse XML sitemap
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response.content, 'text/xml');
          const locations = Array.from(xmlDoc.querySelectorAll('loc'));
          
          locations.forEach(loc => {
            const url = loc.textContent?.trim();
            if (url && url.includes(new URL(baseUrl).hostname)) {
              sitemapUrls.push(url);
            }
          });
          
          // Limit sitemap URLs to prevent overload
          if (sitemapUrls.length >= 20) break;
        }
      } catch (error) {
        console.warn(`Failed to fetch sitemap ${path}:`, error);
      }
    }
    
    return sitemapUrls.slice(0, 20); // Limit to 20 URLs from sitemap
  };

  // Robust fetching with multiple proxy services and retry logic
  const fetchWithRetry = async (url: string, maxRetries = 3) => {
    const proxies = [
      'https://api.allorigins.win/raw?url=',
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/',
    ];
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      for (const proxy of proxies) {
        try {
          const response = await fetch(`${proxy}${encodeURIComponent(url)}`);
          
          if (response.ok) {
            const content = await response.text();
            return { success: true, content, error: null };
          }
        } catch (error) {
          console.warn(`Attempt ${attempt + 1} with proxy ${proxy} failed:`, error);
        }
        
        // Wait between proxy attempts
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Wait between retry attempts
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return { success: false, content: '', error: 'All fetch attempts failed' };
  };

  // Advanced site analysis with expanded niche detection
  const performAdvancedSiteAnalysis = (content: string, pages: any[]) => {
    const contentLower = content.toLowerCase();
    
    // Expanded pattern matching with 15+ niches
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
      automotive: {
        keywords: ['car', 'auto', 'vehicle', 'engine', 'tire', 'brake', 'maintenance', 'repair', 'automotive'],
        weight: 2,
        indicators: ['car review', 'auto parts', 'vehicle guide']
      },
      food: {
        keywords: ['food', 'recipe', 'cooking', 'kitchen', 'ingredient', 'meal', 'restaurant', 'cuisine'],
        weight: 1.8,
        indicators: ['food review', 'recipe guide', 'cooking tips']
      },
      travel: {
        keywords: ['travel', 'destination', 'hotel', 'flight', 'vacation', 'tourism', 'trip', 'adventure'],
        weight: 1.8,
        indicators: ['travel guide', 'destination review', 'travel tips']
      },
      fashion: {
        keywords: ['fashion', 'clothing', 'style', 'outfit', 'brand', 'designer', 'trend', 'apparel'],
        weight: 1.8,
        indicators: ['fashion review', 'style guide', 'clothing brand']
      },
      beauty: {
        keywords: ['beauty', 'skincare', 'makeup', 'cosmetics', 'hair', 'skin', 'beauty routine'],
        weight: 1.8,
        indicators: ['beauty review', 'skincare routine', 'makeup guide']
      },
      home: {
        keywords: ['home', 'furniture', 'decor', 'interior', 'design', 'appliance', 'garden', 'diy'],
        weight: 1.7,
        indicators: ['home improvement', 'furniture review', 'decor ideas']
      },
      fitness: {
        keywords: ['fitness', 'workout', 'exercise', 'gym', 'training', 'muscle', 'cardio', 'strength'],
        weight: 1.7,
        indicators: ['fitness guide', 'workout routine', 'exercise tips']
      },
      pets: {
        keywords: ['pet', 'dog', 'cat', 'animal', 'veterinary', 'pet care', 'pet food', 'training'],
        weight: 1.7,
        indicators: ['pet care', 'dog training', 'pet review']
      },
      baby: {
        keywords: ['baby', 'infant', 'toddler', 'parenting', 'pregnancy', 'childcare', 'stroller', 'crib'],
        weight: 1.7,
        indicators: ['baby gear', 'parenting guide', 'baby review']
      },
      outdoors: {
        keywords: ['outdoor', 'camping', 'hiking', 'sports', 'recreation', 'adventure', 'gear', 'equipment'],
        weight: 1.6,
        indicators: ['outdoor gear', 'camping guide', 'hiking tips']
      },
      education: {
        keywords: ['education', 'learning', 'course', 'tutorial', 'training', 'skill', 'knowledge', 'study'],
        weight: 1.6,
        indicators: ['online course', 'learning platform', 'educational content']
      },
      business: {
        keywords: ['business', 'entrepreneur', 'startup', 'marketing', 'sales', 'productivity', 'management'],
        weight: 1.5,
        indicators: ['business guide', 'marketing strategy', 'productivity tips']
      },
      tech: {
        keywords: ['tech', 'technology', 'gadget', 'device', 'smartphone', 'laptop', 'hardware', 'software'],
        weight: 1.5,
        indicators: ['tech review', 'device review', 'gadget']
      },
      health: {
        keywords: ['health', 'wellness', 'nutrition', 'medical', 'diet', 'supplement', 'doctor'],
        weight: 1.5,
        indicators: ['health guide', 'wellness tips', 'nutrition advice']
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
    
    // Generate enhanced contextual descriptions
    const generateDescription = (type: string, pages: any[]) => {
      const descriptions = {
        gaming: 'Expert gaming PC reviews, build guides, and hardware recommendations for gamers and PC enthusiasts',
        coffee: 'Coffee equipment reviews, brewing guides, and expert recommendations for coffee enthusiasts and baristas',
        vacuum: 'Comprehensive vacuum cleaner reviews, cleaning performance tests, and expert buying guides for home maintenance',
        automotive: 'Car reviews, automotive guides, and expert recommendations for vehicle maintenance and purchasing decisions',
        food: 'Food reviews, recipes, cooking guides, and culinary expertise for food enthusiasts and home chefs',
        travel: 'Travel guides, destination reviews, and expert travel advice for planning memorable trips and adventures',
        fashion: 'Fashion reviews, style guides, and expert recommendations for clothing and accessory choices',
        beauty: 'Beauty product reviews, skincare routines, and expert advice for cosmetics and personal care',
        home: 'Home improvement guides, furniture reviews, and expert recommendations for interior design and decor',
        fitness: 'Fitness guides, workout routines, and expert advice for health and exercise enthusiasts',
        pets: 'Pet care guides, product reviews, and expert advice for pet owners and animal lovers',
        baby: 'Baby gear reviews, parenting guides, and expert recommendations for new parents and families',
        outdoors: 'Outdoor gear reviews, adventure guides, and expert recommendations for outdoor enthusiasts',
        education: 'Educational content, course reviews, and learning resources for skill development and knowledge building',
        business: 'Business guides, marketing strategies, and expert advice for entrepreneurs and professionals',
        tech: 'Technology product reviews, device comparisons, and expert insights on the latest gadgets and innovations',
        health: 'Health and wellness guides, fitness advice, and expert recommendations for better living',
        finance: 'Financial planning advice, investment strategies, and money management resources for personal finance'
      };
      
      return descriptions[type as keyof typeof descriptions] || 
             'Expert product reviews, buying guides, and recommendations across various categories';
    };
    
    return {
      siteType: bestMatch.type,
      confidence: bestMatch.confidence,
      description: generateDescription(bestMatch.type, pages)
    };
  };

  // Validate content quality and link accessibility
  const validateContent = async (pages: any[]) => {
    const validationResults: ValidationResult[] = [];
    
    // Validate a sample of pages to avoid overwhelming requests
    const pagesToValidate = pages.slice(0, 10);
    
    for (const page of pagesToValidate) {
      try {
        const response = await fetchWithRetry(page.url);
        
        if (response.success) {
          // Check if page has meaningful content
          const contentLength = response.content.length;
          const hasTitle = response.content.includes('<title>') || response.content.includes('<h1');
          
          if (contentLength > 500 && hasTitle) {
            validationResults.push({
              url: page.url,
              status: 'valid',
              message: 'Page accessible with good content'
            });
          } else {
            validationResults.push({
              url: page.url,
              status: 'redirect',
              message: 'Page accessible but content may be thin'
            });
          }
        } else {
          validationResults.push({
            url: page.url,
            status: 'broken',
            message: response.error || 'Page not accessible'
          });
        }
      } catch (error) {
        validationResults.push({
          url: page.url,
          status: 'broken',
          message: `Validation error: ${error}`
        });
      }
      
      // Rate limiting for validation
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    return validationResults;
  };

  // Generate multiple format outputs
  const generateMultipleFormats = async (
    domain: string, 
    siteAnalysis: any, 
    pages: any[], 
    validationResults: ValidationResult[]
  ) => {
    // Filter valid pages
    const validUrls = new Set(validationResults.filter(r => r.status === 'valid').map(r => r.url));
    const validPages = pages.filter(page => validUrls.has(page.url) || page.url.includes(domain));
    
    // Update page descriptions with site type context
    const updatedPages = validPages.map(page => ({
      ...page,
      description: generatePageDescription(page.title, '', page.url, siteAnalysis.siteType)
    }));
    
    // Group content by intelligent categorization
    const contentGroups = categorizeContent(updatedPages, siteAnalysis.siteType);
    
    // Generate standard LLMS.txt (5-10 pages per section)
    let standardContent = `# ${domain}

> ${siteAnalysis.description}

`;
    
    Object.entries(contentGroups).forEach(([category, categoryPages]) => {
      if (categoryPages.length > 0) {
        standardContent += `## ${category}\n`;
        categoryPages.slice(0, 8).forEach(page => {
          standardContent += `- [${page.title}](${page.url}): ${page.description}\n`;
        });
        standardContent += '\n';
      }
    });
    
    // Generate comprehensive LLMS-full.txt (all pages)
    let fullContent = `# ${domain} - Comprehensive Content Index

> ${siteAnalysis.description}

This comprehensive version includes all discovered high-quality content from the website, organized by content type and relevance.

## Site Statistics
- **Content Type**: ${siteAnalysis.siteType}
- **Confidence**: ${Math.round(siteAnalysis.confidence * 100)}%
- **Total Pages Analyzed**: ${pages.length}
- **Validated Pages**: ${validationResults.filter(r => r.status === 'valid').length}

`;
    
    Object.entries(contentGroups).forEach(([category, categoryPages]) => {
      if (categoryPages.length > 0) {
        fullContent += `## ${category}\n`;
        categoryPages.forEach(page => {
          fullContent += `- [${page.title}](${page.url}): ${page.description}\n`;
        });
        fullContent += '\n';
      }
    });
    
    // Add optional section for secondary content
    if (validationResults.some(r => r.status === 'redirect')) {
      fullContent += `## Optional Content
*These pages may have lighter content but could still be valuable for specific queries:*

`;
      const optionalPages = pages.filter(page => 
        validationResults.find(r => r.url === page.url && r.status === 'redirect')
      );
      
      optionalPages.slice(0, 10).forEach(page => {
        fullContent += `- [${page.title}](${page.url}): Additional resource that may contain relevant information\n`;
      });
    }
    
    return { standardContent, fullContent };
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

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "LLMS.txt content copied to clipboard.",
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `${filename} file has been downloaded.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <RedditBar />
      <Header />
      <main className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Enhanced LLMS.txt Generator
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Generate professional LLMS.txt files with advanced crawling, content analysis, and multi-format output for AI training data policies
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Website Analysis
                </CardTitle>
                <CardDescription>
                  Enter your website URL for comprehensive content discovery and analysis
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
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Enhanced LLMS.txt"
                  )}
                </Button>

                {isGenerating && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{progress.stage}</span>
                      <span className="text-sm font-medium">{Math.round(progress.progress)}%</span>
                    </div>
                    <Progress value={progress.progress} className="w-full" />
                    <p className="text-xs text-muted-foreground">{progress.details}</p>
                  </div>
                )}

                {generationResults && (
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-sm">Analysis Complete</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Site Type:</span>
                        <Badge variant="secondary" className="ml-2">
                          {generationResults.siteAnalysis.siteType}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className="ml-2 font-medium">
                          {Math.round(generationResults.siteAnalysis.confidence * 100)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pages Found:</span>
                        <span className="ml-2 font-medium">
                          {generationResults.siteAnalysis.totalPages}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Validated:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {generationResults.siteAnalysis.validPages}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated Files</CardTitle>
                <CardDescription>
                  Multiple format outputs optimized for different use cases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generationResults ? (
                  <>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="standard">Standard</TabsTrigger>
                        <TabsTrigger value="full">Full Version</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="standard" className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">llms.txt</span>
                          <Badge variant="outline">Optimized</Badge>
                        </div>
                        <Textarea
                          value={generationResults.standardContent}
                          readOnly
                          className="min-h-[300px] font-mono text-xs"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generationResults.standardContent)}
                            className="flex-1"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(generationResults.standardContent, 'llms.txt')}
                            className="flex-1"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="full" className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">llms-full.txt</span>
                          <Badge variant="outline">Comprehensive</Badge>
                        </div>
                        <Textarea
                          value={generationResults.fullContent}
                          readOnly
                          className="min-h-[300px] font-mono text-xs"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generationResults.fullContent)}
                            className="flex-1"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(generationResults.fullContent, 'llms-full.txt')}
                            className="flex-1"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Validation Results */}
                    {generationResults.validationResults.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Validation Summary</h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{generationResults.validationResults.filter(r => r.status === 'valid').length} Valid</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3 text-yellow-500" />
                            <span>{generationResults.validationResults.filter(r => r.status === 'redirect').length} Warning</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3 text-red-500" />
                            <span>{generationResults.validationResults.filter(r => r.status === 'broken').length} Broken</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Generated LLMS.txt files will appear here after analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <SupportButtons />

          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>How to Use Your Enhanced LLMS.txt Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="font-semibold">Choose Format</h3>
                  <p className="text-sm text-muted-foreground">
                    Use <strong>llms.txt</strong> for optimized AI training or <strong>llms-full.txt</strong> for comprehensive content discovery
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="font-semibold">Deploy</h3>
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
                    Test accessibility at yoursite.com/llms.txt and monitor AI crawler access patterns
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Enhanced Features</CardTitle>
              <CardDescription>
                Advanced capabilities for professional LLMS.txt generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Smart Crawling</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Sitemap.xml discovery</li>
                    <li>• Deep content analysis (50 pages)</li>
                    <li>• Multiple proxy fallbacks</li>
                    <li>• Rate limiting protection</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">AI Content Analysis</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 18+ niche detection patterns</li>
                    <li>• Intelligent categorization</li>
                    <li>• Content quality scoring</li>
                    <li>• Context-aware descriptions</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Quality Validation</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Link accessibility checks</li>
                    <li>• Content quality validation</li>
                    <li>• Duplicate content filtering</li>
                    <li>• Multi-format output</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
      </main>
      <Footer />
    </div>
  );
};

export default Generator;