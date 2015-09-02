// JavaScript source code


function MapDraw(map, mapCanvas)
{
    var canPos = document.getElementById(mapCanvas).getBoundingClientRect();
    var overlay = document.createElement("MapOverlay");

    document.body.appendChild(overlay);

    overlay.id = "MapOverlay";
    overlay.style.position = "absolute";
    overlay.style.width = canPos.width + "px";
    overlay.style.height = canPos.height + "px";
    overlay.style.top = canPos.top + "px";
    overlay.style.left = canPos.left + "px";
    overlay.style.display = "none";

    overlay.innerHTML = "<svg height='100%' width='100%'> <polyline id='line' points='' style='fill:none;stroke:black;stroke-width:1' /></svg> ";


    var points = '';
    var dragging = false;
    var shaped = [];


    overlay.onmousedown = function () {

        dragging = true;
        shaped.length = 0;
        points = '';
        if (dragging == true) {
            overlay.onmousemove = function (e) {
                e.preventDefault();

                if (dragging == true) {
                    points += e.pageX + ',' + e.pageY + ' ';
                    shaped.push({ x: e.pageX, y: e.pageY });
                    document.getElementById("line").setAttribute('points', points);
                }
            };
        }

    };



    overlay.onmouseup = function () {

        document.getElementById("line").setAttribute('points', '');
        var shape = [];
        dragging = false;

        var makeShape = new MakeShape(shaped);

        if (makeShape.isShape) {
            shape = makeShape.points;

            // Point Start
            var projection = new MercatorProjection();

            var numTiles = 1 << map.getZoom();

            var centerPixel = projection.fromLatLngToPoint(map.getCenter());

            var pixelCoordinate = new google.maps.Point(
              centerPixel.x * numTiles,
              centerPixel.y * numTiles);



            var polygonPoints = [];

            for (var p = 0; p < shape.length; p++) {


                var myLatlng = projection.fromPointToLatLng(shape[p], pixelCoordinate);

                polygonPoints.push(myLatlng);

            }

            var polygon = new google.maps.Polygon({
                paths: polygonPoints,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });

            polygon.setMap(map);
        }


        points = '';
        shaped.length = 0;

    };
}

function MapDrawMobile(map,mapCanvas)
{
    var canPos = document.getElementById(mapCanvas).getBoundingClientRect();
    var overlay = document.createElement("MapOverlay");

    document.body.appendChild(overlay);

    overlay.id = "MapOverlay";
    overlay.style.position = "absolute";
    overlay.style.width = canPos.width + "px";
    overlay.style.height = canPos.height + "px";
    overlay.style.top = canPos.top + "px";
    overlay.style.left = canPos.left + "px";
    overlay.style.display = "none";

    overlay.innerHTML = "<svg height='100%' width='100%'> <polyline id='line' points='' style='fill:none;stroke:black;stroke-width:1' /></svg> ";


    var points = '';
    var dragging = false;
    var shaped = [];


    document.getElementById("drawWrap").addEventListener('touchstart', function () {

        dragging = true;
        shaped.length = 0;
        points = '';

        if (dragging == true) {
            document.getElementById("drawWrap").addEventListener('touchmove', function (e) {
                e.preventDefault();
                var touch = e.touches[0];

                points += touch.pageX + ',' + touch.pageY + ' ';
                shaped.push({ x: touch.pageX, y: touch.pageY });
                document.getElementById("line").setAttribute('points', points);

            }, false);
        }

    }, false);



    document.getElementById("drawWrap").addEventListener('touchend', function () {

        document.getElementById("line").setAttribute('points', '');
        var shape = [];
        dragging = false;

        var makeShape = new MakeShape(shaped);

        if (makeShape.isShape) {
            shape = makeShape.points;

            // Point Start
            var projection = new MercatorProjection();

            var numTiles = 1 << map.getZoom();

            var centerPixel = projection.fromLatLngToPoint(map.getCenter());

            var pixelCoordinate = new google.maps.Point(
              centerPixel.x * numTiles,
              centerPixel.y * numTiles);



            var polygonPoints = [];

            for (var p = 0; p < shape.length; p++) {


                var myLatlng = projection.fromPointToLatLng(shape[p], pixelCoordinate);

                polygonPoints.push(myLatlng);

            }

            var polygon = new google.maps.Polygon({
                paths: polygonPoints,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });

            polygon.setMap(map);
        }


        points = '';
        shaped.length = 0;

    }, false);
}


function toggleDraw() {


    var ele = document.getElementById("MapOverlay").style.display;

    if(ele == "none")
    {
        document.getElementById("MapOverlay").style.display = "inline";
    } else {
        document.getElementById("MapOverlay").style.display = "none";
    }
};



/*
    Shape class, cleans the points and checks whether a true shape has been drawn
*/

MakeShape.prototype.points;
MakeShape.prototype.isShape;

function MakeShape(inPoints) {
    this.points = this.finalPoints(inPoints);
}

MakeShape.prototype.finalPoints = function (inPoints) {

    var myPoints = this.cleanPoints(inPoints);

    myPoints = this.testShape(myPoints);


    if (myPoints != false) {
        this.isShape = true;
        return myPoints;
    }
    else {
        this.isShape = false;
        return false;
    }

};


MakeShape.prototype.testShape = function (inPoints) {

    var myPoints = this.intesectTest(inPoints);

    if (myPoints != false) {
        return myPoints;
    }
    else {
        this.isShape = false;
        return false;
    }

};



MakeShape.prototype.cleanPoints = function (inPoints) {

    var myPoints = [];

    for (var i = 0; i < inPoints.length; i++) {
        if (i > 0) {
            if (inPoints[i].x != inPoints[i - 1].x || inPoints[i].y != inPoints[i - 1].y) {
                myPoints.push({ x: inPoints[i].x, y: inPoints[i].y });
            }


        } else { myPoints.push({ x: inPoints[i].x, y: inPoints[i].y }); }
    }

    return myPoints;

};




// Test if points intesects and returns a clean shape or returns false, This is test one
MakeShape.prototype.intesectTest = function (inPoints) {

    var lines = [];
    var myPoints = [];

    for (var i = 0; i < (inPoints.length - 1) ; i++) {


        lines.push({ x1: inPoints[i].x, y1: inPoints[i].y, x2: inPoints[i + 1].x, y2: inPoints[i + 1].y });
    }


    var touch = false;

    for (var i = 0; i < lines.length; i++) {

        for (var j = 0; j < lines.length; j++) {

            if (i == j) { continue; }
            if (i + 1 == j) { continue; }
            if (i - 1 == j) { continue; }

            var start1 = { x: lines[i].x1, y: lines[i].y1 };
            var end1 = { x: lines[i].x2, y: lines[i].y2 };

            var start2 = { x: lines[j].x1, y: lines[j].y1 };
            var end2 = { x: lines[j].x2, y: lines[j].y2 };

            touch = doLineSegmentsIntersect(start1, end1, start2, end2);

            if (touch == true) {


                intercept = findPass(lines[i], lines[j]);
                error = 'On Lines: ' + j + ' and: ' + i;
                n1 = i;
                n2 = j;
                if (!isNaN(intercept.x) && !isNaN(intercept.y)) {

                    var maxP = Math.max(i, j);
                    var minP = Math.min(i, j);
                    for (var l = minP; l < maxP; l++) { myPoints.push({ x: lines[l].x1, y: lines[l].y1 }); }
                    myPoints.push(intercept);
                    myPoints.shift();
                    return myPoints;
                }
            }

        }

    }

    return false;

};



/**
 * @author Peter Kelley
 * @author pgkelley4@gmail.com
 */

/**
 * See if two line segments intersect. This uses the 
 * vector cross product approach described below:
 * http://stackoverflow.com/a/565282/786339
 * 
 * @param {Object} p point object with x and y coordinates
 *  representing the start of the 1st line.
 * @param {Object} p2 point object with x and y coordinates
 *  representing the end of the 1st line.
 * @param {Object} q point object with x and y coordinates
 *  representing the start of the 2nd line.
 * @param {Object} q2 point object with x and y coordinates
 *  representing the end of the 2nd line.
 */
function doLineSegmentsIntersect(p, p2, q, q2) {
    var r = subtractPoints(p2, p);
    var s = subtractPoints(q2, q);

    var uNumerator = crossProduct(subtractPoints(q, p), r);
    var denominator = crossProduct(r, s);

    if (uNumerator == 0 && denominator == 0) {
        // colinear, so do they overlap?
        return ((q.x - p.x < 0) != (q.x - p2.x < 0) != (q2.x - p.x < 0) != (q2.x - p2.x < 0)) ||
			((q.y - p.y < 0) != (q.y - p2.y < 0) != (q2.y - p.y < 0) != (q2.y - p2.y < 0));
    }

    if (denominator == 0) {
        // lines are paralell
        return false;
    }

    var u = uNumerator / denominator;
    var t = crossProduct(subtractPoints(q, p), s) / denominator;

    return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
}

/**
 * Calculate the cross product of the two points.
 * 
 * @param {Object} point1 point object with x and y coordinates
 * @param {Object} point2 point object with x and y coordinates
 * 
 * @return the cross product result as a float
 */
function crossProduct(point1, point2) {
    return point1.x * point2.y - point1.y * point2.x;
}

/**
 * Subtract the second point from the first.
 * 
 * @param {Object} point1 point object with x and y coordinates
 * @param {Object} point2 point object with x and y coordinates
 * 
 * @return the subtraction result as a point object.
 
  
 var start1 = {x:0,y:0};
 var end1 = {x:3,y:6};
 var start2 = {x:3,y:0};
 var end2 = {x:0,y:10};
 doLineSegmentsIntersect(start1, end1, start2, end2);
 */


function subtractPoints(point1, point2) {
    var result = {};
    result.x = point1.x - point2.x;
    result.y = point1.y - point2.y;

    return result;
}

function findPass(myLine1, myLine2) {
    var resultPoint = {};
    var line1 = myLine1;
    var line2 = myLine2;

    var rise1 = (line1.y2 - line1.y1);
    var run1 = (line1.x2 - line1.x1);

    var rise2 = (line2.y2 - line2.y1);
    var run2 = (line2.x2 - line2.x1);

    var myM1;// = rise1 / run1;
    var myC1;// = line1.y1 - (myM1*line1.x1);
    var myM2;// = rise2 / run2;
    var myC2;// = line2.y1 - (myM2*line2.x1);

    if (rise1 == 0 || rise2 == 0 || run1 == 0 || run2 == 0) {

        if (rise1 == 0 || rise2 == 0) {

            if (rise1 == 0) { myM1 = 0; } else { myM1 = rise1 / run1; }
            if (rise2 == 0) { myM2 = 0; } else { myM2 = rise2 / run2; }


            myC1 = line1.y1 - (myM1 * line1.x1);

            myC2 = line2.y1 - (myM2 * line2.x1);

            resultPoint.x = Math.round((myC2 - myC1) / (myM1 - myM2));

            resultPoint.y = Math.round((myM1 * resultPoint.x) + myC1);


        }

        if (run1 == 0 || run2 == 0) {

            if (run1 == 0) { myM1 = 0; } else { myM1 = run1 / rise1; }
            if (run2 == 0) { myM2 = 0; } else { myM2 = run2 / rise2; }

            myC1 = line1.x1 - (myM1 * line1.y1);

            myC2 = line2.x1 - (myM2 * line2.y1);

            resultPoint.y = Math.round((myC2 - myC1) / (myM1 - myM2));

            resultPoint.x = Math.round((myM1 * resultPoint.y) + myC1);

        }


    }

    if (rise1 != 0 && rise2 != 0 && run1 != 0 && run2 != 0) {

        myM1 = rise1 / run1;
        myC1 = line1.y1 - (myM1 * line1.x1);
        myM2 = rise2 / run2;
        myC2 = line2.y1 - (myM2 * line2.x1);

        resultPoint.x = Math.round((myC2 - myC1) / (myM1 - myM2));

        resultPoint.y = Math.round((myM1 * resultPoint.x) + myC1);

    }





    return resultPoint;

}



/* 

Converts points into longitude and latitude points on Google Map

*/


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