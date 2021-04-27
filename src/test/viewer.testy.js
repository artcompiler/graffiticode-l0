import './viewer-setup';
import * as React from 'react';
import enzyme from 'enzyme';
import sinon from 'sinon';
let Viewer = window.gcexports.viewer.Viewer;
let data = 123;

let dispatcher;
beforeEach(() => {
  window.gcexports.dispatcher = {register: sinon.spy(), dispatch: sinon.spy()};
});

describe('Viewer', () => {
  it('renders the data', () => {
    const component = enzyme.mount(<Viewer id="graff-view" className="viewer" obj={data} />);
    expect(component.find('span').text()).to.equal("123");
  });
});

