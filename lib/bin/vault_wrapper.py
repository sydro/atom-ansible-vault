#!/usr/bin/env python2
from sys import argv
import sys
import os
import subprocess

## argv
### 1. vault_filepath
### 2. password
### 3. action
### 4. ansible-vault command path
### 5. vault password file

def library_mode():
    from ansible.parsing.vault import VaultEditor
    from ansible.parsing.vault import VaultFile

    vaultObject = VaultEditor(argv[2])

    try:
        if argv[3] == "encrypt":
            vaultObject.encrypt_file(argv[1], argv[1] + ".tmp")
        elif argv[3] == "decrypt":
            vaultObject.decrypt_file(argv[1], argv[1] + ".tmp")
        else:
            print "Nothing to do"
            exit(0)
        os.rename(argv[1], argv[1] + ".bkp")
        os.rename(argv[1] + ".tmp", argv[1])
        os.remove(argv[1] + ".bkp")
        print argv[3] + " " + argv[1] + ": OK"
    except Exception, e:
        print >> sys.stderr, "Exception: %s" % str(e)
        exit(1)

def binary_mode(vault_password_filename=""):
    filename = ""
    if vault_password_filename == "":
        import uuid
        random_name = uuid.uuid4().hex
        filename = "/tmp/" + random_name + ".vault"
        temp_file = open(filename, "w+")
        temp_file.write(argv[2])
        temp_file.close()
    else:
        filename = vault_password_filename
    cmd = [argv[4], argv[3], "--vault-password-file=" + filename, argv[1] ]
    p1 = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    errors = p1.communicate()[1]
    if errors != "":
        print >> sys.stderr, "Exception: %s" % str(errors)
        exit(1)
    try:
        if vault_password_filename == "":
            os.remove(filename)
    except OSError:
        pass
    print argv[3] + " " + argv[1] + ": OK"
    exit(0)

try:
    if argv[5] == "" and argv[2] != "":
        library_mode()
    else:
        binary_mode(argv[5])
except ImportError:
    binary_mode()
