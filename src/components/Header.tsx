import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <picture>
            <source srcSet="/uploads/ezllmstxt-logo.webp" type="image/webp" />
            <img 
              src="/uploads/ezllmstxt-logo.png" 
              alt="ezllmstxt.com" 
              className="h-8 w-auto"
            />
          </picture>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <Button 
            variant={location.pathname === '/' ? 'default' : 'ghost'} 
            size="sm" 
            asChild
          >
            <Link to="/">LLMS.txt Generator</Link>
          </Button>
          <Button 
            variant={location.pathname === '/generator' ? 'default' : 'ghost'} 
            size="sm" 
            asChild
          >
            <Link to="/validator">LLMS.txt Validator</Link>
          </Button>
          <Button 
            variant={location.pathname === '/about' ? 'default' : 'ghost'} 
            size="sm" 
            asChild
          >
            <Link to="/about">About</Link>
          </Button>
          <Button 
            variant={location.pathname === '/how-it-works' ? 'default' : 'ghost'} 
            size="sm" 
            asChild
          >
            <Link to="/how-it-works">How it Works</Link>
          </Button>
          <ThemeToggle />
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Button 
                  variant={location.pathname === '/' ? 'default' : 'ghost'} 
                  size="sm" 
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/">LLMS.txt Generator</Link>
                </Button>
                <Button 
                  variant={location.pathname === '/generator' ? 'default' : 'ghost'} 
                  size="sm" 
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/validator">LLMS.txt Validator</Link>
                </Button>
                <Button 
                  variant={location.pathname === '/about' ? 'default' : 'ghost'} 
                  size="sm" 
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/about">About</Link>
                </Button>
                <Button 
                  variant={location.pathname === '/how-it-works' ? 'default' : 'ghost'} 
                  size="sm" 
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/how-it-works">How it Works</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};