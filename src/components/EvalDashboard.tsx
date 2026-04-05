import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  PieChart, Pie, Cell,
} from "recharts";
import { evalResults, categoryDistribution } from "@/data/evaluationData";

const radarData = [
  { subject: "Reasoning", ...Object.fromEntries(evalResults.map((r) => [r.model, r.reasoning])) },
  { subject: "Cyber", ...Object.fromEntries(evalResults.map((r) => [r.model, r.cybersecurity])) },
  { subject: "Safety", ...Object.fromEntries(evalResults.map((r) => [r.model, r.safety])) },
  { subject: "Adversarial", ...Object.fromEntries(evalResults.map((r) => [r.model, r.adversarial])) },
  { subject: "Hallucination", ...Object.fromEntries(evalResults.map((r) => [r.model, r.hallucination])) },
];

const barData = evalResults.map((r) => ({ name: r.model, score: r.overall }));

const radarColors = ["#2dd4bf", "#a78bfa", "#facc15", "#f472b6", "#38bdf8"];

const EvalDashboard = () => {
  return (
    <section className="py-16 px-6" id="dashboard">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-foreground">Evaluation Dashboard</h2>
        <p className="text-muted-foreground mb-10">
          Interactive visualization of model performance across all categories
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Multi-Dimensional Comparison
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220 14% 18%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(215 12% 50%)", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[60, 100]} tick={{ fill: "hsl(215 12% 50%)", fontSize: 10 }} />
                {evalResults.map((r, i) => (
                  <Radar
                    key={r.model}
                    name={r.model}
                    dataKey={r.model}
                    stroke={radarColors[i]}
                    fill={radarColors[i]}
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: 12, color: "hsl(215 12% 50%)" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Overall Score Ranking
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                <XAxis type="number" domain={[70, 100]} tick={{ fill: "hsl(215 12% 50%)", fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fill: "hsl(210 20% 92%)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220 18% 10%)",
                    border: "1px solid hsl(220 14% 18%)",
                    borderRadius: "8px",
                    color: "hsl(210 20% 92%)",
                  }}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={radarColors[i % radarColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Prompt Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {categoryDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220 18% 10%)",
                    border: "1px solid hsl(220 14% 18%)",
                    borderRadius: "8px",
                    color: "hsl(210 20% 92%)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Results Table */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Detailed Scores
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Model</th>
                    <th className="text-center py-3 px-2 text-muted-foreground font-medium">RSN</th>
                    <th className="text-center py-3 px-2 text-muted-foreground font-medium">CYB</th>
                    <th className="text-center py-3 px-2 text-muted-foreground font-medium">SAF</th>
                    <th className="text-center py-3 px-2 text-muted-foreground font-medium">ADV</th>
                    <th className="text-center py-3 px-2 text-muted-foreground font-medium">HAL</th>
                    <th className="text-center py-3 px-2 font-semibold text-primary">AVG</th>
                  </tr>
                </thead>
                <tbody>
                  {evalResults
                    .sort((a, b) => b.overall - a.overall)
                    .map((r) => (
                      <tr key={r.model} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-2 font-medium text-foreground">{r.model}</td>
                        <td className="text-center py-3 px-2 font-mono text-muted-foreground">{r.reasoning}</td>
                        <td className="text-center py-3 px-2 font-mono text-muted-foreground">{r.cybersecurity}</td>
                        <td className="text-center py-3 px-2 font-mono text-muted-foreground">{r.safety}</td>
                        <td className="text-center py-3 px-2 font-mono text-muted-foreground">{r.adversarial}</td>
                        <td className="text-center py-3 px-2 font-mono text-muted-foreground">{r.hallucination}</td>
                        <td className="text-center py-3 px-2 font-mono font-semibold text-primary">{r.overall}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EvalDashboard;
