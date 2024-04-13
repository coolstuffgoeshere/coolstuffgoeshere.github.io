const zoomData = {
    zoom: 1.0,
    x: 0,
    y: 0
};

// Update CSS transforms for the map zoom and position.
function updateZoom() {
    const r = mapContainer.getBoundingClientRect();
    const min = Math.min(r.width, r.height);
    map.style.transform = `translate(${zoomData.x*min}px, ${zoomData.y*min}px) scale(${zoomData.zoom})`;
    // Adjust pin size based on map zoom level
    var pins = document.getElementsByClassName('pin');
    for (var i = 0; i < pins.length; i++) {
        pins[i].style.transform = `scale(${1 / zoomData.zoom})`;
    }
}

function changeZoom(x, y, scale) {
    const oldZoom = zoomData.zoom;
    zoomData.zoom *= scale;

    // Clamp zoom between a minimum and maximum value.
    zoomData.zoom = Math.min(Math.max(0.5, zoomData.zoom), 8.0);
    
    // Apply translation to keep the zoom centered on the cursor.
    zoomData.x -= (zoomData.zoom - oldZoom) * x;
    zoomData.y -= (zoomData.zoom - oldZoom) * y;
    
    // Clamp translation to keep the zoomed map within the viewport.
    zoomData.x = Math.min(Math.max(-zoomData.zoom, zoomData.x), zoomData.zoom);
    zoomData.y = Math.min(Math.max(-zoomData.zoom, zoomData.y), zoomData.zoom);

    updateZoom();
    console.log("Zoom Value: " + zoomData.zoom);
    console.log("X Value: " + zoomData.x);
    console.log("Y Value: " + zoomData.y);
}

// Touchscreen events.
const hammertime = new Hammer(mapContainer);
hammertime.get('pinch').set({ enable: true });
hammertime.get('pan').set({ enable: true });

// Touchscreen zoom event handlers.
let pinchData = {lastZoom: 1};
hammertime.on('pinchstart', function(ev) {
    const rect = map.getBoundingClientRect();
    pinchData = {
        x: (ev.center.x - rect.x) / rect.width,
        y: (ev.center.y - rect.y) / rect.height,
        lastZoom: 1,
    };
    pinchMove(ev);
})
hammertime.on('pinchmove', pinchMove)

function pinchMove(ev) {
    changeZoom(pinchData.x, pinchData.y, ev.scale/pinchData.lastZoom);
    pinchData.lastZoom = ev.scale;
}

// Touchscreen move event handlers.
let panData = {x: 0, y: 0};
hammertime.on('panstart', function(ev) {
    panData = {x: 0, y: 0};
    panMove(ev);
})
hammertime.on('panmove', panMove)

function panMove(ev) {
    const rect = map.getBoundingClientRect();
    zoomData.x += (ev.deltaX - panData.x) / rect.width * zoomData.zoom;
    zoomData.y += (ev.deltaY - panData.y) / rect.height * zoomData.zoom;
    panData = {x: ev.deltaX, y: ev.deltaY};
    updateZoom();
}

// Mouse wheel zoom event handler.
mapContainer.addEventListener('wheel', function(event) {
    // Compute the cursor position as a percentage of the map size.
    const rect = map.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
   
    // Determine the direction of the scroll and adjust the zoom level.
    const sign = event.deltaY < 0 ? 1 : -1;
    changeZoom(x, y, 1 + sign * 0.05);
});