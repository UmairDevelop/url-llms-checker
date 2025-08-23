/**
 * SEO Management Utility
 * This file contains utilities for managing SEO across different pages
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: object;
}

export const defaultSEO: SEOConfig = {
  title: "LLMS.txt Validator - Check AI Training Data Policies",
  description: "Free tool to validate if websites have LLMS.txt files for AI training data policies and content licensing. Check compliance instantly.",
  keywords: ["LLMS.txt", "AI training data", "content licensing", "AI policies", "machine learning", "web standards"],
  ogType: "website",
  twitterCard: "summary_large_image",
  ogImage: "/placeholder.svg"
};

export const pageSEO = {
  home: {
    title: "LLMs.txt Validator - EzLLMsTxt",
    description: "Use the LLMs.txt validator at ezllmstxt.com to check syntax, ensure compliance, and control AI crawlers. Validate your LLMs.txt file in seconds.",
    keywords: ["llms.txt validator", "llms.txt checker", "AI training data", "content licensing"],
  },
  generator: {
    title: "LLMs.txt Generator - EzLLMsTxt",
    description: "Use our free LLMs.txt generator to control AI crawlers and protect your content. Quickly create, validate, and manage LLMs.txt files for your website.",
    keywords: ["llms txt generator", "llms.txt generator", "AI policy generator", "content licensing", "machine learning training data"],
  }
};

/**
 * Update document meta tags for SEO
 */
export const updateSEO = (config: Partial<SEOConfig>) => {
  const finalConfig = { ...defaultSEO, ...config };

  // Update title
  document.title = finalConfig.title;

  // Update or create meta tags
  updateMetaTag("description", finalConfig.description);
  
  if (finalConfig.keywords) {
    updateMetaTag("keywords", finalConfig.keywords.join(", "));
  }

  // Open Graph tags
  updateMetaTag("og:title", finalConfig.title, "property");
  updateMetaTag("og:description", finalConfig.description, "property");
  updateMetaTag("og:type", finalConfig.ogType || "website", "property");
  
  if (finalConfig.ogImage) {
    updateMetaTag("og:image", finalConfig.ogImage, "property");
  }

  // Twitter tags
  updateMetaTag("twitter:card", finalConfig.twitterCard || "summary_large_image");
  updateMetaTag("twitter:title", finalConfig.title);
  updateMetaTag("twitter:description", finalConfig.description);
  
  if (finalConfig.ogImage) {
    updateMetaTag("twitter:image", finalConfig.ogImage);
  }

  // Canonical URL
  if (finalConfig.canonical) {
    updateCanonicalTag(finalConfig.canonical);
  }

  // Structured data
  if (finalConfig.structuredData) {
    updateStructuredData(finalConfig.structuredData);
  }
};

/**
 * Helper function to update or create meta tags
 */
const updateMetaTag = (name: string, content: string, attribute: string = "name") => {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  
  tag.content = content;
};

/**
 * Update canonical URL
 */
const updateCanonicalTag = (url: string) => {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  
  canonical.href = url;
};

/**
 * Update structured data
 */
const updateStructuredData = (data: object) => {
  let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
  
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(data);
};

/**
 * Generate structured data for website
 */
export const generateWebsiteStructuredData = (config: SEOConfig) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": config.title,
    "description": config.description,
    "url": window.location.origin,
    "applicationCategory": "WebApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };
};