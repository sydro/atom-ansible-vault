'use babel';

export default class AnsibleVaultUtils {

  promise_add_editor = null;

  DisableAuto() {
    //console.log("Automatic de- and encrypt disabled!");
    if (promise_add_editor != null ) promise_add_editor.dispose();
  }

  EnableAuto() {
    if (atom.config.get("ansible-vault.vault_automatic_de_and_encrypt")) {
      //console.log("Automatic de- and encrypt enabled!");
      // catch open texteditor event
      promise_add_editor = atom.workspace.onDidAddTextEditor(function(event){
        if (typeof atom.workspace.getActiveTextEditor() === 'undefined') {
           atom.workspace.activateNextPane();
           //console.log("undefined");
        }
        if (event.textEditor.getText().substring(0,14) == "$ANSIBLE_VAULT") {
            //console.log("Decryption", event.textEditor.getPath());
            let promise_editor = event.textEditor.onDidStopChanging(function() {
              let editor = event.textEditor;
              atom.workspace.open(editor.getPath());
              atom.commands.dispatch(atom.views.getView(atom.workspace), 'ansible-vault:toggle');
              let actived_editor_pane = atom.workspace.getActivePane();
              let promise_close_editor = actived_editor_pane.onWillRemoveItem(function(event) {
                  //console.log("Event Item " + event.item.id + " " + editor.id);
                  if (event.item.id == editor.id) {
                      if (editor.getText().substring(0,14) != "$ANSIBLE_VAULT") {
                        atom.commands.dispatch(atom.views.getView(atom.workspace), 'ansible-vault:toggle');
                        //console.log("Re-encryption");
                      }
                      promise_close_editor.dispose();
                  }
              });
              promise_editor.dispose();
            });
        } else { return; }

      });
    }
  }
}
