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

