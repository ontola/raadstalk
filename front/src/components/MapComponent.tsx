import React from "react";
import {
  Map,
  Polygon,
  Popup,
  TileLayer,
} from "react-leaflet";
import { LatLng } from "leaflet";

import "../styles/Map.scss";
import { Aggregate } from "../../../types";
import paths from "../paths";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

const center = new LatLng(52.092876, 5.104480);

interface A {
  polygon: LatLng[];
  label: string;
}

export interface MunicipalityType {
  [cbsCode: string]: A;
}

export const mockMunicipalities: MunicipalityType = {
  Amsterdam: {
    polygon:[
      new LatLng(52.122876, 5.104480),
      new LatLng(52.022876, 5.184480),
      new LatLng(52.002876, 5.024480),
    ],
    label: "Amsterdam",
  },
  Leiden: {
    polygon:[
      new LatLng(52.160114, 4.404480),
      new LatLng(52.060114, 4.444480),
      new LatLng(52.042876, 4.324480),
    ],
    label: "Leiden",
  },
};

interface MunicipalityProps {
  polygon: LatLng[];
  label: string;
  count: number;
  searchTerm: string;
}

function showMunicipalities(items: Aggregate[], searchTerm: string) {
  return items.map((item) => {
    const muni = mockMunicipalities[item.label];

    if (muni !== undefined) {
      return (
        <Municipality
          polygon={muni.polygon}
          label={muni.label}
          count={item.hitCount}
          searchTerm={searchTerm}
        />
      );
    }
    return null;
  });
}

const Municipality: React.FunctionComponent<MunicipalityProps> = ({
  polygon,
  label,
  count,
  searchTerm,
}) => {
  return (
    <Polygon color={`rgb(000,000,255)`} positions={polygon}>
      <Popup>
        <h3>
          {label}
        </h3>
        <p><b>{count}</b> keer besproken</p>
        <a
          target="_blank"
          href={paths.ORISearch(searchTerm, label)}
        >
          <span>
            bekijk documenten
            <FontAwesomeIcon icon={faExternalLinkAlt}
              style={{
                position: "relative",
                marginLeft: "5px",
              }}
            />
          </span>
        </a>
      </Popup>
    </Polygon>
  );
};

interface MapComponentProps {
  items: Aggregate[];
  searchTerm: string;
}

const MapComponent: React.FunctionComponent<MapComponentProps> = ({ items, searchTerm }) => {
  return (
    <div className="MapContainer">
      <Map center={center} zoom={6}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showMunicipalities(items, searchTerm)}
      </Map>
    </div>
  );
};

export default MapComponent;
