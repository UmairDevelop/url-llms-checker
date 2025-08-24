import { Button } from "@/components/ui/button";
import { Twitter, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center">
                <img
                  src="/uploads/ezllmstxt-logo.webp"
                  alt="ezllmstxt.com logo"
                  className="h-6 w-auto"
                />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              ezllmstxt.com – Free online tool to generate and validate LLMs.txt files for AI crawler control and training data policies.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
              <Button 
                variant="link" 
                className="h-auto p-0"
                onClick={() => window.open('https://llmstxt.org/', '_blank')}
              >
                LLMS.txt Specification
              </Button>
              <span className="opacity-70">|</span>
              <Button 
                variant="link" 
                className="h-auto p-0"
                asChild
              >
                <Link to="/how-it-works">Implementation Guide</Link>
              </Button>
              <span className="opacity-70">|</span>
              <Button 
                variant="link" 
                className="h-auto p-0"
                asChild
              >
                <Link to="/terms-and-conditions">Terms & Conditions</Link>
              </Button>
              <span className="opacity-70">|</span>
              <Button 
                variant="link" 
                className="h-auto p-0"
                asChild
              >
                <Link to="/privacy-policy">Privacy Policy</Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://reddit.com/r/llmstxt', '_blank')}
              >
                Reddit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://twitter.com', '_blank')}
              >
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-primary" /> for a better AI future
          </p>
        </div>
      </div>
    </footer>
  );
};