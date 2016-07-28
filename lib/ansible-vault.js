'use babel';

import AnsibleVaultView from './ansible-vault-view';
import AnsibleVaultMessageView from './ansible-vault-message-view';
import { CompositeDisposable } from 'atom';
import { BufferedProcess } from 'atom';

export default {

  ansibleVaultView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.ansibleVaultView = new AnsibleVaultView(state.ansibleVaultViewState);
    this.ansibleVaultMessageView = new AnsibleVaultMessageView(state.ansibleVaultMessageViewState);

    this.modalPanel = atom.workspace.addModalPanel({
      item: this.ansibleVaultView.getElement(),
      visible: false
    });

    this.modalPanelMsg = atom.workspace.addModalPanel({
      item: this.ansibleVaultMessageView.getElement(),
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
    this.modalPanelMsg.destroy();
    this.subscriptions.dispose();
    this.ansibleVaultView.destroy();
    this.AnsibleVaultMessageView.destroy();
  },

  serialize() {
    return {
      ansibleVaultViewState: this.ansibleVaultView.serialize()
      ansibleVaultMessageViewState: this.AnsibleVaultMessageView.serialize()
    };
  },

  reset(inputbox) {
    inputbox.value = "";
    this.modalPanel.hide();
  },

  execWrapper(inputbox){
      var password = inputbox.value;
      this.reset(inputbox);
      editor = atom.workspace.getActiveTextEditor();
      vault_filepath = editor.getPath();
      console.log(vault_filepath);
      if (editor.getText().substring(0,14) == "$ANSIBLE_VAULT") {
        console.log("Decryption loading..");
        complete = new BufferedProcess({
           command: __dirname + "/bin/vault_wrapper.py",
           args: [vault_filepath, password, "decrypt"],
           options: {
               stdio: "pipe",
           },
           stdout: function(x) { console.log("out", x); },
           stderr: function(x) { console.log("err", x); }
         })
      } else {
        console.log("Encryption loading..");
        complete = new BufferedProcess({
           command: __dirname + "/bin/vault_wrapper.py",
           args: [vault_filepath, password, "encrypt"],
           options: {
               stdio: "pipe",
           },
           stdout: function(x) { console.log("out", x); },
           stderr: function(x) { console.log("err", x); }
         })
      }
      delete password;
  },

  toggle() {

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
