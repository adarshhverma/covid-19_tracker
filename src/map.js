import React from 'react';
import './Map.css'
import {Map as LeafletMap, TileLayer} from 'react-leaflet';
import { showDataOnMap } from './util';


function map({center, zoom, countries}) {
    return (
        <div className='map'>
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {showDataOnMap(countries)}
            </LeafletMap>
            
        </div>
    )
}

export default map
