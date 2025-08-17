#!/bin/bash

# Test configuration
API_URL="http://localhost:81/api/contact"
REDIS_URL="redis://localhost:6379"
REDIS_LIST_KEY="contact_submissions"

# --- Helper Functions ---
function print_info() {
    echo -e "\033[34m[INFO]\033[0m $1"
}

function print_success() {
    echo -e "\033[32m[SUCCESS]\033[0m $1"
}

function print_error() {
    echo -e "\033[31m[ERROR]\033[0m $1" >&2
    exit 1
}

# --- Check for dependencies ---
if ! command -v curl &> /dev/null; then
    print_error "'curl' is not installed. Please install it to run this test."
fi
if ! command -v redis-cli &> /dev/null; then
    print_error "'redis-cli' is not installed. Please install it to run this test."
fi
if ! command -v jq &> /dev/null; then
    print_error "'jq' is not installed. Please install it to run this test."
fi

# --- Test Data ---
# Using jq to create a minified JSON payload
TEST_JSON=$(jq -n --arg name "Bash Test User" --arg email "bash-test@example.com" --arg company "Shell Scripts Inc." --arg phone "9876543210" --arg service "Custom Software Development" --arg message "This is a test from a bash script." '{name: $name, email: $email, company: $company, phone: $phone, service: $service, message: $message}')

print_info "Starting contact form integration test..."
print_info "Payload: $TEST_JSON"

# --- 1. Send POST request to the API ---
print_info "Sending POST request to $API_URL..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" --data "$TEST_JSON" "$API_URL")

if [ "$HTTP_STATUS" -ne 200 ]; then
    print_error "API request failed with HTTP status code: $HTTP_STATUS"
else
    print_success "API request successful (HTTP 200 OK)."
fi

# --- 2. Retrieve the latest entry from Redis ---
print_info "Retrieving latest entry from Redis list '$REDIS_LIST_KEY'..."
# LPOP pops the item, ensuring the test is clean for the next run
REDIS_ENTRY=$(redis-cli -u "$REDIS_URL" LPOP "$REDIS_LIST_KEY")

if [ -z "$REDIS_ENTRY" ]; then
    print_error "No entry found in Redis list '$REDIS_LIST_KEY'."
fi
print_success "Entry retrieved from Redis."

# --- 3. Compare the data ---
print_info "Verifying data..."
RETRIEVED_NAME=$(echo "$REDIS_ENTRY" | jq -r '.name')
EXPECTED_NAME=$(echo "$TEST_JSON" | jq -r '.name')

if [ "$RETRIEVED_NAME" != "$EXPECTED_NAME" ]; then
    print_error "Data mismatch! Expected name '$EXPECTED_NAME', but got '$RETRIEVED_NAME'."
    echo "Full retrieved entry: $REDIS_ENTRY"
else
    print_success "Data verification passed. Name '$RETRIEVED_NAME' matches."
fi

echo

echo -e "\033[1;32m✅ Test completed successfully!\033[0m"