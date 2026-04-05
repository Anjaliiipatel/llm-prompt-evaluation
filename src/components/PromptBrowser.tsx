import { useState } from "react";
import { samplePrompts, categories } from "@/data/evaluationData";
import { Badge } from "@/components/ui/badge";

const difficultyColors: Record<string, string> = {
  Easy: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  Medium: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  Hard: "bg-chart-4/15 text-chart-4 border-chart-4/30",
};

const PromptBrowser = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    activeCategory === "all"
      ? samplePrompts
      : samplePrompts.filter((p) => p.category === activeCategory);

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-foreground">Prompt Browser</h2>
        <p className="text-muted-foreground mb-8">
          Explore the structured prompt dataset with category filtering
        </p>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            All ({samplePrompts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Prompt cards */}
        <div className="space-y-4">
          {filtered.map((prompt) => {
            const cat = categories.find((c) => c.id === prompt.category);
            return (
              <div
                key={prompt.id}
                className="p-5 rounded-xl bg-card border border-border card-hover"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className="text-xs font-mono"
                    style={{ borderColor: cat?.color, color: cat?.color }}
                  >
                    {cat?.name}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${difficultyColors[prompt.difficulty]}`}>
                    {prompt.difficulty}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono ml-auto">
                    {prompt.id.toUpperCase()}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-mono text-foreground bg-secondary/50 rounded-lg p-3 leading-relaxed">
                    "{prompt.prompt}"
                  </p>
                </div>

                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Expected Behavior
                  </span>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {prompt.expectedBehavior}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PromptBrowser;
