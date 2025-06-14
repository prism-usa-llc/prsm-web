from fastapi import FastAPI, Query, Cookie, Response, Request, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi_versioning import VersionedFastAPI, version
from pydantic import BaseModel, Field
import asyncio
from fastapi.staticfiles import StaticFiles
from session import session_layer
import hashlib
import sqlite3
import redis
import json


app = FastAPI(
    debug=True,
    description="prsmusa.com backend",
    #contact="raymondmintz11@gmail.com"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://prsmusa.com", "http://localhost:3000", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

class ContactForm(BaseModel):
    name: str
    email: str
    phone: str = ""
    service: str
    message: str

#TODO finish this.. 
@app.post("/scout")
def create_url_test(url: URL_Test):
    return url

@app.post("/contact")
async def contact_form(contact: ContactForm):
    """
    Handle contact form submissions from the frontend
    """
    try:
        # Log the contact form submission
        print(f"Contact form submission: {contact.name} - {contact.email} - {contact.service}")
        
        # Here you could:
        # 1. Save to database
        # 2. Send email notification
        # 3. Send SMS notification
        # 4. Add to CRM system
        
        # For now, just return success response
        return {
            "status": "success",
            "message": "Thank you for your message! We'll get back to you soon.",
            "data": {
                "name": contact.name,
                "service": contact.service
            }
        }
        
    except Exception as e:
        print(f"Error processing contact form: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Sorry, there was an error processing your request. Please try again."
        )

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
    phone: str

# Temporary in-memory storage for users
users_db = []

@app.post("/signup")
def signup(user: User, request: Request):
    '''
    takes information from user, stores user temp until user is verified
    '''
    '''
    for reference
    sqlite> .schema
    CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        business_name TEXT,
        fname TEXT,
        lname TEXT,
        email TEXT,
        phone TEXT
    );
    '''
    # connect to sqlite3 
    # TODO check for sqlite3 on startup 
    # check if the phonenumber already exists
    conn = sqlite3.connect('./sqlite3/customers.db')
    cursor = conn.cursor()
    cursor.execute("select exists(select phone from users where phone=? limit 1)" , (user.phone,))
    exists = cursor.fetchone()[0]
    if exists:
        raise HTTPException(status_code=400, detail="phone number already exists")        

    
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
    
    r = redis.Redis(host='localhost', port=6379, db=0)
    redis_key = f'{user.phone}::{cookie_value}'
    print("redis-cli set {redis-key}")
    import random
    random_number = random.randint(100000, 999999)
    r.set(redis_key, random_number)
    # set the TTL to 10 minutes
    r.expire(redis_key, 3000)
    res = r.ttl(redis_key)
    print(f'redis key is set to {res}')

    response.headers['content-type'] = "application/json"
    response._content = b'{"key": "value"}'
    response.text = f"a 6 digit auth has been sent to {user.phone}"

    # send out the alert
    # def send_alerts(self, alert_message: str):
    #     TOKEN=os.environ['CLICKSEND_TOKEN']
    #     cell_phone = "+1" + self.cell_phone
    #     URL='https://rest.clicksend.com/v3/sms/send'
    #     HEADERS={
    #         "Authorization": f"Basic {TOKEN}",
    #         "Content-Type": "Application/json"
    #     }

    #     print("this is headers: ", HEADERS)
    #     payload={
    #         "messages": [
    #             {
    #                 "source": "php",
    #                 "body": f"{alert_message}",
    #                 "to": cell_phone,
    #             }
    #         ]
    #     }

    #     req_handler = requests.post(URL, json=payload, headers=HEADERS)
    #     print(req_handler.text)
    
    return response

