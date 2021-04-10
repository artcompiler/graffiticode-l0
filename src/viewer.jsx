import * as React from 'react';
import * as d3 from 'd3';
//import {Viewer as BasisViewer} from '@graffiticode/basis/src/viewer.jsx';
import {Viewer as BasisViewer} from '../../../../work/graffiticode/basis/src/viewer.jsx';
import './style.css';
class Viewer extends BasisViewer {};
window.gcexports.viewer = {
  Viewer: Viewer
};
