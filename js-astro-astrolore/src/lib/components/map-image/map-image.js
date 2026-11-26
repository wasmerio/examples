const placeIcon = L.icon({
    iconUrl: "/assets/place-marker-24.png",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
});

export class MapImage extends HTMLElement {
    constructor() {
        super();
        var projectId = this.getAttribute("projectId");
        var id = this.getAttribute("id");
        var src = this.getAttribute("src");
        var markers = this.getAttribute("markers")
            ? JSON.parse(this.getAttribute("markers"))
            : [];

        var img = new Image();
        img.src = src;

        img.onload = () => {
            var map = L.map(`map-${id}`, {
                crs: L.CRS.Simple,
                minZoom: -2,
            });

            map.getPane("mapPane").style.zIndex = 5;

            var bounds = [
                [0, 0],
                [img.naturalHeight, img.naturalWidth],
            ];
            L.imageOverlay(src, bounds).addTo(map);
            map.fitBounds(bounds);

            for (const marker of markers) {
                var m = L.marker([marker.y, marker.x], {
                    icon: placeIcon,
                }).addTo(map);
                if (marker.label && !marker.link) {
                    m.bindPopup(marker.label);
                } else if (marker.label && marker.link) {
                    var p = L.popup().setContent(
                        `<a href="/${projectId}/articles/${marker.link}">${marker.label}</a>`,
                    );
                    m.bindPopup(p);
                }
            }
        };
    }
}

customElements.define("map-image", MapImage);
