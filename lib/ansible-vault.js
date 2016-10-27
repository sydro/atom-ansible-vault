'use babel';

import AnsibleVaultView from './ansible-vault-view';
import { CompositeDisposable } from 'atom';
import { BufferedProcess } from 'atom';
import configSchema from "./config-schema";

export default {

  config: configSchema,
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

  notifyMessage(exitCode, output, error){
      if (exitCode != 0) {
        //console.log(error);
        atom.notifications.addError(error.toString(), { dismissable: true });
      } else {
        //console.log(output);
        atom.notifications.addSuccess(output.toString(), { dismissable: false });
      }
  },

  checkActiveEditor() {
    editor = atom.workspace.getActiveTextEditor();
    if (typeof editor !== 'undefined' && editor.getPath) {
      return editor
    } else {
      this.notifyMessage(2,"","ERROR: File not selected!");
      this.reset(this.ansibleVaultView);
      return
    }
  },

  getFilename(editor){
    return filename = editor.getPath();
  },

  execWrapper(inputbox){
      var password = inputbox.value;
      this.reset(inputbox);

      editor = this.checkActiveEditor();
      var vault_filepath = this.getFilename(editor);

      if (editor.getText().substring(0,14) == "$ANSIBLE_VAULT") {
        action = "decrypt";
      } else {
        action = "encrypt";
      }
      var output = []
      var error = []
      var password_file = ""
      if (atom.config.get("ansible-vault.vault_password_file_flag")) {
        password_file = atom.config.get("ansible-vault.vault_password_file_path")
      } 
      complete = new BufferedProcess({
         command: __dirname + "/bin/vault_wrapper.py",
         args: [vault_filepath, password, action, atom.config.get('ansible-vault.path'), password_file],
         options: {
           stdio: 'pipe'
         },
         stdout: function (x) { output.push(x);},
         stderr: function (x) { error.push(x);}
      })

      complete.process.parentView = this;
      complete.process.on('close', function () {
         this.parentView.notifyMessage(this.exitCode,output,error)
      });
      delete output;
      delete error;
      delete password;
  },

  toggle() {

    if (atom.config.get('ansible-vault.vault_password_file_flag')) {
      console.log("Using global vault password file");
      inputbox = this.ansibleVaultView.getElement().children[1];
      inputbox.value=""
      this.execWrapper(inputbox);

    } else {

      if (this.modalPanel.isVisible()) {
        this.modalPanel.hide()
      } else {
        inputbox = this.ansibleVaultView.getElement().children[1];
        inputbox.parentView = this;

        if ( this.getFilename(this.checkActiveEditor()) == null ) {
          this.notifyMessage(2,"","ERROR: File not selected!");
          this.reset(this.ansibleVaultView);
          return
        }

        try {
          var child = require('child_process');
          child.execSync('ansible-vault view --version');
        } catch(e) {
          this.notifyMessage(3,"","ERROR: ansible-vault not found!")
          this.reset(this.ansibleVaultView);
          return
        }

        inputbox.addEventListener('keyup', function(event) {
            if (event.keyCode == 13) {
              if (prevKey !== 13) {
                this.parentView.execWrapper(this);
              }
            } else if (event.keyCode == 27) {
              this.parentView.reset(this);
            }
            prevKey = event.keyCode
        });
        this.modalPanel.show();
        document.getElementById('passbox').focus();
      }
    }
  }
};
