#!/bin/bash

# check for path to decrypt
if [ -z "$1" ]
then
    echo "Need path to file to decrypt."
    exit 1
fi

# check the file to decrypt exists
if [ ! -f "$1" ]
then
    echo "PATH: \"$1\" path does not exist"
    exit 1
fi

# decrypt the file
/usr/bin/openssl aes-256-cbc -d -a -salt -pbkdf2 -in "$1" -out "$1.new"


# remove postfix junk
newName=$(echo "$1.new" | sed 's/.enc.new//g')
cp "$1.new" "$newName"

# sanity check
ls -la "$1"
ls -la "$newName"
md5sum "$1"
md5sum "$newName"



