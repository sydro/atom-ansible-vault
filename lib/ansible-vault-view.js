'use babel';

export default class AnsibleVaultView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('ansible-vault');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'Insert vault password here: (ESC to cancel)';
    message.classList.add('message');
    this.element.appendChild(message);

    this.inputbox = document.createElement('input');
    this.inputbox.setAttribute('type','password');
    this.inputbox.setAttribute('id', 'passbox')
    this.inputbox.classList.add('native-key-bindings');
    this.element.appendChild(this.inputbox);
    this.inputbox.focus();

  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }
}
