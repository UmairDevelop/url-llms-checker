import { Button } from "@/components/ui/button";
import { Coffee, Bitcoin, Heart } from "lucide-react";

export const SupportButtons = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-8">
      <Button
        variant="outline"
        size="sm"
        className="border-primary/20 hover:bg-primary/5 transition-smooth"
        onClick={() => window.open('https://ko-fi.com/ezllmstxt', '_blank')}
      >
        <Coffee className="h-4 w-4 mr-2" />
        Buy me a coffee
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="border-primary/20 hover:bg-primary/5 transition-smooth"
        onClick={() => window.open('/Donate', '_self')}
      >
        <Bitcoin className="h-4 w-4 mr-2" />
        Donate with Crypto
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="border-primary/20 hover:bg-primary/5 transition-smooth"
        onClick={() => window.open('https://reddit.com/r/llmstxt', '_blank')}
      >
        <Heart className="h-4 w-4 mr-2" />
        Join Community
      </Button>
    </div>
  );
};