
import { PromptDB } from "@/types";

// Extracts placeholders and provides sample values for known placeholders
export function usePromptPlaceholders(prompt: PromptDB) {
  // Extract placeholders from content
  const extract = () => {
    const regex = /\[(.*?)\]/g;
    const content = prompt.content;
    let match;
    const placeholders: string[] = [];
    while ((match = regex.exec(content)) !== null) {
      if (!placeholders.includes(match[1])) {
        placeholders.push(match[1]);
      }
    }
    return placeholders;
  };

  // Provide sample values for common placeholders
  const getSamples = (placeholder: string) => {
    const samples: Record<string, string[]> = {
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

  return {
    extractPlaceholders: extract,
    generateSampleValues: getSamples,
  };
}
