import { useEffect, useState } from "react";
import { RedditBar } from "@/components/RedditBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { updateSEO } from "@/utils/seo";
import { toast } from "sonner";

interface CryptoOption {
  name: string;
  symbol: string;
  networks: Array<{
    name: string;
    code: string;
    address: string;
  }>;
}

const cryptoOptions: CryptoOption[] = [
  {
    name: "USDT (TetherUS)",
    symbol: "USDT",
    networks: [
      { name: "Tron (TRC20)", code: "TRX", address: "TRX1234567890ABCDEF1234567890ABCDEF12345678" },
      { name: "BSC (BEP20)", code: "BSC", address: "0x1234567890abcdef1234567890abcdef12345678" },
      { name: "Ethereum (ERC20)", code: "ETH", address: "0xabcdef1234567890abcdef1234567890abcdef12" }
    ]
  },
  {
    name: "BTC (Bitcoin)",
    symbol: "BTC",
    networks: [
      { name: "Bitcoin", code: "BTC", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
      { name: "BSC (BEP20)", code: "BSC", address: "0x9876543210fedcba9876543210fedcba98765432" }
    ]
  },
  {
    name: "ETH (Ethereum)",
    symbol: "ETH",
    networks: [
      { name: "Ethereum (ERC20)", code: "ETH", address: "0xfedcba0987654321fedcba0987654321fedcba09" },
      { name: "BSC (BEP20)", code: "BSC", address: "0x5678901234abcdef5678901234abcdef56789012" }
    ]
  },
  {
    name: "BNB (Binance Coin)",
    symbol: "BNB",
    networks: [
      { name: "BNB Smart Chain (BEP20)", code: "BSC", address: "0xabcd1234efgh5678ijkl9012mnop3456qrst7890" }
    ]
  },
  {
    name: "SOL (Solana)",
    symbol: "SOL",
    networks: [
      { name: "Solana", code: "SOL", address: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH" }
    ]
  }
];

const Donate = () => {
  const [expandedCrypto, setExpandedCrypto] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string>("");

  useEffect(() => {
    updateSEO({
      title: "Crypto Donations - Support LLMS.txt",
      description: "Support our LLMS.txt tools by donating cryptocurrency. Help us keep the service free and ad-free for everyone.",
      keywords: ["crypto donation", "bitcoin", "ethereum", "USDT", "support", "LLMS.txt"]
    });
  }, []);

  const copyToClipboard = async (address: string, cryptoName: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      toast.success(`${cryptoName} address copied to clipboard!`);
      setTimeout(() => setCopiedAddress(""), 2000);
    } catch (err) {
      toast.error("Failed to copy address");
    }
  };

  const toggleExpanded = (cryptoSymbol: string) => {
    setExpandedCrypto(expandedCrypto === cryptoSymbol ? null : cryptoSymbol);
  };

  return (
    <div className="min-h-screen bg-background">
      <RedditBar />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Donate via Crypto</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Donate some coins to help me keep this website ad-free for everyone. 
              Your donations will help cover the costs of servers and other expenses.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">Binance User ID</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-muted p-4 rounded-lg inline-block">
                <span className="font-mono text-lg font-semibold">40020724</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {cryptoOptions.map((crypto) => (
              <Card key={crypto.symbol} className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleExpanded(crypto.symbol)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{crypto.name}</CardTitle>
                    {expandedCrypto === crypto.symbol ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </CardHeader>
                
                {expandedCrypto === crypto.symbol && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Select Network</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {crypto.networks.map((network) => (
                            <span 
                              key={network.code}
                              className="px-3 py-1 bg-muted rounded-full text-sm"
                            >
                              {network.code}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {crypto.networks.map((network) => (
                        <div key={network.code} className="border rounded-lg p-4">
                          <h5 className="font-medium mb-2">{network.name}</h5>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-muted p-2 rounded text-sm break-all">
                              {network.address}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(network.address, `${crypto.symbol} (${network.name})`)}
                            >
                              {copiedAddress === network.address ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Thank you for supporting our LLMS.txt tools! Every donation helps keep the service free and running smoothly.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Donate;