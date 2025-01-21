from fastapi import FastAPI
from pydantic import BaseModel, Field
import asyncio


app = FastAPI()

class URL_Test(BaseModel):
    endpoint: str
    threshold: int = Field(min=1, max=10)
    email: str = Field(regex= r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
    phone_number: str

@app.post("/scout")
def create_url_test(url: URL_Test):
    return url


@app.get("/")
def root():
    return {"message": "this is root"}


@app.get("/utils/delay/{seconds}")
async def delayed_response(seconds):
    print("this is seconds: ", seconds)
    try:
        seconds = int(seconds)
    except Exception as e:
        return {"error": e}
    if seconds > 10:
        return {"message": "seconds cant be > 10 seconds"}
    
    await asyncio.sleep(seconds)
    return {"message": f"waited {seconds} seconds"}

