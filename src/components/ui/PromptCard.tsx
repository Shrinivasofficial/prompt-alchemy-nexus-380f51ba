
import { useState } from "react";
import { Prompt } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Star, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PromptCardProps {
  prompt: Prompt;
  index?: number;
}

export function PromptCard({ prompt, index = 0 }: PromptCardProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showUsage, setShowUsage] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Prompt content has been copied to your clipboard",
      duration: 2000,
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Extract placeholders from the prompt content
  const extractPlaceholders = () => {
    const regex = /\[(.*?)\]/g;
    const content = prompt.content;
    let match;
    const placeholders = [];
    
    while ((match = regex.exec(content)) !== null) {
      if (!placeholders.includes(match[1])) {
        placeholders.push(match[1]);
      }
    }
    
    return placeholders;
  };
  
  // Generate sample values based on the prompt type
  const generateSampleValues = (placeholder: string) => {
    const samples: {[key: string]: string[]} = {
      "PRODUCT": ["Smart Home Security System", "Organic Skincare Subscription Box", "AI Writing Assistant"],
      "BRAND VOICE": ["Professional & Authoritative", "Friendly & Conversational", "Playful & Energetic"],
      "AUDIENCE": ["Tech-savvy Millennials", "Busy Parents", "Small Business Owners"],
      "BUSINESS/PRODUCT": ["Fitness Mobile App", "Eco-friendly Cleaning Service", "Online Course Platform"],
      "FEATURE/API": ["User Authentication System", "Payment Processing API", "Data Visualization Library"],
      "AUDIENCE TECHNICAL LEVEL": ["Beginner Developers", "Experienced Engineers", "Non-technical Stakeholders"],
      "DETAILS": ["5 developers, 10 user stories", "3 designers, tight deadline", "Remote team, complex project"],
      "PROTOTYPE DETAILS": ["E-commerce Mobile App", "SaaS Dashboard Interface", "Healthcare Patient Portal"],
      "ARCHITECTURE DETAILS": ["Microservices Backend", "Serverless Function Architecture", "Monolithic Application"],
      "ISSUE TYPE": ["Payment Processing Error", "Account Access Problem", "Shipping Delay"],
    };
    
    return samples[placeholder] || ["Example 1", "Example 2", "Example 3"];
  };

  // Animation delay based on index for staggered appearance
  const animationDelay = `${index * 0.05}s`;
  
  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden transition-all duration-300",
        "border border-border hover:border-primary/20",
        "hover:shadow-premium animate-fade-in"
      )}
      style={{ animationDelay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative p-6 flex flex-col h-full">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold tracking-tight">{prompt.title}</h3>
          <div className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {prompt.rating}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{prompt.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.roles.map((role) => (
            <Badge key={role} variant="outline" className="bg-primary/5">
              {role}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {prompt.tasks.map((task) => (
            <Badge key={task} variant="outline" className="bg-secondary/5">
              {task}
            </Badge>
          ))}
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {prompt.views} views
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowUsage(true)}
            >
              <FileText className="h-4 w-4" />
              <span className="sr-only">Sample Usage</span>
            </Button>
            
            <Button
              variant={copied ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-8 w-8 p-0",
                copied && "bg-primary text-primary-foreground"
              )}
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
          </div>
        </div>
        
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary",
            "transform scale-x-0 origin-left transition-transform duration-300",
            isHovered && "scale-x-100"
          )}
        />
      </div>
      
      {/* Sample Usage Dialog */}
      <Dialog open={showUsage} onOpenChange={setShowUsage}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sample Usage</DialogTitle>
            <DialogDescription>
              Replace the placeholders with your specific information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="rounded-md bg-muted p-4">
              <pre className="text-sm whitespace-pre-wrap">{prompt.content}</pre>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Fill in these placeholders:</h4>
              {extractPlaceholders().map((placeholder) => (
                <div key={placeholder} className="space-y-2">
                  <h5 className="text-sm font-semibold">[{placeholder}]</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {generateSampleValues(placeholder).map((example, i) => (
                      <div 
                        key={i}
                        className="bg-background border border-border rounded-md p-2 text-xs"
                      >
                        "{example}"
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
