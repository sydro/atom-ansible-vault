module.exports =
    path:
      title: 'Ansible Vault absolute path'
      type: 'string'
      default: '/usr/local/bin/ansible-vault'
    vault_password_file_flag:
      title: 'Use vault password file defined in ansible.cfg project'
      type: 'boolean'
      default: false
    vault_password_file_forcing:
      title: 'Force specific vault password file'
      type: 'boolean'
      default: false
    vault_password_file_path:
      title: 'Vault password file path'
      type: 'string'
      default: '/tmp/pass.txt'
    vault_automatic_de_and_encrypt:
      title: 'Enable automatic de- and encrypt'
      type: 'boolean'
      default: false
