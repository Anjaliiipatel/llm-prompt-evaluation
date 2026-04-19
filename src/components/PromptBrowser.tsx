import { useState, useRef } from "react";
import { samplePrompts, categories, type PromptItem } from "@/data/evaluationData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Play, CheckCircle2, XCircle, PlayCircle, StopCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const difficultyColors: Record<string, string> = {
  Easy: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  Medium: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  Hard: "bg-chart-4/15 text-chart-4 border-chart-4/30",
};

const MODELS = [
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro" },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini" },
  { id: "openai/gpt-5", name: "GPT-5" },
];

interface EvalResult {
  modelResponse: string;
  evaluation: { score: number; reasoning: string; passed: boolean };
  model: string;
}

const PromptBrowser = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<string>(MODELS[0].id);
  const [running, setRunning] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, EvalResult>>({});
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 });
  const cancelRef = useRef(false);

  const filtered =
    activeCategory === "all"
      ? samplePrompts
      : samplePrompts.filter((p) => p.category === activeCategory);

  const evaluateOne = async (prompt: PromptItem): Promise<EvalResult | null> => {
    const { data, error } = await supabase.functions.invoke("evaluate-prompt", {
      body: {
        prompt: prompt.prompt,
        expectedBehavior: prompt.expectedBehavior,
        category: prompt.category,
        model: selectedModel,
      },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data as EvalResult;
  };

  const runEvaluation = async (prompt: PromptItem) => {
    setRunning(prompt.id);
    try {
      const data = await evaluateOne(prompt);
      if (data) {
        setResults((prev) => ({ ...prev, [prompt.id]: data }));
        toast.success(`Scored ${data.evaluation.score}/100`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Evaluation failed");
    } finally {
      setRunning(null);
    }
  };

  const runAll = async () => {
    cancelRef.current = false;
    setBatchRunning(true);
    setBatchProgress({ done: 0, total: filtered.length });
    let passed = 0;
    let failed = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (cancelRef.current) break;
      const prompt = filtered[i];
      setRunning(prompt.id);
      try {
        const data = await evaluateOne(prompt);
        if (data) {
          setResults((prev) => ({ ...prev, [prompt.id]: data }));
          if (data.evaluation.passed) passed++;
          else failed++;
        }
      } catch (e) {
        failed++;
        toast.error(`${prompt.id}: ${e instanceof Error ? e.message : "failed"}`);
      }
      setBatchProgress({ done: i + 1, total: filtered.length });
    }

    setRunning(null);
    setBatchRunning(false);
    if (cancelRef.current) {
      toast.info(`Stopped — ${passed} passed, ${failed} failed`);
    } else {
      toast.success(`Done — ${passed} passed, ${failed} failed`);
    }
  };

  const stopAll = () => {
    cancelRef.current = true;
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-foreground">Prompt Browser</h2>
        <p className="text-muted-foreground mb-8">
          Run prompts through Lovable AI and get automatic scores from a judge model
        </p>

        {/* Model selector */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground font-mono">MODEL:</span>
          {MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                selectedModel === m.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

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
            const result = results[prompt.id];
            const isRunning = running === prompt.id;
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

                <div className="mb-4">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Expected Behavior
                  </span>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {prompt.expectedBehavior}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => runEvaluation(prompt)}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Evaluation
                    </>
                  )}
                </Button>

                {result && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3">
                    <div className="flex items-center gap-3">
                      {result.evaluation.passed ? (
                        <CheckCircle2 className="h-5 w-5 text-chart-1" />
                      ) : (
                        <XCircle className="h-5 w-5 text-chart-4" />
                      )}
                      <span className="text-2xl font-bold font-mono text-foreground">
                        {result.evaluation.score}
                        <span className="text-sm text-muted-foreground">/100</span>
                      </span>
                      <Badge variant="outline" className="font-mono text-xs ml-auto">
                        {result.model}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Judge Reasoning
                      </span>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {result.evaluation.reasoning}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Model Response
                      </span>
                      <p className="text-sm font-mono text-foreground bg-secondary/50 rounded-lg p-3 mt-1 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                        {result.modelResponse}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PromptBrowser;
