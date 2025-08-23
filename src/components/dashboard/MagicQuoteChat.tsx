import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface MagicQuoteChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MagicQuoteChat({ open, onOpenChange }: MagicQuoteChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "👋 Hello! I'm Magic Quote AI. I can help you create personalized quotes, suggest products based on customer needs, analyze market trends, and much more. What would you like to work on today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response with a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(userMessage.content),
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('quote') || lowerInput.includes('pricing')) {
      return "🎯 I can help you create a targeted quote! Based on your request, I recommend:\n\n• **Lavender Oil Premium** - Perfect for cosmetic applications\n• **Peppermint Oil** - Great for aromatherapy blends\n• **Bergamot Oil FCF** - Ideal for skin-safe formulations\n\nWould you like me to generate a detailed quote with these products, or do you have specific customer requirements in mind?";
    }
    
    if (lowerInput.includes('customer') || lowerInput.includes('client')) {
      return "👥 Let me help you understand your customer better! I can:\n\n• Analyze their purchase history and preferences\n• Suggest complementary products they might need\n• Recommend optimal pricing strategies\n• Identify cross-sell opportunities\n\nWhich customer are you working with, or what specific customer insights do you need?";
    }

    if (lowerInput.includes('product') || lowerInput.includes('oil') || lowerInput.includes('extract')) {
      return "🌿 I can provide detailed product insights! I have access to:\n\n• **Inventory levels** and availability\n• **Quality grades** and certifications\n• **Market pricing** trends\n• **Seasonal availability** patterns\n• **Cross-sell suggestions**\n\nWhat specific products are you interested in, or would you like recommendations based on end-use applications?";
    }

    if (lowerInput.includes('margin') || lowerInput.includes('profit') || lowerInput.includes('cost')) {
      return "💰 Let me help optimize your profitability! I can:\n\n• Calculate real-time margins on any quote\n• Suggest pricing adjustments for better profitability\n• Identify high-margin product opportunities\n• Analyze cost breakdowns (packaging, labor, shipping)\n\nWhat specific margin analysis do you need, or would you like me to review a current quote?";
    }

    if (lowerInput.includes('compliance') || lowerInput.includes('certification') || lowerInput.includes('organic')) {
      return "🛡️ Compliance is crucial! I can help with:\n\n• **USDA Organic** certified products\n• **FEMA GRAS** approved ingredients\n• **Ecocert Organic** standards\n• **FDA cGMP** compliant batches\n• **Custom certifications** per customer needs\n\nWhat compliance requirements are you working with?";
    }

    return "🤔 That's an interesting question! I'm here to help with:\n\n• **Quote Generation** - Create personalized quotes instantly\n• **Product Recommendations** - Find the perfect products for your customers\n• **Pricing Strategy** - Optimize margins and competitiveness\n• **Market Insights** - Stay ahead with industry trends\n• **Customer Analysis** - Understand buying patterns better\n\nCould you provide more details about what you'd like to accomplish? I'm ready to help make your sales process more efficient and profitable!";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Magic Quote AI Assistant
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-lg whitespace-pre-line ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {message.content}
                </div>

                {message.role === 'user' && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted text-foreground px-4 py-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t pt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about quotes, products, customers, or anything else..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Magic Quote AI can help with quotes, product recommendations, pricing strategies, and more.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}