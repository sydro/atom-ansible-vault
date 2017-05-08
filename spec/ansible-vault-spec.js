'use babel';

describe('Atom Ansible Vault', () => {

  let AnsibleVault
  let workspaceElement

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace)
    jasmine.attachToDOM(workspaceElement)

    waitsForPromise(() => atom.packages.activatePackage('ansible-vault').then((clk) => {
      AnsibleVault = clk.mainModule
    }))

    waitsForPromise(() => atom.workspace.open('test1.txt').then((editor) => {
      editor.insertText('Hello World')
      editor.save()
    }))
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

  it('shoud hide the inputbox when Esc is pressed', () => {
    key = atom.keymaps.constructor.buildKeydownEvent('escape', {target: document.activeElement});
    atom.keymaps.handleKeyboardEvent(key);
    AnsibleVault.ansibleVaultView.inputbox.focus()
    expect(AnsibleVault.ansibleVaultView.element.style.display).toBe('none')
  })

  // it('should refresh the ticker when the date format is changed', () => {
  //   spyOn(AtomClock.atomClockView, 'refreshTicker')
  //
  //   atom.config.set('atom-clock.dateFormat', 'H')
  //   expect(AtomClock.atomClockView.refreshTicker).toHaveBeenCalled()
  // })
  //
  // it('should refresh the ticker when the tooltip date format is changed', () => {
  //   spyOn(AtomClock.atomClockView, 'refreshTicker')
  //
  //   atom.config.set('atom-clock.tooltipDateFormat', 'H')
  //   expect(AtomClock.atomClockView.refreshTicker).toHaveBeenCalled()
  // })
  //
  // it('should refresh the ticker when the UTC display setting is changed', () => {
  //   spyOn(AtomClock.atomClockView, 'refreshTicker')
  //
  //   atom.config.set('atom-clock.showUTC', true)
  //   expect(AtomClock.atomClockView.refreshTicker).toHaveBeenCalled()
  // })
  //
  // it('should refresh the ticker when the interval is changed', () => {
  //   spyOn(AtomClock.atomClockView, 'refreshTicker')
  //
  //   atom.config.set('atom-clock.refreshInterval', '20')
  //   expect(AtomClock.atomClockView.refreshTicker).toHaveBeenCalled()
  // })
  //
  // it('should set the configuration values when the tooltip is enabled', () => {
  //   spyOn(AtomClock.atomClockView, 'setConfigValues')
  //
  //   atom.config.set('atom-clock.showTooltip', true)
  //   expect(AtomClock.atomClockView.setConfigValues).toHaveBeenCalled()
  // })
  //
  // it('should set the configuration values when clock icon is requested', () => {
  //   spyOn(AtomClock.atomClockView, 'setConfigValues')
  //
  //   atom.config.set('atom-clock.showClockIcon', true)
  //   expect(AtomClock.atomClockView.setConfigValues).toHaveBeenCalled()
  // })
  //
  // it('should clear the ticker and restart it when refresh is called', () => {
  //   spyOn(AtomClock.atomClockView, 'clearTicker')
  //   spyOn(AtomClock.atomClockView, 'startTicker')
  //
  //   atom.config.set('atom-clock.refreshInterval', '20')
  //   expect(AtomClock.atomClockView.clearTicker).toHaveBeenCalled()
  //   expect(AtomClock.atomClockView.startTicker).toHaveBeenCalled()
  // })
  //
  // it('should hide the clock when toggled', () => {
  //   atom.commands.dispatch(document.querySelector('atom-workspace'), 'atom-clock:toggle')
  //   expect(AtomClock.atomClockView.element.style.display).toBe('none')
  //
  //   atom.commands.dispatch(document.querySelector('atom-workspace'), 'atom-clock:toggle')
  //   expect(AtomClock.atomClockView.element.style.display).toBe('')
  // })
  //
  // it('should toggle UTC mode when toggled', () => {
  //   atom.commands.dispatch(document.querySelector('atom-workspace'), 'atom-clock:utc-mode')
  //   expect(AtomClock.atomClockView.showUTC).toBe(true)
  //
  //   atom.commands.dispatch(document.querySelector('atom-workspace'), 'atom-clock:utc-mode')
  //   expect(AtomClock.atomClockView.showUTC).toBe(false)
  // })
})
