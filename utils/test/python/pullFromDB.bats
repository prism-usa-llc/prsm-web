@test "pullFromDB function should return data for valid query" {
    run ./path/to/your/script/pullFromDB valid_query
    [ "$status" -eq 0 ]
    [ "${lines[0]}" = "expected_data" ]
}

@test "pullFromDB function should handle empty query" {
    run ./path/to/your/script/pullFromDB ""
    [ "$status" -eq 1 ]
}

@test "pullFromDB function should return no data for invalid query" {
    run ./path/to/your/script/pullFromDB invalid_query
    [ "$status" -eq 0 ]
    [ "${lines[0]}" = "no_data" ]
}