import React from 'react';
import { shallow } from 'enzyme';

import HomePage, { RoleList } from '../HomePage';
import Loading from '../Loading';

function createMockApi(roles = null) {
  const api = jest.fn();
  if (roles !== null) {
    api.getRoleSummary = (handler) => handler({
      result: {
        roleSummaryResult: {
          summaries: roles
        }
      }
    });
  } else {
    api.getRoleSummary = (handler) => { };
  }
  return api;
}

const roles = [{role: 'test', jobCount: 0, cronJobCount: 5}];

describe('HomePage suite', () => {
  it('should render a loading div', () => {
    const home = shallow(<HomePage api={createMockApi()} />);
    expect(home.contains(<Loading />)).toBe(true);
  });

  it('should show a role list', () => {
    const home = shallow(<HomePage api={createMockApi(roles)} />);
    expect(home.contains(<Loading />)).toBe(false);
    expect(home.contains(<RoleList roles={roles} />)).toBe(true);
  });
});
