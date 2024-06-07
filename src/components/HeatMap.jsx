import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';
import L from 'leaflet';

const HeatMap = ({ heatData, heatOptions }) => {
    const map = useMap();
    const layerRef = useRef();

    useEffect(() => {
        if (!layerRef.current) {
            layerRef.current = L.heatLayer(heatData, heatOptions).addTo(map);
        }
        layerRef.current.setOptions(heatOptions).setLatLngs(heatData);
    }, [heatData, heatOptions, map]);

    return null; 
};

export default HeatMap;


// const HeatMap = ({ heatData, heatOptions }) => {
//     const map = useMap();

//     useEffect(() => {
//         if (heatData && heatData.length > 0) {
//             if (map) {
//                 map.eachLayer((layer) => {
//                     if (layer instanceof L.heatLayer) {
//                         map.removeLayer(layer);
//                     }
//                 });
//                 const heat = L.heatLayer(heatData, heatOptions).addTo(map);
//                 map.addLayer(heat);
//             }
//         }
//     }, [heatData, map, heatOptions]);

//     return null;
// };

// useEffect(() => {
//     if (layerRef.current && heatData && heatData.length > 0) {
//         layerRef.current.setLatLngs(heatData);
//     }
// }, [heatData]);

// return null;

// export default HeatMap;