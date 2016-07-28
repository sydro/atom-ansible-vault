'use babel';

import AnsibleVaultView from './ansible-vault-view';
import { CompositeDisposable } from 'atom';

export default {

  ansibleVaultView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.ansibleVaultView = new AnsibleVaultView(state.ansibleVaultViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.ansibleVaultView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'ansible-vault:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.ansibleVaultView.destroy();
  },

  serialize() {
    return {
      ansibleVaultViewState: this.ansibleVaultView.serialize()
    };
  },

  reset(inputbox) {
    inputbox.value = "";
    this.modalPanel.hide();
  },

  execWrapper(inputbox){
      password = inputbox.value;
      this.reset(inputbox);
      editor = atom.workspace.getActiveTextEditor();
      vault_filepath = editor.getPath();
      console.log(vault_filepath);
  },

  toggle() {
    console.log('AnsibleVault was toggled!');

    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide()
    } else {
      test = this.ansibleVaultView.getElement().children[1];
      test.parentView = this;
      test.addEventListener('keyup', function(event) {
          if (event.keyCode == 13) {
            this.parentView.execWrapper(this);
          } else if (event.keyCode == 27) {
            this.parentView.reset(this);
          }
      });
      this.modalPanel.show();
      document.getElementById('passbox').focus();
    }
  }

};
