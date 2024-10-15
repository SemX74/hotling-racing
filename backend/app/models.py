from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Table
from .database import Base
from sqlalchemy.orm import relationship

# Association Table for Many-to-Many Relationship
event_participants_association = Table(
    'event_participants',
    Base.metadata,
    Column('event_id', Integer, ForeignKey('events.id'), primary_key=True),
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True)
)

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="User")
    rating = Column(Integer, default=0)

    cars = relationship("Car", back_populates="owner")  # Added relationship

    events_participated = relationship(
        "Event",
        secondary=event_participants_association,
        back_populates="participants"
    )
    won_events = relationship(
        "Event",
        back_populates="winner",
        foreign_keys='Event.winner_id'
    )

class Event(Base):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True, index=True)
    event_name = Column(String, index=True)
    event_date = Column(DateTime)
    event_location = Column(String)
    event_description = Column(String)
    max_participants = Column(Integer)
    event_status = Column(Boolean, default=True)
    winner_id = Column(Integer, ForeignKey('users.id'), nullable=True)

    participants = relationship(
        "User",
        secondary=event_participants_association,
        back_populates="events_participated"
    )
    winner = relationship(
        "User",
        back_populates="won_events",
        foreign_keys=[winner_id]
    )

class Car(Base):
    __tablename__ = 'cars'

    id = Column(Integer, primary_key=True, index=True)
    make = Column(String)
    model = Column(String)
    year = Column(Integer)
    owner_id = Column(Integer, ForeignKey('users.id'))

    owner = relationship("User", back_populates="cars")
