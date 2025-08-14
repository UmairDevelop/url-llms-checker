import { Button } from "@/components/ui/button";
import { Github, Twitter, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-hero-gradient flex items-center justify-center">
                <span className="text-white font-bold text-xs">L</span>
              </div>
              <span className="font-semibold">LLMS.txt Validator</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A free tool to check if websites have implemented LLMS.txt for AI training data policies.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <div className="space-y-2">
              <Button variant="link" className="h-auto p-0 text-muted-foreground">
                LLMS.txt Specification
              </Button>
              <Button variant="link" className="h-auto p-0 text-muted-foreground">
                Implementation Guide
              </Button>
              <Button variant="link" className="h-auto p-0 text-muted-foreground">
                Best Practices
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                <Github className="h-4 w-4" />
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