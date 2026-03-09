"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { HOTSPOT_COLORS, THRESHOLDS } from "@/lib/constants";

interface SiteUtilizationData {
  name: string;
  utilization: number;
}

function getColor(util: number) {
  if (util < THRESHOLDS.utilization.warning) return HOTSPOT_COLORS.critical;
  if (util < THRESHOLDS.utilization.good) return HOTSPOT_COLORS.warning;
  return HOTSPOT_COLORS.good;
}

export function SiteUtilizationChart({ data }: { data: SiteUtilizationData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value) => [`${value}%`, "Utilization"]} />
        <ReferenceLine y={THRESHOLDS.utilization.good} stroke={HOTSPOT_COLORS.good} strokeDasharray="3 3" />
        <Bar dataKey="utilization" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={getColor(entry.utilization)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
