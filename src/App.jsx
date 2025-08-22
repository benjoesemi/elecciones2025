import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import Papa from "papaparse";
import "leaflet/dist/leaflet.css";
import BarChartVotes from "./BarChartVotes";
import Legend from "./legend";
import PolygonSelector from "./PolygonSelector";
import logoEmpresa from "/gerenssa.jpg"; // tu logo en public/

const center = [-16.4897, -68.1193];

const coloresPartidos = {
  AP: "#008fcc",
  ADN: "#000000",
  APB_SUMATE: "#591580",
  LIBRE: "#d2000e",
  FP: "#25c1fe",
  MAS_IPSP: "#004496",
  UNIDAD: "#f6ac00",
  PDC: "#0b3639",
  VotosNulos: "#555555"
};

export default function App() {
  const [puntos, setPuntos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  // Cargar CSV
  useEffect(() => {
    Papa.parse("/sql_resultados_2025_96.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const datosValidos = result.data.filter(
          (p) => p && p.latitu != null && p.longitud != null
        );
        setPuntos(datosValidos);
      },
    });
  }, []);

  // Ajustar límites del mapa
  const FitBounds = ({ puntos }) => {
    const map = useMap();
    useEffect(() => {
      if (puntos.length > 0) {
        const bounds = puntos.map(p => [p.latitu, p.longitud]);
        map.fitBounds(bounds, { padding: [50,50] });
      }
    }, [puntos, map]);
    return null;
  };

  // Agregar votos de puntos seleccionados
  const votosAgregados = seleccionados.reduce((acc, p) => {
    if (!p) return acc;
    for (const partido of ["AP","ADN","APB_SUMATE","LIBRE","FP","MAS_IPSP","UNIDAD","PDC","VotoNulo"]) {
      acc[partido] = (acc[partido] || 0) + (p[partido] || 0);
    }
    return acc;
  }, {});

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "Montserrat, sans-serif" }}>
      
      {/* Header */}
      <header style={{
        backgroundColor: "#ffffff",
        color: "black",
        padding: "15px 20px",
        textAlign: "center"
      }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>Mapa Electoral Bolivia 2025</h1>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 400 }}>Resultados por recinto y partido político</h3>
      </header>

      {/* Mapa */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer center={center} zoom={6} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <FitBounds puntos={puntos} />

          {puntos.map((p,index) => (
            p ? (
              <CircleMarker
                key={index}
                center={[p.latitu, p.longitud]}
                radius={1.5}
                color={coloresPartidos[p.ColumnaMax] || "#888888"}
                fillColor={coloresPartidos[p.ColumnaMax] || "#888888"}
                fillOpacity={0.7}
              >
                <Popup>
                  <div style={{ minWidth: "220px", textAlign: "center" }}>
                    <h4>{p.Recinto}</h4>
                    <p>Total Inscritos: {p.TotalInscritos || 0}</p>
                    <BarChartVotes votos={{
                      AP: p.AP || 0,
                      ADN: p.ADN || 0,
                      APB_SUMATE: p.APB_SUMATE || 0,
                      LIBRE: p.LIBRE || 0,
                      FP: p.FP || 0,
                      MAS_IPSP: p.MAS_IPSP || 0,
                      UNIDAD: p.UNIDAD || 0,
                      PDC: p.PDC || 0,
                      VotoNulo: p.VotoNulo || 0
                    }} />
                  </div>
                </Popup>
              </CircleMarker>
            ) : null
          ))}

          <PolygonSelector puntos={puntos} onSeleccion={setSeleccionados} />
          <Legend colores={coloresPartidos} />
        </MapContainer>
      </div>

      {/* Footer */}
      <footer style={{
        height: "60px",
        backgroundColor: "#ffffff",
        color: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        textAlign: "center",
        padding: "0 20px"
      }}>
        <img src={logoEmpresa} alt="Logo" style={{ height: "40px" }} />
      </footer>

      {/* Gráfico agregado */}
      {seleccionados.length > 0 && (
        <div style={{ width: "500px", margin: "10px auto", textAlign: "center" }}>
          <h4>Resultados de puntos seleccionados ({seleccionados.length})</h4>
          <BarChartVotes votos={votosAgregados} />
        </div>
      )}
    </div>
  );
}
