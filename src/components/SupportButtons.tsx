import { Button } from "@/components/ui/button";
import { Coffee, Bitcoin, Heart } from "lucide-react";

export const SupportButtons = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-8">
      <Button
        variant="outline"
        size="sm"
        className="border-primary/20 hover:bg-primary/5 transition-smooth"
        onClick={() => window.open('https://buymeacoffee.com', '_blank')}
      >
        <Coffee className="h-4 w-4 mr-2" />
        Buy me a coffee
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="border-primary/20 hover:bg-primary/5 transition-smooth"
        onClick={() => window.open('#', '_blank')}
      >
        <Bitcoin className="h-4 w-4 mr-2" />
        Donate with Crypto
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="border-primary/20 hover:bg-primary/5 transition-smooth"
        onClick={() => window.open('https://github.com', '_blank')}
      >
        <Heart className="h-4 w-4 mr-2" />
        Support on GitHub
      </Button>
    </div>
  );
};