/* Copyright (c) 2017, Art Compiler LLC */
/* @flow */
import * as React from 'react';
import * as d3 from 'd3';

import './style.css';

class Viewer extends React.Component {
  componentDidMount() {
    d3.select('#graff-view').append('div').classed('done-rendering', true);
  }

  render() {
    // If you have nested components, make sure you send the props down to the
    // owned components.
    let props = this.props;
    let obj = props.obj ? [].concat(props.obj) : [];
    let elts = [];
    obj.forEach(function (d, i) {
      let style = {};
      if (d.style) {
        Object.keys(d.style).forEach(function (k) {
          style[k] = d.style[k];
        });
      }
      let val = d.value ? d.value : d;
      if (val instanceof Array) {
        val = val.join(' ');
      } else if (typeof val !== 'string' &&
                 typeof val !== 'number' &&
                 typeof val !== 'boolean') {
        val = JSON.stringify(val);
      }
      elts.push(<span key={i} style={style}>{val}</span>);
    });

    if (elts.length > 0) {
      return (
        <div>
          <div className="L0">{elts}</div>
        </div>
      );
    }
    return <div />;
  }
};

window.gcexports.viewer = (function () {
  return {
    Viewer: Viewer,
  };
})();
