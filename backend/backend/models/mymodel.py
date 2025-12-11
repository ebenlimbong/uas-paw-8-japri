from sqlalchemy import (
    Column,
    Integer,
    Text,
    String,
    Date,
    ForeignKey
)
from sqlalchemy.orm import relationship

from .meta import Base


# ===========================
# USERS TABLE
# ===========================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    password = Column(String(200))
    role = Column(String(20))  # seeker / employer

    seeker_profile = relationship("JobSeeker", back_populates="user")
    jobs = relationship("Job", back_populates="employer")


# ===========================
# JOB SEEKER PROFILE
# ===========================
class JobSeeker(Base):
    __tablename__ = "job_seekers"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skills = Column(Text)
    experience = Column(Text)
    cv_url = Column(Text)

    user = relationship("User", back_populates="seeker_profile")
    applications = relationship("Application", back_populates="seeker")


# ===========================
# JOB POSTS (Employer)
# ===========================
class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True)
    employer_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(200))
    description = Column(Text)
    requirements = Column(Text)
    salary = Column(Integer)
    location = Column(String(100))
    type = Column(String(50))

    employer = relationship("User", back_populates="jobs")
    applications = relationship("Application", back_populates="job")


# ===========================
# JOB APPLICATIONS
# ===========================
class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    seeker_id = Column(Integer, ForeignKey("job_seekers.id"))
    status = Column(String(50))  # pending / shortlisted / rejected
    applied_date = Column(Date)

    job = relationship("Job", back_populates="applications")
    seeker = relationship("JobSeeker", back_populates="applications")
