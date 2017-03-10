'use babel';
import { BufferedProcess } from 'atom';
import configSchema from "./config-schema";
import AnsibleVaultView from './ansible-vault-view';
import { CompositeDisposable } from 'atom';

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

  ExecAction(vault_filepath, action, password) {
      let output = [];
      let error = [];
      let password_file = "";
      let father = this;
      let complete = null;

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

      complete.process.on('close', function () {
         father.notifyMessage(this.exitCode,output,error)
      });
  }

  DisableAuto() {
    try {
      promise_add_editor.dispose();
    } catch(err) {
      ;
    }
  }

  EnableAuto() {

    let father = this;
    if (atom.config.get("ansible-vault.vault_automatic_de_and_encrypt")) {
      // catch open texteditor event
      this.promise_add_editor = atom.workspace.onDidAddTextEditor(function(event){
        if (typeof atom.workspace.getActiveTextEditor() === 'undefined') {
           atom.workspace.activateNextPane();
        }
        if (event.textEditor.getText().substring(0,14) == "$ANSIBLE_VAULT") {
            let promise_editor = event.textEditor.onDidStopChanging(function() {
              let editor = event.textEditor;
              atom.workspace.open(editor.getPath());
              //atom.commands.dispatch(atom.views.getView(atom.workspace), 'ansible-vault:toggle');
              let actived_editor_pane = atom.workspace.getActivePane();
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
              if (atom.config.get("ansible-vault.vault_password_file_flag")) {
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
