# Atom ansible-vault package

[![Build Status](https://travis-ci.org/sydro/atom-ansible-vault.svg?branch=master)](https://travis-ci.org/sydro/atom-ansible-vault)
[![Installs!](https://img.shields.io/apm/dm/ansible-vault.svg?style=flat-square)](https://atom.io/packages/ansible-vault)
[![Version!](https://img.shields.io/apm/v/ansible-vault.svg?style=flat-square)](https://atom.io/packages/ansible-vault)
[![License](https://img.shields.io/apm/l/ansible-vault.svg?style=flat-square)](https://github.com/sydro/atom-ansible-vault/blob/master/LICENSE.md)


Atom Package to decrypt and encrypt ansible-vault file.

Press <kbd>ctrl-alt-0</kbd> to encrypt and decrypt file.

**NOTE**: On the first installation, package searches ansible-vault binary in **/usr/local/bin/ansible-vault**.
If it isn't in that directory, it's necessary to set absolute path in settings tab.

## Dependencies

* **ansible** (in specific **ansible-vault**)

## Available settings

![Screeshot settings](https://github.com/sydro/atom-ansible-vault/raw/master/images/screenshot-settings.png)

* **ansible-vault binary path**:
  ```
  The absolute path of ansible-vault binary.

  Default: /usr/local/bin/ansible-vault (pip installation - ubuntu)

  Es: (fedora): /usr/bin/ansible-vault
  ```

* **Enable automatic de- and encrypt**:
  ```
  This option enables automatic de/encryt on opening of vault files
  ```

* **Use vault password file defined in ansible.cfg project**:
  ```
  If there's ansible.cfg file in opened project, with this option package use it to define vault password file path.

  Es: (ansible.cfg)
  [defaults]
  vault_password_file=pass.txt

  ```  

* **Force specific vault password file:**

  ```
  This option forces the package to use a specific vault password file
  for any de/encrytion actions.

  ```

* **Vault password file path:**

  ```
  The absolute path of vault password file. It is used when previous flag is checked.
  ```

**NOTE**: to use vault password file, you must set ansible-vault binary path.


## Screenshot
![Screeshot password](https://github.com/sydro/atom-ansible-vault/raw/master/images/screenshot-password.png)

![Screeshot encryption ok](https://github.com/sydro/atom-ansible-vault/raw/master/images/screenshot-encryption.png)
