/*eslint no-unused-vars: 0*/

import FabricCanvasTool from './fabrictool'

const fabric = require('fabric').fabric;

class Ellipse extends FabricCanvasTool {

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
    let canvas = this._canvas;
    this.isDown = true;
    let pointer = canvas.getPointer(o.e);
    [this.startX, this.startY] = [pointer.x, pointer.y];
    this.ellipse = new fabric.Ellipse({
        left: this.startX,
        top: this.startY,
        originX: 'left',
        originY: 'top',
        rx: pointer.x-this.startX,
        ry: pointer.y-this.startY,
        angle: 0,
        fill: this._fill,
        stroke: this._color,
        strokeWidth: this._width,
        selectable: false,
        evented: false,
    });
    canvas.add(this.ellipse);
  }

  doMouseMove(o) {
    if (!this.isDown) return;
    let canvas = this._canvas;
    var pointer = canvas.getPointer(o.e);
    var rx = Math.abs(this.startX - pointer.x)/2;
    var ry = Math.abs(this.startY - pointer.y)/2;
    if (rx > this.ellipse.strokeWidth) {
      rx -= this.ellipse.strokeWidth/2
    }
     if (ry > this.ellipse.strokeWidth) {
      ry -= this.ellipse.strokeWidth/2
    }
    this.ellipse.set({ rx: rx, ry: ry});
    
    if(this.startX>pointer.x){
      this.ellipse.set({originX: 'right' });
    } else {
      this.ellipse.set({originX: 'left' });
    }
    if(this.startY>pointer.y){
      this.ellipse.set({originY: 'bottom'  });
    } else {
      this.ellipse.set({originY: 'top'  });
    }
    this.ellipse.setCoords();
    canvas.renderAll();
  }

  doMouseUp(o) {
    this.isDown = false;
  }
}

export default Ellipse;