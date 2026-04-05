import { Brain, Shield, Eye, Zap, ShieldCheck } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(hsl(174 72% 50% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(174 72% 50% / 0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-sm font-mono text-muted-foreground">
            Research Toolkit for OpenAI
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <span className="gradient-text">LLM Prompt</span>
          <br />
          <span className="text-foreground">Evaluation Toolkit</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          A framework for evaluating large language models across reasoning,
          cybersecurity knowledge, safety compliance, adversarial prompts, and
          hallucination detection.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          {[
            { icon: Brain, label: "Reasoning" },
            { icon: Shield, label: "Cybersecurity" },
            { icon: ShieldCheck, label: "Safety" },
            { icon: Zap, label: "Adversarial" },
            { icon: Eye, label: "Hallucination" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border"
            >
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
          {[
            { value: "100+", label: "Prompts" },
            { value: "5", label: "Categories" },
            { value: "5", label: "Models Tested" },
            { value: "92.6%", label: "Top Score" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold font-mono text-primary">{value}</div>
              <div className="text-sm text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
