// BarChartVotes.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const coloresPartidos = {
  AP: "#008fcc",
  ADN: "#000000",
  APB_SUMATE: "#591580",
  LIBRE: "#d2000e",
  FP: "#25c1fe",
  MAS_IPSP: "#004496",
  UNIDAD: "#f6ac00",
  PDC: "#0b3639",
  VotoNulo: "#555555"
};

export default function BarChartVotes({ votos }) {
  if (!votos) return null;

  // Convertir objeto de votos a array para Recharts
  const data = Object.keys(votos).map(key => ({
    name: key,
    value: votos[key] || 0
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value">
          {data.map((entry, index) => (
            <Cell key={index} fill={coloresPartidos[entry.name] || "#888888"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
