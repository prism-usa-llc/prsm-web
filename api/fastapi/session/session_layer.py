import secrets

def get_random_session_string() -> str:
    return secrets.token_urlsafe(32)

