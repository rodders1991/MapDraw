// JavaScript source code CONVERT TO POINT

var TILE_SIZE = 256;

function bound(value, opt_min, opt_max) {
    if (opt_min != null) value = Math.max(value, opt_min);
    if (opt_max != null) value = Math.min(value, opt_max);
    return value;
}

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
    return rad / (Math.PI / 180);
}

/** @constructor */
function MercatorProjection() {


    this.pixelOrigin_ = new google.maps.Point(TILE_SIZE / 2,
        TILE_SIZE / 2);
    this.pixelsPerLonDegree_ = TILE_SIZE / 360;
    this.pixelsPerLonRadian_ = TILE_SIZE / (2 * Math.PI);




}

MercatorProjection.prototype.fromLatLngToPoint = function (latLng,
    opt_point) {
    var me = this;
    var point = opt_point || new google.maps.Point(0, 0);
    var origin = me.pixelOrigin_;

    point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;

    // Truncating to 0.9999 effectively limits latitude to 89.189. This is
    // about a third of a tile past the edge of the world tile.
    var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999,
        0.9999);
    point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) *
        -me.pixelsPerLonRadian_;
    return point;
};

MercatorProjection.prototype.fromPointToLatLng = function (startPoint, pixelCoordinate) {
    var changeX;
    var changeY;
    if ((window.innerWidth / 2) > startPoint.x) { changeX = (window.innerWidth / 2) + startPoint.x - window.innerWidth; }
    if ((window.innerWidth / 2) < startPoint.x) { changeX = -(window.innerWidth / 2) + startPoint.x; }
    if ((window.innerWidth / 2) == startPoint.x) { changeX = 0; }

    if ((window.innerHeight / 2) > startPoint.y) { changeY = (window.innerHeight / 2) + startPoint.y - window.innerHeight; }
    if ((window.innerHeight / 2) < startPoint.y) { changeY = -(window.innerHeight / 2) + startPoint.y; }
    if ((window.innerHeight / 2) == startPoint.y) { changeY = 0; }

    startPoint.x = (pixelCoordinate.x + changeX) / (Math.pow(2, map.getZoom()));
    startPoint.y = (pixelCoordinate.y + changeY) / (Math.pow(2, map.getZoom()));

    var me = this;
    var origin = me.pixelOrigin_;
    var lng = (startPoint.x - origin.x) / me.pixelsPerLonDegree_;
    var latRadians = (startPoint.y - origin.y) / -me.pixelsPerLonRadian_;
    var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) -
        Math.PI / 2);
    return new google.maps.LatLng(lat, lng);
};

