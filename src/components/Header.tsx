import { Button } from "@/components/ui/button";
import { Menu, Github } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-bold text-xl">LLMS.txt Validator</span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm">
            About
          </Button>
          <Button variant="ghost" size="sm">
            How it Works
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.open('https://github.com', '_blank')}
          >
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Button>
        </div>

        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};