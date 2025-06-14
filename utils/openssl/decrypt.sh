#!/bin/bash

# Check if a file path is provided and if the file exists
if [ -z "$1" ] || [ ! -f "$1" ]; then
    echo "Need valid path to file to decrypt."
    exit 1
fi

# Decrypt the file using OpenSSL with AES-256-CBC, base64 decoding, salt, and PBKDF2 key derivation
# The decrypted output will be saved with the same name, minus the .enc extension
# Check if the output file already exists
if [ -f "${1%.enc}" ]; then
    read -p "Warning: ${1%.enc} already exists. Overwrite? (y/N): " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        echo "Decryption aborted."
        exit 1
    fi
fi

openssl aes-256-cbc -d -a -salt -pbkdf2 -in "$1" -out "${1%.enc}"
echo "Please ensure you provide the correct password for decryption when prompted."

openssl aes-256-cbc -d -a -salt -pbkdf2 -in "$1" -out "${1%.enc}"
if [ $? -ne 0 ]; then
    echo "Error: Decryption failed. Please check the password or file integrity."
    exit 1
fi

# Display detailed file information (permissions, size, etc.) for both the encrypted and decrypted files
ls -la "$1" "${1%.enc}"

# Show MD5 checksums for both files to verify integrity and changes
md5sum "$1" "${1%.enc}"

# Remove the original encrypted file to clean up
rm -f "$1"

# Notify the user that decryption is complete and show the new file name
echo "Decryption complete. New file: ${1%.enc}"
exit 0
