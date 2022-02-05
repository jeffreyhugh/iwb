/*eslint no-unused-vars: 0*/

import FabricCanvasTool from './fabrictool'

class Remove extends FabricCanvasTool {

  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.forEachObject((o) => {
      o.selectable = o.evented = true;
    });
    if(props.removeIcon) canvas.hoverCursor = `url('${props.removeIcon}'), auto`;
  }

  doMouseDown(o) {
    let canvas = this._canvas;
    if(o.target) canvas.remove(o.target);
  }
}

export default Remove