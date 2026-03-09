"use client";

import {
  Radar, RadarChart as RechartsRadar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend,
} from "recharts";

interface RadarChartProps {
  datasets: { name: string; data: Record<string, number>; color: string }[];
  dimensions: string[];
  height?: number;
}

export function RadarChartComponent({ datasets, dimensions, height = 350 }: RadarChartProps) {
  const chartData = dimensions.map((dim) => {
    const entry: Record<string, unknown> = { dimension: dim };
    for (const ds of datasets) {
      entry[ds.name] = ds.data[dim] ?? 0;
    }
    return entry;
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadar data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
        {datasets.map((ds) => (
          <Radar
            key={ds.name}
            name={ds.name}
            dataKey={ds.name}
            stroke={ds.color}
            fill={ds.color}
            fillOpacity={0.15}
          />
        ))}
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
