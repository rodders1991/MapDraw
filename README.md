Map Draw

Map draw is a application to convert svg objects into Google Map Polygons. As a developing programmer I welcome any suggestions on how to make this project better.

The project contains to demo indexes, one that is suited for mobile, the other for desktop. The application runs from my MapDraw.js file which has the following classes and functions:

--- Shape ---

Contains a class called MakeShape, which inputs the points within a SVG polyline, removes any duplicate points, checks whether the shape is complete by checking if the line intesects itself, clears the line endings from the intersection point and creates a clean object array ready to be passed to ConverPoints.

Special thanks to Peter Kelley, who supplied a function on stackoverflow that I've used to determine whether the shape intersects

--- ConvertPoints ---

Contains a class called MercatorProjection, this converts the points given from the shape.js file, too points on a google map based on the maps central position, zoom scale, the windows width and height. This however is running a slight defect which is causing shape to translate very slightly to the left.


--- Further Development ---

I'm looking to make this as generic as possible, hopefully to the point where the user can just input a map canvas element and attach the relevant javascript file.

Further testing is required also.

As I mentioned above please feel free to add your input
