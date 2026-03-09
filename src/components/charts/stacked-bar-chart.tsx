"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

interface StackedBarChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  categories: string[];
  colors: Record<string, string>;
  labels?: Record<string, string>;
  height?: number;
}

export function StackedBarChart({
  data, xKey, categories, colors, labels, height = 350,
}: StackedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend
          formatter={(value: string) => (labels?.[value] ?? value)}
          wrapperStyle={{ fontSize: 12 }}
        />
        {categories.map((cat) => (
          <Bar key={cat} dataKey={cat} stackId="a" fill={colors[cat] ?? "#888"} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
