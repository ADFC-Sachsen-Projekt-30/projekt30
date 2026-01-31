import * as L from "leaflet";

// tabler svg igon map-pin filled

// the actual colored icon
const iconSvgMapPinFilled = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="#f74a55"
    style="position:absolute; top:0; left:0;"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
  </svg>
`;

// white background & outline achieved with a slightly larger stroke
const iconSvgMapPinFilledBack = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="#fff"
    stroke="#fff"
    stroke-width="2"
    style="position:absolute; top:0; left:0;"
  >
    <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
  </svg>
`;

// drop shadow
const iconSvgMapPinFilledBackShadow = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="#fff"
    stroke="#888"
    stroke-width="4"
  >
    <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
  </svg>
`;

const iconHtml = `
  <div style="position:relative">
    <div style="filter:blur(2px);position:absolute;top:4px;left:2px;">
      ${iconSvgMapPinFilledBackShadow}
    </div>
    ${iconSvgMapPinFilledBack}
    ${iconSvgMapPinFilled}
  </div>
`;

/**
 * Map marker icon with drop shadow, background and
 *
 * Pale red/orange foreground easyly visible against the leaflet map tiles.
 */
export function createMapMarkerIcon() {
  return new L.DivIcon({
    className: "",
    html: iconHtml,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
}
