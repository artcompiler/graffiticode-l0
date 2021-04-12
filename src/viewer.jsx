import * as React from 'react';
import * as d3 from 'd3';
import './style.css';
class Viewer extends React.Component {
  componentDidMount() {
    d3.select('#graff-view').append('div').classed('done-rendering', true);
  }
  render() {
    const elts = JSON.stringify(this.props.obj, null, 2);
    return (
      <pre style={{fontSize: 11}}>{elts}</pre>
    );
  }
};

window.gcexports.viewer = {
  Viewer: Viewer
};

