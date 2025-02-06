from fastapi import FastAPI, Query, Cookie, Response, Request, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi_versioning import VersionedFastAPI, version
from pydantic import BaseModel, Field
import asyncio
from fastapi.staticfiles import StaticFiles
from session import session_layer
import hashlib

app = FastAPI(
    debug=True,
    description="prsmusa.com backend",
    #contact="raymondmintz11@gmail.com"
)

# Serve static files from the 'static' directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Define a route for the favicon
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("static/favicon.ico")
                        

class URL_Test(BaseModel):
    endpoint: str
    threshold: int = Field(min=1, max=10)
    email: str #= Field(regex= r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
    phone_number: str

#TODO finish this.. 
@app.post("/scout")
def create_url_test(url: URL_Test):
    return url


@app.get("/")
def root():
    return {"message": "this is root"}


@app.get("/utils/delay")
async def delayed_response(seconds: str = Query(...),
                           description="use 10 seconds or less"):
    '''
    Waits $seconds to respond
    '''
    try:
        seconds = int(seconds)
    except Exception as e:
        return {"error": e}
    if seconds > 10:
        return {"message": "seconds cant be > 10 seconds"}
    
    await asyncio.sleep(seconds)
    return {"message": f"waited {seconds} seconds"}

@app.get("/get_session")
@version(0,1)
async def get_session(response: Response):
    # make and set cookie
    from datetime import datetime, timedelta
    expiry = datetime.now() + timedelta(days=1)
    cookie_value = session_layer.get_random_session_string()
    response = JSONResponse(content={"this": "thatfakecontent"})
    response.set_cookie(
        key="prsm_session", 
        value=cookie_value,
        #expires=expiry,
        httponly=True,
        secure=True,
        )
    return response

    # return session_layer.get_user_session()

@app.get("/see_cookie")
@version(0,1)
async def see_cookie(request: Request):
    '''
    Just print out the users cookie, for testing purposes
    '''
    return request.cookies.get('prsm_session')
    
# app = VersionedFastAPI(app)

#TODO make these fields checked with pydantic stuff regex
class User(BaseModel):
    username: str
    email: str
    password: str

# Temporary in-memory storage for users
users_db = []

@app.post("/signup")
def signup(user: User):
    '''
    curl -X 'POST'   'http://localhost:8000/signup'   -H 'accept: application/json'   -H 'Content-Type: application/json'   -d '{
  "username": "raymondmintz",
  "email": "raymondmintz11@gmail.com",
  "password": "mycoolpassword"
}'
    '''
    # Check if user already exists
    if any(u['username'] == user.username or u['email'] == user.email for u in users_db):
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Hash the password (simple hashing for demo purposes)
    hashed_password = hashlib.sha256(user.password.encode('utf-8')).hexdigest()

    # Store user with hashed password
    users_db.append({
        'username': user.username,
        'email': user.email,
        'password': hashed_password
    })

    return {"message": "User created successfully"}
