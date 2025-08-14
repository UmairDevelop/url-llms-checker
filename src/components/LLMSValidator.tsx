import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ValidationResult {
  exists: boolean;
  url: string;
  status?: number;
  error?: string;
}

export const LLMSValidator = () => {
  const [url, setUrl] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const { toast } = useToast();

  const validateLLMSTxt = async (websiteUrl: string) => {
    setIsValidating(true);
    setResult(null);

    try {
      // Normalize URL
      let normalizedUrl = websiteUrl.trim();
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }

      // Remove trailing slash and construct LLMS.txt URL
      const baseUrl = normalizedUrl.replace(/\/$/, '');
      const llmsTxtUrl = `${baseUrl}/llms.txt`;

      console.log('Checking LLMS.txt at:', llmsTxtUrl);

      // Try multiple CORS proxy services for better reliability
      const corsProxies = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/',
      ];

      let lastError = '';
      let success = false;

      for (const proxy of corsProxies) {
        try {
          console.log(`Trying proxy: ${proxy}`);
          const proxyUrl = `${proxy}${encodeURIComponent(llmsTxtUrl)}`;
          
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'text/plain',
            },
          });

          console.log(`Response status: ${response.status}`);

          if (response.ok) {
            const content = await response.text();
            console.log('LLMS.txt content found:', content.substring(0, 100) + '...');
            
            setResult({
              exists: true,
              url: llmsTxtUrl,
              status: response.status
            });

            toast({
              title: "✅ LLMS.txt Found!",
              description: `Valid LLMS.txt file exists at ${llmsTxtUrl}`,
            });
            
            success = true;
            break;
          } else if (response.status === 404) {
            console.log('LLMS.txt not found (404)');
            setResult({
              exists: false,
              url: llmsTxtUrl,
              status: 404
            });

            toast({
              title: "❌ LLMS.txt Not Found",
              description: `No LLMS.txt file found at ${llmsTxtUrl}`,
              variant: "destructive",
            });
            
            success = true;
            break;
          } else {
            lastError = `HTTP ${response.status}`;
            continue;
          }
        } catch (proxyError) {
          console.log(`Proxy ${proxy} failed:`, proxyError);
          lastError = proxyError instanceof Error ? proxyError.message : 'Proxy request failed';
          continue;
        }
      }

      if (!success) {
        // All proxies failed, try one more approach with a different service
        try {
          console.log('Trying alternative validation method...');
          const altResponse = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(llmsTxtUrl)}`);
          
          if (altResponse.ok) {
            const data = await altResponse.json();
            
            if (data.status.http_code === 200) {
              setResult({
                exists: true,
                url: llmsTxtUrl,
                status: 200
              });

              toast({
                title: "✅ LLMS.txt Found!",
                description: `Valid LLMS.txt file exists at ${llmsTxtUrl}`,
              });
            } else if (data.status.http_code === 404) {
              setResult({
                exists: false,
                url: llmsTxtUrl,
                status: 404
              });

              toast({
                title: "❌ LLMS.txt Not Found",
                description: `No LLMS.txt file found at ${llmsTxtUrl}`,
                variant: "destructive",
              });
            } else {
              throw new Error(`HTTP ${data.status.http_code}`);
            }
          } else {
            throw new Error('Alternative validation failed');
          }
        } catch (altError) {
          console.log('Alternative method failed:', altError);
          
          setResult({
            exists: false,
            url: llmsTxtUrl,
            error: `Unable to verify: ${lastError}. This could be due to server restrictions or the website blocking automated requests.`
          });

          toast({
            title: "⚠️ Unable to Verify",
            description: "Could not verify LLMS.txt due to network restrictions. Please check manually by visiting the URL.",
            variant: "destructive",
          });
        }
      }

    } catch (error) {
      console.error('Validation error:', error);
      setResult({
        exists: false,
        url: url,
        error: error instanceof Error ? error.message : "Validation failed"
      });

      toast({
        title: "❌ Validation Error",
        description: "Failed to validate the URL. Please check the format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast({
        title: "⚠️ URL Required",
        description: "Please enter a website URL to validate.",
        variant: "destructive",
      });
      return;
    }
    validateLLMSTxt(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="p-6 shadow-elegant border-0 bg-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., example.com)"
              className="h-12 text-base border-border focus:ring-2 focus:ring-primary/20 transition-smooth"
              disabled={isValidating}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isValidating || !url.trim()}
            className="w-full h-12 text-base bg-hero-gradient hover:opacity-90 transition-smooth shadow-soft"
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              "Check LLMS.txt"
            )}
          </Button>
        </form>

        {result && (
          <div className="mt-6 p-4 rounded-lg border bg-muted/50 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {result.exists ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <span className="font-medium">
                  {result.exists ? "LLMS.txt Found" : "LLMS.txt Not Found"}
                </span>
              </div>
              
              <Badge variant={result.exists ? "default" : "destructive"}>
                {result.status ? `HTTP ${result.status}` : "Unknown"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Checked URL: 
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 text-primary hover:underline inline-flex items-center gap-1"
                >
                  {result.url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
              
              {result.error && (
                <p className="text-sm text-destructive">
                  Error: {result.error}
                </p>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};