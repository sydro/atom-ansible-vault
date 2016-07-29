#!/usr/bin/python
from ansible.parsing.vault import VaultEditor
from ansible.parsing.vault import VaultFile
from sys import argv
import sys
import os

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
