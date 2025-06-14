function setup() {
    echo "Setting up test environment..."
    # Add any necessary setup commands here
}

function teardown() {
    echo "Tearing down test environment..."
    # Add any necessary teardown commands here
}

function assert_equal() {
    if [ "$1" != "$2" ]; then
        echo "Assertion failed: expected '$2', but got '$1'"
        exit 1
    fi
}

export -f setup
export -f teardown
export -f assert_equal