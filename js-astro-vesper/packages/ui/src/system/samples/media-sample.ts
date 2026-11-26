/**
 * The Media sample's picture: a still life drawn as SVG (a wall, a shelf, an arch and a bowl), so the
 * kit ships no photo. Neutral greys and sand, readable in light and dark pages.
 */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
<rect width="1200" height="900" fill="#d9d3c9"/>
<rect y="610" width="1200" height="290" fill="#bfb6a8"/>
<rect y="600" width="1200" height="14" fill="#a99f90"/>
<path d="M330 600V380a140 140 0 0 1 280 0v220z" fill="#8f8577"/>
<ellipse cx="800" cy="560" rx="150" ry="42" fill="#efebe4"/>
<path d="M650 560a150 80 0 0 0 300 0z" fill="#efebe4"/>
<circle cx="900" cy="250" r="70" fill="#e9e3d9"/>
</svg>`;

export const mediaSample = {
	src: `data:image/svg+xml,${encodeURIComponent(svg)}`,
	width: 1200,
	height: 900,
};
