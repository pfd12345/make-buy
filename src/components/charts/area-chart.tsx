"use client";

import {
  AreaChart as RechartsArea, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

interface SimpleAreaChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  showZeroLine?: boolean;
}

export function SimpleAreaChart({
  data, xKey, yKey, color = "#3b82f6", height = 300, showZeroLine,
}: SimpleAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsArea data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        {showZeroLine && <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" />}
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={color}
          fill={color}
          fillOpacity={0.15}
        />
      </RechartsArea>
    </ResponsiveContainer>
  );
}
