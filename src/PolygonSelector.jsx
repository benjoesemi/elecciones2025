import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

export default function PolygonSelector({ puntos, onSeleccion }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        marker: false,
        circle: false,
        polyline: false,
        rectangle: false,
        circlemarker: false
      },
      edit: { featureGroup: drawnItems }
    });

    map.addControl(drawControl);

    const handleDrawCreated = (event) => {
      const layer = event.layer;
      drawnItems.addLayer(layer);

      // Filtrar puntos dentro del polígono
      const seleccion = puntos.filter(p => {
        const latlng = L.latLng(p.latitu, p.longitud);
        return layer.getBounds().contains(latlng);
      });
      onSeleccion(seleccion);

      // Crear popup con botón cerrar
      const popupContent = document.createElement("div");
      popupContent.innerHTML = `<b>Puntos seleccionados: ${seleccion.length}</b><br>`;
      const closeButton = document.createElement("button");
      closeButton.innerText = "Cerrar";
      closeButton.style.marginTop = "5px";
      closeButton.onclick = () => map.closePopup();
      popupContent.appendChild(closeButton);

      layer.bindPopup(popupContent).openPopup();
    };

    map.on(L.Draw.Event.CREATED, handleDrawCreated);

    return () => {
      map.off(L.Draw.Event.CREATED, handleDrawCreated);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, puntos, onSeleccion]);

  return null;
}


