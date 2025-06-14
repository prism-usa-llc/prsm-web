setup() {
    # Code to start the FastAPI application
}

teardown() {
    # Code to stop the FastAPI application
}

@test "FastAPI application starts successfully" {
    run setup
    [ "$status" -eq 0 ]
}

@test "FastAPI application responds to health check" {
    run curl -s http://localhost:8000/health
    [ "$status" -eq 0 ]
    [ "$output" = "Healthy" ]
}

teardown() {
    # Code to stop the FastAPI application
}