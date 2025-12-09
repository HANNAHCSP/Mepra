"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface RevenueChartProps {
  data: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-card p-6 rounded-xl border border-border/60 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground">Revenue Overview</h3>
        <p className="text-sm text-muted-foreground">Sales performance over the last 7 days</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Bar
              dataKey="revenue"
              fill="#5e503f" // Your Primary Color (Umber)
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
