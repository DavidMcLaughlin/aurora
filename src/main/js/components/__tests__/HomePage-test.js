import React from 'react';
import { shallow, mount, render } from 'enzyme';

import HomePage from '../HomePage';
import Loading from '../Loading';

const mockApi = jest.fn()
mockApi.getRoleSummary = (callback) => []

describe('HomePage suite', () => {
  it('should render a loading div', () => {
    expect(shallow(<HomePage api={mockApi} />).contains(<Loading />)).toBe(true);
  });
});
