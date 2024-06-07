import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../scss/Mapa.scss';
import districtesJSON from '../database/districtes_geo.json';
import HeatMap from './HeatMap';

const Map = () => {
    const [hoveredDistrict, setHoveredDistrict] = useState(null);
    const [heatData, setHeatData] = useState([]);
    const [heatOptions, setHeatOptions] = useState({
        radius: 5,
        blur: 5,
        minOpacity: 0.18,
    });
    const [selectedDistricts, setSelectedDistricts] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        try {
            fetch('http://localhost/php/P1_Mapa/mapaDistrics.php', {
                method: 'POST',
                body: JSON.stringify({ "districtes": selectedDistricts }),
            })
                .then((response) => response.json())
                .then((data) => {
                    const points = data.map((element) => Object.values(element));
                    setHeatData(points);
                    console.log(points);
                });
        } catch (error) {
            console.error('Error fetch', error.message);
        }
    }, [selectedDistricts]);

    const toggleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            const allDistricts = districtesJSON.features.map(feature => feature.properties.C_Distri);
            setSelectedDistricts(allDistricts);
        } else {
            setSelectedDistricts([]);
        }
    };


    const toggleDistrict = (districtCode) => {
        if (selectedDistricts.includes(districtCode)) {
            setSelectedDistricts(selectedDistricts.filter(code => code !== districtCode));
        } else {
            setSelectedDistricts([...selectedDistricts, districtCode]);
        }
    };

    const onEachDistrict = (district, layer) => {
        const webURL = district.properties.WEB_1 || '';

        layer.on({
            mouseover: () => {
                layer.setStyle({ fillColor: district.properties.color, fillOpacity: 0.4 });
                setHoveredDistrict(district.properties.N_Distri);
            },
            mouseout: () => {
                layer.setStyle({ fillColor: 'black', fillOpacity: 0.4 });
                setHoveredDistrict(null);
            },
            click: () => {
                window.open(webURL, '_blank');
            }
        });
    };

    const handleHeatOptions = (event) => {
        const { name, value } = event.target;
        let newValue = parseFloat(value);
    
        switch (name) {
            case 'radius':
                newValue = Math.max(1, Math.min(20, newValue));
                break;
            case 'blur':
                newValue = Math.max(1, Math.min(10, (11 - newValue)));
                break;
            case 'minOpacity':
                newValue = Math.max(0.1, Math.min(1, newValue));
                break;
        }
    
        setHeatOptions({
            ...heatOptions,
            [name]: newValue,
        });
    };
    

    return (
        <div id='globalContainer'>
            <div className="map-overlay">
                {hoveredDistrict && (
                    <h1 className="district-label">{hoveredDistrict}</h1>
                )}
            </div>
            <div id='distritos'>
                <h2>Distritos:</h2>
                <ul>
                    <li>
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={toggleSelectAll}
                        />
                        Seleccionar todos los distritos
                    </li>
                    {districtesJSON.features.map((feature, index) => (
                        <li key={index}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={feature.properties.C_Distri}
                                    checked={selectedDistricts.includes(feature.properties.C_Distri)}
                                    onChange={() => toggleDistrict(feature.properties.C_Distri)}
                                />
                                {feature.properties.N_Distri}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="map-controls">
                <label>
                    Radi:
                    <input type="range" name="radius" min="1" max="10" value={heatOptions.radius} onChange={handleHeatOptions} />
                </label>
                <label>
                    Intensitat:
                    <input type="range" name="blur" min="1" max="10" value={11 - heatOptions.blur} onChange={handleHeatOptions} />
                </label>
                <label>
                    Opacitat:
                    <input type="range" name="minOpacity" min="0.1" max="1" step="0.01" value={heatOptions.minOpacity} onChange={handleHeatOptions} />
                </label>
            </div>
            <MapContainer center={[41.390205, 2.154007]} zoom={12} className="map-container">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <GeoJSON data={districtesJSON} style={{
                    dashArray: '5, 5',
                    color: 'black',
                    weight: 1,
                    fillOpacity: 0.4,
                }} onEachFeature={onEachDistrict} />
                {heatData && <HeatMap heatData={heatData} heatOptions={heatOptions} />}
            </MapContainer>
        </div>
    );
};

export default Map;
