import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

export const RedditBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center relative">
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm font-medium">
          Join our community on Reddit for updates and discussions!
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-foreground hover:bg-primary-foreground/20 h-auto py-1 px-2"
          onClick={() => window.open('https://reddit.com/r/llmstxt', '_blank')}
        >
          r/llmstxt
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};