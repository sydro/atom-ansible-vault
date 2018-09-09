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
      'ansible-vault:toggle': () => this.toggleSelection()
    }));

    // async check ansible-vault binary
    const execChild = require('child_process').exec;
    execChild(atom.config.get('ansible-vault.path') + ' --help', (error, stdout, stderr) => {
      if (error) {
        obj_utils.DisableAuto();
        obj_utils.notifyMessage(3,"","ERROR: ansible-vault binary not found.\n Probably need to configure the absolute path in settings. After change the path you need to disable and enable package again!\n Check the reference: https://github.com/sydro/atom-ansible-vault.\n\n Ansible-vault package will be deactivated!\n\n" + stderr);
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
      return editor;
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

      vault_text = editor.getSelectedText();

      // If nothing selected, assume we are encrypting the whole file
      if (vault_text.length == 0) {
        editor.selectAll();
        vault_text = editor.getSelectedText();
      }

      if (vault_text.substring(0,14) == "$ANSIBLE_VAULT") {
        action = "decrypt";
      } else {
        action = "encrypt";
      }
      obj_utils.ExecAction(editor, vault_filepath, action, password);
  },

  toggleSelection() {

    if(atom.packages.isPackageActive('ansible-vault') == false ) {
      obj_utils.notifyMessage(3,"","ERROR: Ansible-vault package is deactivated!\n\n Probably need to configure the absolute path in settings. After change the path you need to disable and enable package again!\n Check the reference: https://github.com/sydro/atom-ansible-vault.\n");
      return;
    }

    let editor = null;
    let action = "";

    try {
        editor = this.checkActiveEditor();
    } catch (e) {
        obj_utils.notifyMessage(2,"","ERROR: " + e);
        return;
    }

    let vault_filepath = this.getFilename(editor);
    let selection = obj_utils.getSelection(editor);

    if (selection.substring(0,14) == "$ANSIBLE_VAULT") {
      action = "decrypt";
    } else {
      action = "encrypt";
    }

    if (atom.config.get('ansible-vault.vault_password_file_flag') || atom.config.get('ansible-vault.vault_password_file_forcing') ) {
      obj_utils.ExecAction(editor, vault_filepath, action, "");
    } else {
      if (this.modalPanel.isVisible()) {
        this.modalPanel.hide();
      } else {
        let inputbox = this.ansibleVaultView.getElement().children[1];
        inputbox.parentView = this;
        obj_utils.inputboxHandler(inputbox, this);
      }
    }
  }
};
