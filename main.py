import logging
import uvicorn
import os
from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from helpers.logger import setup_logger
from routers.ping import ping_router
from dotenv import load_dotenv

load_dotenv()
PORT = os.getenv("PORT")

app = FastAPI()

logger = setup_logger()

router = APIRouter(prefix="/api/v1")

router.include_router(ping_router)

app.include_router(router)

if __name__ == "__main__":
    try:        
        PORT = int(os.getenv('PORT', '5000'))
        uvicorn.run(app, host="0.0.0.0", port=PORT)
    except Exception as error:
        logging.error(f"Error: {error}")
        raise error