'use babel';

import AnsibleVaultView from '../lib/ansible-vault-view';

describe('AnsibleVaultView', () => {

  let temp_view;

  beforeEach(function () {
    temp_view = new AnsibleVaultView();
  });

  it('has a div with ansible-vault class', () => {
    //expect(temp_view.items.length).toBe(5);
    console.log(temp_view);
  });
});
