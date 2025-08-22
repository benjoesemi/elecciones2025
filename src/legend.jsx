import React from "react";

export default function Legend({ colores = {} }) {
  const keys = Object.keys(colores);

  if (!keys.length) return null;

  return (
    <div style={{
      position: "absolute",   // para que quede sobre el mapa
      bottom: "10px",
      left: "10px",
      background: "rgba(255,255,255,0.9)",  // fondo semitransparente
      padding: "10px",
      borderRadius: "6px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      zIndex: 1000            // alto para que no quede detrás
    }}>
      <h4>Leyenda</h4>
      {keys.map((partido, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
          <span style={{
            width: "16px",
            height: "16px",
            backgroundColor: colores[partido],
            display: "inline-block",
            marginRight: "6px",
            border: "1px solid #000"
          }}></span>
          <span>{partido}</span>
        </div>
      ))}
    </div>
  );
}
