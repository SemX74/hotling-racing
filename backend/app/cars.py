from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas
from .database import get_db
from .auth import get_current_active_user

router = APIRouter()

# Add car details
@router.post("/users/me/cars", response_model=schemas.CarResponse)
def add_car(car: schemas.CarCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    new_car = models.Car(
        make=car.make,
        model=car.model,
        year=car.year,
        owner_id=current_user.id
    )
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    return new_car

# Get user's cars
@router.get("/users/me/cars", response_model=List[schemas.CarResponse])
def get_user_cars(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    cars = db.query(models.Car).filter(models.Car.owner_id == current_user.id).all()
    return cars

# Update car details
@router.put("/users/me/cars/{car_id}", response_model=schemas.CarResponse)
def update_car(car_id: int, car_update: schemas.CarCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    car = db.query(models.Car).filter(models.Car.id == car_id, models.Car.owner_id == current_user.id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    car.make = car_update.make
    car.model = car_update.model
    car.year = car_update.year
    db.commit()
    db.refresh(car)
    return car

# Delete car
@router.delete("/users/me/cars/{car_id}")
def delete_car(car_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    car = db.query(models.Car).filter(models.Car.id == car_id, models.Car.owner_id == current_user.id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    db.delete(car)
    db.commit()
    return {"detail": "Car deleted"}
