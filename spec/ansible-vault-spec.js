'use babel';
import fs from 'fs';

describe('Atom Ansible Vault', () => {

  let AnsibleVault
  let workspaceElement
  let test_file='/tmp/test1.txt'
  let password_file='/tmp/pass_file.txt'

  beforeEach(() => {

    fs.unlink(test_file,() => {});
    fs.unlink(password_file,() => {});
    fs.writeFile(password_file,'test123',() => {})
    atom.workspace.open(test_file).then((editor) => {
      editor.insertText('Hello World')
      editor.save()
    })

    workspaceElement = atom.views.getView(atom.workspace)
    jasmine.attachToDOM(workspaceElement)

    waitsForPromise(() => atom.packages.activatePackage('ansible-vault').then((clk) => {
      AnsibleVault = clk.mainModule
    }))

  })

  afterEach(() => {
    fs.unlink(test_file,() => {});
    fs.unlink(password_file,() => {});
  })

  it('should properly load the package', () => {
    expect(AnsibleVault.ansibleVaultView.element).toBeDefined()
    expect(obj_utils).toBeDefined()
  })

  it('should be defined all package property', () => {
    expect(AnsibleVault.config.path).toBeDefined()
    expect(AnsibleVault.config.vault_password_file_flag.default).toBe(false)
    expect(AnsibleVault.config.vault_password_file_forcing.default).toBe(false)
    expect(AnsibleVault.config.vault_password_file_path.default).toBe('/tmp/pass.txt')
    expect(AnsibleVault.config.vault_automatic_de_and_encrypt.default).toBe(false)
    expect(AnsibleVault.toggle).toBeDefined()
  })

  it('should visible the inputbox when toggled', () => {
    atom.commands.dispatch(document.querySelector('atom-workspace'), 'ansible-vault:toggle')
    expect(AnsibleVault.ansibleVaultView.element.style.display).toBe('')
  })

})
