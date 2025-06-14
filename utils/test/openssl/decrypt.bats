@test "Decryption Test 1" {
    result="$(decrypt_function 'encrypted_data_1')"
    [ "$result" = "expected_decrypted_data_1" ]
}

@test "Decryption Test 2" {
    result="$(decrypt_function 'encrypted_data_2')"
    [ "$result" = "expected_decrypted_data_2" ]
}

@test "Decryption Test 3" {
    result="$(decrypt_function 'invalid_encrypted_data')"
    [ "$result" = "error_message" ]
}