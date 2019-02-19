import React, { Component } from "react";
import {
  Map,
  Polygon,
  TileLayer,
} from "react-leaflet";
import { LatLng } from "leaflet";

import "../styles/Map.scss";

const center = new LatLng(52.092876, 5.104480);

const polygon = [
  new LatLng(52.122876, 5.104480),
  new LatLng(52.022876, 5.184480),
  new LatLng(52.002876, 5.024480),
];

export default class MapComponent extends Component<{}> {
  render() {
    return (
      <div className="MapContainer">
        <Map center={center} zoom={6}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polygon color="purple" positions={polygon} />
        </Map>
      </div>
    );
  }
}
