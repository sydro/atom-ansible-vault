#!/usr/bin/env python
from sys import argv
import sys
import os
import subprocess

## argv
### 1. vault_filepath
### 2. password
### 3. action
### 4. ansible-vault command path

try:
    from ansible.parsing.vault1 import VaultEditor
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
except ImportError:
    import uuid
    random_name = uuid.uuid4().hex
    filename = "/tmp/" + random_name + ".vault"
    temp_file = open(filename, "w+")
    temp_file.write(argv[2])
    temp_file.close()
    cmd = [argv[4], argv[3], "--vault-password-file=" + filename, argv[1] ]
    p1 = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if p1.communicate()[1] != "":
        print >> sys.stderr, "Exception: %s" % str(p1.communicate()[1])
        exit(1)
    try:
        os.remove(filename)
    except OSError:
        pass
    print argv[3] + " " + argv[1] + ": OK"
    exit(0)
