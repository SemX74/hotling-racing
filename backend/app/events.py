from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from . import models, schemas
from .database import get_db
from .auth import get_current_active_user, get_admin_user

router = APIRouter()
router = APIRouter()

# Create an event (Admin only)
@router.post("/events", response_model=schemas.EventResponse)
def create_event(
    event: schemas.EventCreate,
    db: Session = Depends(get_db),
    _admin_user: models.User = Depends(get_admin_user)
):
    new_event = models.Event(
        event_name=event.event_name,
        event_date=event.event_date,
        event_location=event.event_location,
        event_description=event.event_description,
        max_participants=event.max_participants,
        event_status=True
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@router.get("/events", response_model=List[schemas.EventResponse])
def get_events(db: Session = Depends(get_db)):
    events = db.query(models.Event).options(
        joinedload(models.Event.participants),
        joinedload(models.Event.winner)
    ).all()
    return events

@router.get("/events/{event_id}", response_model=schemas.EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).options(
        joinedload(models.Event.participants),
        joinedload(models.Event.winner)
    ).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

# Update an event (Admin only)
@router.put("/events/{event_id}", response_model=schemas.EventResponse)
def update_event(
    event_id: int,
    event_update: schemas.EventUpdate,
    db: Session = Depends(get_db),
    _admin_user: models.User = Depends(get_admin_user)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    for var, value in vars(event_update).items():
        if value is not None:
            setattr(event, var, value)
    db.commit()
    db.refresh(event)
    return event

# Delete an event (Admin only)
@router.delete("/events/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    _admin_user: models.User = Depends(get_admin_user)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return {"detail": "Event deleted"}

# Register for an event (User)
@router.post("/events/{event_id}/register")
def register_for_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if not event.event_status:
        raise HTTPException(status_code=400, detail="Event is not active")
    # Check if user is already registered
    if current_user in event.participants:
        raise HTTPException(status_code=400, detail="User already registered for this event")
    # Check if event is full
    if len(event.participants) >= event.max_participants:
        raise HTTPException(status_code=400, detail="Event is full")
    # Register user
    event.participants.append(current_user)
    db.commit()
    return {"detail": "Registered successfully"}


# Get user's registered events
@router.get("/users/me/events", response_model=List[schemas.EventResponse])
def get_user_events(current_user: models.User = Depends(get_current_active_user)):
    return current_user.events_participated

@router.post("/events/{event_id}/set_winner/{user_id}")
def set_event_winner(
    event_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_admin_user)
):
    # Fetch the event
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Fetch the user
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if the user is a participant in the event
    if user not in event.participants:
        raise HTTPException(status_code=400, detail="User is not registered for this event")

    # Set the winner
    event.winner_id = user_id
    db.commit()
    db.refresh(event)

    # Increase the winner's rating
    user.rating += 1
    db.commit()
    db.refresh(user)

    return {"detail": "Winner set successfully"}

# Get leaderboard
@router.get("/leaderboard", response_model=List[schemas.UserPublic])
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(models.User).order_by(models.User.rating.desc()).all()
    return users
