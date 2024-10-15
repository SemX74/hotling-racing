from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "User"

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    rating: int  # New field for user rating

    class Config:
        orm_mode = True

class UserPublic(BaseModel):
    id: int
    username: str
    rating: int

    class Config:
        orm_mode = True

class CarBase(BaseModel):
    make: str
    model: str
    year: int

class CarCreate(CarBase):
    pass

class CarResponse(CarBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class EventBase(BaseModel):
    event_name: str
    event_date: datetime
    event_location: str
    event_description: Optional[str] = None
    max_participants: int

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    event_name: Optional[str] = None
    event_date: Optional[datetime] = None
    event_location: Optional[str] = None
    event_description: Optional[str] = None
    max_participants: Optional[int] = None
    event_status: Optional[bool] = None

class EventResponse(EventBase):
    id: int
    event_status: bool
    participants: List[UserPublic] = []  # Now aligns with the updated model
    winner: Optional[UserPublic] = None

    class Config:
        orm_mode = True

class EventParticipantResponse(BaseModel):
    event_id: int
    user_id: int

    class Config:
        orm_mode = True

UserResponse.update_forward_refs()
