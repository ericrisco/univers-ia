from fastapi import APIRouter

ping_router = APIRouter()

@ping_router.get("/ping")
async def ping():
    return "Ok"
