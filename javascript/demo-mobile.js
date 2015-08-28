// JavaScript source code DEMO-MOBILE

$("#zoomIn").on('tap',function()
{
    var myZoom = map.getZoom() + 1;
    map.setZoom(myZoom);
});


$("#zoomOut").on('tap',function()
{
    var myZoom = map.getZoom() -1;
    map.setZoom(myZoom);
});

$('#draw').on('tap',function() { 

    $("#drawWrap").toggle();
    document.getElementById("line").setAttribute('points', '' );

    $('#draw').toggleClass("drawEnd");
    $('#draw').toggleClass('drawStart');

});

var marginTop = window.innerHeight - 100;
var marginLeft = (window.innerWidth - 700)/2;

$("#toggleBar").css("top",marginTop);
$("#toggleBar").css("left",marginLeft);

setInterval(function() {
    marginTop = window.innerHeight - 100;
    marginLeft = (window.innerWidth - 700)/2;
	
    $("#toggleBar").css("top",marginTop);
    $("#toggleBar").css("left",marginLeft);
	
},100);

var points = '';
var dragging = false;
var shaped = [];


document.getElementById("drawWrap").addEventListener('touchstart', function() {

    dragging = true;
    shaped.length = 0;
    points = '';

    if(dragging == true)
    {
        document.getElementById("drawWrap").addEventListener('touchmove', function(e) {
            e.preventDefault();
            var touch = e.touches[0];
    
            points += touch.pageX+','+touch.pageY+ ' ';
            shaped.push({x:touch.pageX,y:touch.pageY});
            document.getElementById("line").setAttribute('points', points );
	
        },false);
    }
	
},false);



document.getElementById("drawWrap").addEventListener('touchend',function() {
	
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
	
},false);
