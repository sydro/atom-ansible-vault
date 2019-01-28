# Windows Support - Proof of concept: Ubuntu subsystem

The following is a set of guidelines for use ansible-vault package on Windows systems.
This is only proof of concept and the author is not responsible for any malfunction.

**ATTENTION**:
- the author does not intend to support windows systems, so do not ask why something does not work.
- probably this branch will not be merged in master, so if you want test it you need checkout in
  the branch **windows-support** or apply **windows-support.patch** present in assets.


## Dependencies

* Atom IDE (>= 1.20)

* Windows 10 Insider version and Ubuntu subsystem installed

  Reference: https://msdn.microsoft.com/en-us/commandline/wsl/install_guide?f=255&MSPPError=-2147217396

* Ansible (in specific ansible-vault) installed in Ubuntu subsystem

  Tested example:

  ```
  apt-get update && apt-get install python-pip

  pip install pycrypto ansible

  ```

## Ansible-vault configuration

First off, the proof of concept assumes that in user homedir (%HOMEPATH%) there are:

1. **.atom** configuration directory

2. **project directory**

3. **ansible-vault.bat** that it is in ansible-vault package directory in **assets**

In user directory C:\Users\sydro i must have got those files:

```
.......... <DIR>      .atom
..........            ansible-vault.bat
...........................
.......... <DIR>      test-project-dir
```


### Steps

1. Configure "Ansible Vault absolute path" with this value **%HOMEPATH%\ansible-vault.bat**

2. Copy file [ansible-vault.bat](https://raw.githubusercontent.com/sydro/atom-ansible-vault/windows-support/assets/ansible-vault.bat)
   in user homedirectory

3. Test :D


### Notes

* This configuration was tested in a virtual machine (vbox) Windows 10 Home version 1709 and build 16229.15

* ansible-vault.bat made some string substitutions and settings on ubuntu subsystem

* de/encryption on ubuntu subsystem will be slowly

* sometimes error message will not be displayed
