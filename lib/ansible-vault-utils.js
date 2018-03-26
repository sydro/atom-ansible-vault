'use babel';
import { BufferedProcess } from 'atom';
import configSchema from "./config-schema";
import AnsibleVaultView from './ansible-vault-view';
import { CompositeDisposable } from 'atom';
import { File } from 'atom';
import fs from 'fs';
import path from 'path';
import ini from 'ini';


export default class AnsibleVaultUtils {

  promise_add_editor = null;
  ansibleVaultView = null;
  modalPanel = null;

  dialogView() {
      this.ansibleVaultView = new AnsibleVaultView();
      this.modalPanel = atom.workspace.addModalPanel({
        item: this.ansibleVaultView.getElement(),
        visible: false
      });
      return this.ansibleVaultView;
  }

  inputboxHandler(inputbox, master, vault_filepath, action, editor, promise_created) {
      master.modalPanel.show();
      let prevKey = null;

      function keypress(event) {
        if (event.keyCode == 13) {
          if (prevKey !== 13) {
            if ( master instanceof AnsibleVaultUtils ) {
              master.ExecAction(vault_filepath, action, inputbox.value);
              if ( action == "decrypt" ) {
                editor.password = inputbox.value;
                inputbox.value="";
              }
            } else {
              master.execWrapper(this);
            }
            inputbox.removeEventListener('keyup', keypress);
            master.modalPanel.hide();
          }
        } else if (event.keyCode == 27) {
          master.modalPanel.hide();
          inputbox.removeEventListener('keyup', keypress);
          if ( promise_created ) {
            promise_created.dispose();
          }
        }
        prevKey = event.keyCode
     }

     inputbox.addEventListener('keyup', keypress);
     document.getElementById('passbox').focus();
  }

  notifyMessage(exitCode, output, error) {
      if (exitCode != 0) {
        atom.notifications.addError(error.toString(), { dismissable: true });
      } else {
        atom.notifications.addSuccess(output.toString(), { dismissable: false });
      }
  }

  findConfig(vault_filepath) {
      const listFiles = require('fs-plus').listSync;
      let dirname_vaultfile = path.dirname(vault_filepath);
      let ansible_cfg_file = [];
      let project_path = atom.project.relativizePath(vault_filepath)[0];

      do {
          console.log(dirname_vaultfile);
          ansible_cfg_file = listFiles(dirname_vaultfile, ['cfg']).map(function(el) { if (el.includes('ansible.cfg')) return el ; } );
          dirname_vaultfile = path.dirname(dirname_vaultfile);
          if (typeof ansible_cfg_file[0] == "undefined") ansible_cfg_file = [];
      } while ( ansible_cfg_file.length <= 0 && dirname_vaultfile.includes(project_path));

      return ansible_cfg_file;
  }

  VaultFile(vault_filepath, action, password_file, unlinkF) {
      let father = this;
      cmd = [atom.config.get('ansible-vault.path'), action];

      if (atom.config.get("ansible-vault.vault_password_file_flag")) {
        let ansible_cfg = father.findConfig(vault_filepath);
        if (ansible_cfg_file.length <= 0) {
          father.notifyMessage(2,"", "No <b>ansible.cfg</b> file found.<br>Disable flag in preferencies or add ansible.cfg file");
          return;
        } else {
          execution_path = path.dirname(ansible_cfg[0]);
        }
      } else {
        cmd.push("--vault-password-file=" + password_file);
        execution_path = '';
      }

      cmd.push(vault_filepath);

      const execChild = require('child_process').exec;
      execChild(cmd.join(' '), { cwd: execution_path } ,(error, stdout, stderr) => {
          if (error) {
              exitCode = 1;
              output = stderr;
          } else {
              exitCode = 0;
              output = vault_filepath + ": OK"
          }
          father.notifyMessage(exitCode,output,stderr);
          if (unlinkF) fs.unlink(password_file,() => {});
      });
  }

  ExecAction(vault_filepath, action, password) {
      let output = [];
      let error = [];
      let password_file = "";
      let father = this;
      let complete = null;
      let unlinkF = false;

      if (atom.config.get("ansible-vault.vault_password_file_forcing")) {
            password_file = atom.config.get("ansible-vault.vault_password_file_path");
      } else {
            if (atom.config.get("ansible-vault.vault_password_file_flag")) {
                ansible_cfg_file = father.findConfig(vault_filepath);
                if (ansible_cfg_file.length <= 0) {
                    password_file = atom.config.get("ansible-vault.vault_password_file_path");
                } else {
                    let ansible_cfg = ini.parse(fs.readFileSync(ansible_cfg_file[0],'utf-8'));
                    if(ansible_cfg.defaults.vault_password_file) {
                        password_file = ansible_cfg.defaults.vault_password_file;
                    } else {
                        password_file = atom.config.get("ansible-vault.vault_password_file_path");
                    }
                }
          }
      }

      if (password_file == "") {
          filename = __dirname + "/" + Math.random().toString(36).substring(2) + ".vault";
          filePT = new File(filename, false);
          filePT.create().then(function() {
              filePT.writeSync(password);
              password_file = filename;
              unlinkF = true;
              father.VaultFile(vault_filepath, action, password_file, unlinkF);
          });
      } else {
          father.VaultFile(vault_filepath, action, password_file, unlinkF);
      }
  }

  DisableAuto() {
    try {
      this.promise_add_editor.dispose();
      this.promise_add_editor = null;
    } catch(err) {
      ;
    }
  }

  EnableAuto() {

    let father = this;
    if (atom.config.get("ansible-vault.vault_automatic_de_and_encrypt")) {
      // catch open texteditor event
      this.promise_add_editor = atom.workspace.onDidAddTextEditor(function(event){
        if (!atom.config.get("ansible-vault.vault_automatic_de_and_encrypt")) {
          father.promise_add_editor = null;
          return;
        }

        if (typeof atom.workspace.getActiveTextEditor() === 'undefined') {
           atom.workspace.activateNextPane();
        }
        if (event.textEditor.getText().substring(0,14) == "$ANSIBLE_VAULT") {
            let promise_editor = event.textEditor.onDidChange(function() {
              let editor = event.textEditor;
              let actived_editor_pane = event.pane;
              let inputbox = father.ansibleVaultView.getElement().children[1];
              let promise_close_editor = actived_editor_pane.onWillRemoveItem(function(event) {
                  if (event.item.id == editor.id) {
                      if (editor.getText().substring(0,14) != "$ANSIBLE_VAULT") {
                        let vault_filepath = editor.getPath();
                        if (atom.config.get("ansible-vault.vault_password_file_flag")) {
                          father.ExecAction(vault_filepath, "encrypt", "");
                        } else {
                          father.ExecAction(vault_filepath, "encrypt", event.item.password);
                        }
                      }
                      promise_close_editor.dispose();
                  }
              });
              if (atom.config.get("ansible-vault.vault_password_file_flag") || atom.config.get("ansible-vault.vault_password_file_forcing")) {
                father.ExecAction(editor.getPath(), "decrypt", "");
              } else {
                father.inputboxHandler(inputbox, father, editor.getPath(), "decrypt", editor, promise_close_editor);
              }
              promise_editor.dispose();
            });
        } else { return; }
      });
    }
  }
}
