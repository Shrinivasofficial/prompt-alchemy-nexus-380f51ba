
import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <div>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-semibold">PromptNexus</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover-underline">
              Home
            </Link>
            <Link to="/dashboard" className="text-sm font-medium hover-underline">
              Dashboard
            </Link>
            <Link to="/about" className="text-sm font-medium hover-underline">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium hover-underline font-semibold text-primary">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button asChild variant="default" className="hidden md:flex bg-gradient-primary hover:opacity-90 transition-opacity">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-20 left-0 w-96 h-96 bg-gradient-primary rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-20 right-0 w-80 h-80 bg-gradient-secondary rounded-full opacity-10 blur-3xl" />
          
          <div className="relative max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">Get in Touch</h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Have questions or feedback about PromptNexus? We'd love to hear from you! Use the form below to get in touch with our team.
            </p>
          </div>
        </section>
        
        {/* Contact Form Section */}
        <section className="container mx-auto px-4 py-8 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="animate-fade-in p-1">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is your message about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Enter your message here..."
                    rows={6}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <p className="text-muted-foreground mb-8">
                We're here to help! Reach out using any of the methods below and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Email</h3>
                    <a href="mailto:support@promptnexus.com" className="text-muted-foreground hover:text-primary">
                      support@promptnexus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Phone</h3>
                    <a href="tel:+11234567890" className="text-muted-foreground hover:text-primary">
                      +1 (123) 456-7890
                    </a>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Address</h3>
                    <address className="text-muted-foreground not-italic">
                      123 AI Boulevard<br />
                      San Francisco, CA 94105<br />
                      United States
                    </address>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-lg font-medium mb-4">Connect with us</h3>
                <div className="flex gap-4">
                  {["Twitter", "LinkedIn", "GitHub", "Discord"].map((platform, index) => (
                    <a
                      key={platform}
                      href="#"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
                    >
                      <span className="sr-only">{platform}</span>
                      <div className="w-5 h-5 bg-gradient-primary rounded-full opacity-80" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 animate-fade-in">Frequently Asked Questions</h2>
              <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Find answers to the most common questions about PromptNexus.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6 stagger-animation">
              {[
                {
                  question: "Is PromptNexus free to use?",
                  answer: "Yes, PromptNexus currently offers a free tier with access to all basic features. We also offer premium plans for advanced features and higher usage limits."
                },
                {
                  question: "How can I contribute my own prompts?",
                  answer: "We're working on a community contribution feature that will allow users to submit their own prompts for review and inclusion in our library. Stay tuned for updates!"
                },
                {
                  question: "Do you integrate with specific AI models?",
                  answer: "PromptNexus is designed to work with any text-based AI model. Our prompts can be used with popular models like GPT-4, Claude, and others."
                },
                {
                  question: "How often are new prompts added?",
                  answer: "We regularly update our prompt library with new additions. We aim to add new batches of professionally crafted prompts at least twice per month."
                },
              ].map((faq, index) => (
                <div key={index} className="bg-background border border-border p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-md bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-xl font-semibold">PromptNexus</span>
              </div>
              <p className="text-muted-foreground max-w-xs">
                A beautifully designed system for organizing, discovering, and optimizing AI prompts for different roles and tasks.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-medium mb-3">Navigation</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Connect</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Twitter</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">GitHub</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Discord</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PromptNexus. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
