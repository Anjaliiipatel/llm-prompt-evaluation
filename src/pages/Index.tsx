import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryCards from "@/components/CategoryCards";
import EvalDashboard from "@/components/EvalDashboard";
import PromptBrowser from "@/components/PromptBrowser";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategoryCards />
      <EvalDashboard />
      <PromptBrowser />
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p className="font-mono">LLM Prompt Evaluation Toolkit — Research for OpenAI</p>
          <p className="mt-2">Built for responsible AI experimentation and model benchmarking</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
