import { useRef, useEffect } from 'react';
import L from "leaflet";

export default function Map({ location = {} }) {
  const map = useRef(null);
  const { lat, lng } = location;

  // create map
  useEffect(() => {
    if (map.current) return;
    if (!lat && !lng) return;

    map.current = L.map('map', {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      layers: [
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }),
      ]
    });
  }, [lat, lng])


  // setView
  useEffect(() => {
    if (!lat && !lng) return;
    L.marker([lat, lng]).addTo(map.current);
  }, [lat, lng])


  // remove map 
  useEffect(() => {
    return function clearMap() {
      map.current.remove();
      map.current = null;
    }
  }, [])

  return (
    <div id="map" style={{ height: 'calc( 100vh - 81px)' }}></div>
  )
}
