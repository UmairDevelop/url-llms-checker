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
      { name: "Tron (TRC-20)", code: "TRC-20", address: "TBVG6EG4r5XV39FpVRmHs4hDzH5QmUpvnN" },
      { name: "BSC (BEP-20)", code: "BEP-20", address: "0x4022a3c62232fe95703c8c193ab033a42430c699" },
      { name: "Ethereum (ERC-20)", code: "ERC-20", address: "0x4022a3c62232fe95703c8c193ab033a42430c699" }
    ]
  },
  {
    name: "BTC (Bitcoin)",
    symbol: "BTC",
    networks: [
      { name: "Bitcoin", code: "BTC", address: "13THTxZbEhSAoTDkJxazX219jHP9mkCGN6" },
      { name: "BEP-20", code: "BEP-20", address: "0x4022a3c62232fe95703c8c193ab033a42430c699" }
    ]
  },
  {
    name: "ETH (Ethereum)",
    symbol: "ETH",
    networks: [
      { name: "Ethereum (ERC-20)", code: "ERC-20", address: "0x4022a3c62232fe95703c8c193ab033a42430c699" },
      { name: "BEP-20", code: "BEP-20", address: "0x4022a3c62232fe95703c8c193ab033a42430c699" }
    ]
  },
  {
    name: "BNB (Binance Coin)",
    symbol: "BNB",
    networks: [
      { name: "BEP-20", code: "BEP-20", address: "0x4022a3c62232fe95703c8c193ab033a42430c699" }
    ]
  },
  {
    name: "SOL (Solana)",
    symbol: "SOL",
    networks: [
      { name: "Solana", code: "SOL", address: "AQrx78sHuqroAiVx4dqTNxL3pUXaPVhu7AawVsZjXxWR" }
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
                <span className="font-mono text-lg font-semibold">1050080021</span>
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