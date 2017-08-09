'use babel';

import AnsibleVaultView from './ansible-vault-view';
import { CompositeDisposable } from 'atom';
import { BufferedProcess } from 'atom';
import configSchema from "./config-schema";
import AnsibleVaultUtils from "./ansible-vault-utils";

function settingsToogle() {
    if (atom.config.get("ansible-vault.vault_automatic_de_and_encrypt")) {
      obj_utils.EnableAuto();
      //console.log("enable auto de- and encrypt");
    } else {
      obj_utils.DisableAuto();
      //console.log("disable auto de- and encrypt");
    }
}

atom.config.onDidChange('ansible-vault.vault_automatic_de_and_encrypt', settingsToogle);

obj_utils = new AnsibleVaultUtils();
settingsToogle();

export default {

  config: configSchema,
  ansibleVaultView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {

    this.ansibleVaultView = obj_utils.dialogView();
    this.modalPanel = obj_utils.modalPanel;

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'ansible-vault:toggle': () => this.toggle()
    }));

    // async check ansible-vault binary
    const execChild = require('child_process').exec;
    execChild(atom.config.get('ansible-vault.path') + ' --help', (error, stdout, stderr) => {
      if (error) {
        obj_utils.DisableAuto();
        obj_utils.notifyMessage(3,"","ERROR: ansible-vault binary not found.\n Probably need to configure the absolute path in settings.\n Check the reference: https://github.com/sydro/atom-ansible-vault.\n\n Ansible-vault package will be deactivate!\n\n" + stderr);
        this.deactivate();
        return;
      }
    });

  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.ansibleVaultView.destroy();
    obj_utils.DisableAuto();
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

  checkActiveEditor() {
    let editor = atom.workspace.getActiveTextEditor();
    if (typeof editor !== 'undefined' && editor.getPath) {
      return editor
    } else {
      throw "File not selected!";
    }
  },

  getFilename(editor){
    return filename = editor.getPath();
  },

  execWrapper(inputbox){
      let password = inputbox.value;
      this.reset(inputbox);

      let editor = this.checkActiveEditor();
      let vault_filepath = this.getFilename(editor);

      if (editor.getText().substring(0,14) == "$ANSIBLE_VAULT") {
        action = "decrypt";
      } else {
        action = "encrypt";
      }
      obj_utils.ExecAction(vault_filepath, action, password);
  },

  toggle() {

    let editor = null;
    let action = "";

    try {
        editor = this.checkActiveEditor();
    } catch (e) {
        obj_utils.notifyMessage(2,"","ERROR: " + e);
        return
    }
    let vault_filepath = this.getFilename(editor);
    if (editor.getText().substring(0,14) == "$ANSIBLE_VAULT") {
      action = "decrypt";
    } else {
      action = "encrypt";
    }

    if (atom.config.get('ansible-vault.vault_password_file_flag')) {
      obj_utils.ExecAction(vault_filepath, action, "");
    } else {

      if (this.modalPanel.isVisible()) {
        this.modalPanel.hide()
      } else {
        let inputbox = this.ansibleVaultView.getElement().children[1];
        inputbox.parentView = this;
        obj_utils.inputboxHandler(inputbox, this);
      }
    }
  }
};
