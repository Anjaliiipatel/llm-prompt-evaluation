import { Terminal } from "lucide-react";

const Navbar = () => (
  <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Terminal className="w-4 h-4 text-primary" />
        </div>
        <span className="font-semibold text-foreground">LLM Eval Toolkit</span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
        <a href="#dashboard" className="hover:text-foreground transition-colors">Dashboard</a>
        <span className="font-mono text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">
          v1.0 Research Preview
        </span>
      </div>
    </div>
  </nav>
);

export default Navbar;
