/*eslint no-unused-vars: 0*/

import FabricCanvasTool from './fabrictool'

const fabric = require('fabric').fabric;

class Triangle extends FabricCanvasTool {

  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    canvas.forEachObject((o) => o.selectable = o.evented = false);
    canvas.defaultCursor = 'crosshair';
    this._width = props.lineWidth;
    this._color = props.lineColor;
    this._fill = props.fillColor;
  }

  doMouseDown(o) {
    this.isDown = true;
    let canvas = this._canvas;
    var pointer = canvas.getPointer(o.e);

    this.origX = pointer.x;
    this.origY = pointer.y

    this.head = new fabric.Triangle({
      strokeWidth: this._width,
      stroke: this._color,
      fill: this._fill,
      left: pointer.x,
      top: pointer.y,
      height: 3,
      width: 3,
      selectable: false,
      evented: false,
      originX: 'center',
    });

    canvas.add(this.head);
  }

  doMouseMove(o) {
    if (!this.isDown) return;
    let canvas = this._canvas;
    var pointer = canvas.getPointer(o.e);

    this.head.set({ 
        width: Math.abs(this.origX - pointer.x),
        height: Math.abs(this.origY - pointer.y)
    });
    this.head.setCoords();
    canvas.renderAll();
  }

  doMouseUp(o) {
    this.isDown = false;
  }
}

export default Triangle;