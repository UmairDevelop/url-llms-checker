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
          <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-bold text-xl">LLMS.txt Validator</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <Button 
            variant={location.pathname === '/' ? 'default' : 'ghost'} 
            size="sm" 
            asChild
          >
            <Link to="/">Validator</Link>
          </Button>
          <Button 
            variant={location.pathname === '/generator' ? 'default' : 'ghost'} 
            size="sm" 
            asChild
          >
            <Link to="/generator">Generator</Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (location.pathname === '/') {
                document.getElementById('info-section')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/#info-section';
              }
            }}
          >
            About
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (location.pathname === '/') {
                document.getElementById('how-to-check')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/#how-to-check';
              }
            }}
          >
            How it Works
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
                  <Link to="/">Validator</Link>
                </Button>
                <Button 
                  variant={location.pathname === '/generator' ? 'default' : 'ghost'} 
                  size="sm" 
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/generator">Generator</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setIsOpen(false);
                    if (location.pathname === '/') {
                      setTimeout(() => document.getElementById('info-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    } else {
                      window.location.href = '/#info-section';
                    }
                  }}
                >
                  About
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setIsOpen(false);
                    if (location.pathname === '/') {
                      setTimeout(() => document.getElementById('how-to-check')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    } else {
                      window.location.href = '/#how-to-check';
                    }
                  }}
                >
                  How it Works
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};