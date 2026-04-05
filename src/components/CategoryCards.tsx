import { Brain, Shield, ShieldCheck, Zap, Eye, type LucideIcon } from "lucide-react";
import { categories } from "@/data/evaluationData";

const iconMap: Record<string, LucideIcon> = {
  Brain,
  Shield,
  ShieldCheck,
  Zap,
  Eye,
};

const CategoryCards = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-foreground">Evaluation Categories</h2>
        <p className="text-muted-foreground mb-10">
          Structured prompt datasets across five critical dimensions
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon];
            return (
              <div
                key={cat.id}
                className="group p-6 rounded-xl bg-card border border-border card-hover animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: cat.color }} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{cat.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {cat.description}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-mono font-semibold px-2 py-1 rounded"
                    style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                  >
                    {cat.count} prompts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
