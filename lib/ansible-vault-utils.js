'use babel';

export default class AnsibleVaultUtils {

  promise_add_editor = null;
  vaulted_files = [];

  DisableAuto() {
    console.log("Automatic de- and encrypt disabled!");
    if (promise_add_editor != null ) promise_add_editor.dispose();
  }

  EnableAuto() {
    if (atom.config.get("ansible-vault.vault_automatic_de_and_encrypt")) {
    //insert handler on open and close file
      console.log("Automatic de- and encrypt enabled!");
      var self = this;
      promise_add_editor = atom.workspace.onDidAddTextEditor(function(event){
        if (typeof atom.workspace.getActiveTextEditor() === 'undefined') {
           atom.workspace.activateNextPane();
           console.log("undefined");
        }
        editor = event.textEditor;
        if (editor.getText().substring(0,14) == "$ANSIBLE_VAULT") {
            console.log("Decryption", editor.getPath());
            promise_editor = editor.onDidStopChanging(function() {
              atom.workspace.open(editor.getPath());
              atom.commands.dispatch(atom.views.getView(atom.workspace), 'ansible-vault:toggle');
              self.vaulted_files.push(editor.getPath());
              promise_editor.dispose();
            });
        } else { return; }
      })
    }
  }
}
