/*eslint no-unused-vars: 0*/

import FabricCanvasTool from './fabrictool'

const fabric = require('fabric').fabric;

var roof = null;
var roofPoints = [];
var lines = [];
var lineCounter = 0;
var drawingObject = {
    type: "",
    background: "",
    border: ""
};
var x = 0;
var y = 0;

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function setStartingPoint(o, canvas) {
    let pointer = canvas.getPointer(o.e);
    x = pointer.x;
    y = pointer.y;
}

function makeRoof(roofPoints) {

    var left = findLeftPaddingForRoof(roofPoints);
    var top = findTopPaddingForRoof(roofPoints);
    roofPoints.push(new Point(roofPoints[0].x,roofPoints[0].y))
    var roof = new fabric.Polyline(roofPoints, {
    fill: 'rgba(0,0,0,0)',
    stroke:'#58c'
    });
    roof.set({
        
        left: left,
        top: top,
       
    });


    return roof;
}

function findTopPaddingForRoof(roofPoints) {
    var result = 999999;
    for (var f = 0; f < lineCounter; f++) {
        if (roofPoints[f].y < result) {
            result = roofPoints[f].y;
        }
    }
    return Math.abs(result);
}

function findLeftPaddingForRoof(roofPoints) {
    var result = 999999;
    for (var i = 0; i < lineCounter; i++) {
        if (roofPoints[i].x < result) {
            result = roofPoints[i].x;
        }
    }
    return Math.abs(result);
}

class Polygon extends FabricCanvasTool {

  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    canvas.forEachObject((o) => o.selectable = o.evented = false);
    this._width = props.lineWidth;
    this._color = props.lineColor;
    this._fill = props.fillColor;

    if (drawingObject.type == "roof") {
        drawingObject.type = "";
        lines.forEach(function(value, index, ar){
             canvas.remove(value);
        });
        roof = makeRoof(roofPoints);
        canvas.add(roof);
        canvas.renderAll();
    } else {
        drawingObject.type = "roof"; // roof type
    }
  }

  doMouseDown(o) {
    let canvas = this._canvas;
    this.isDown = true;

    if (drawingObject.type == "roof") {
        canvas.selection = false;
        setStartingPoint(o, canvas); // set x,y
        roofPoints.push(new Point(x, y));
        var points = [x, y, x, y];
        lines.push(new fabric.Line(points, {
            strokeWidth: 3,
            selectable: false,
            stroke: 'red',
        }));
        canvas.add(lines[lineCounter]);
        lineCounter++;
        canvas.on('mouse:up', function (o) {
            canvas.selection = true;
        });
    }
  }

  doMouseMove(o) {
    if (!this.isDown) return;
    let canvas = this._canvas;

    if (lines[0] !== null && lines[0] !== undefined && drawingObject.type == "roof") {
        setStartingPoint(o, canvas);
        lines[lineCounter - 1].set({
            x2: x,
            y2: y
        });
        canvas.renderAll();
    }
  }

  doMouseUp(o) {
    this.isDown = false;
  }

  doWindowDoubleClick(e) {
    let canvas = this._canvas;
    drawingObject.type = "";
    lines.forEach(function(value, index, ar){
         canvas.remove(value);
    });
    //canvas.remove(lines[lineCounter - 1]);
    roof = makeRoof(roofPoints);
    canvas.add(roof);
    canvas.renderAll();

    //clear arrays
    roofPoints = [];
    lines = [];
    lineCounter = 0;
  }
}

export default Polygon;