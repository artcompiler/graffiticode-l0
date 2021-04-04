import '../../test/viewer-setup';
import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import './viewer';

let Viewer = window.gcexports.viewer.Viewer;
let data = 123;

beforeEach(() => {
  window.gcexports.dispatcher = {register: sinon.spy(), dispatch: sinon.spy()};
});

describe('Viewer', () => {
  it('renders the data', () => {
    const component = mount(<Viewer id="graff-view" className="viewer" obj={data} />);
    expect(component.find('span').text()).to.equal("123");
  });
});

