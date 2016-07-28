'use babel';

export default class AnsibleVaultMessageView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('ansible-vault');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'Message:';
    message.classList.add('message');
    this.element.appendChild(message);

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

  setMessage(message, type) {
    this.message.textContent = message;
  }
}
