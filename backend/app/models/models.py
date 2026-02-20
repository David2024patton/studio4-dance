"""SQLAlchemy models for Studio4 database"""
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Integer, DECIMAL, Date, Time, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20))
    role = Column(String(20), nullable=False, default="parent")
    is_active = Column(Boolean, default=True)
    email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime(timezone=True))
    parent_profile = relationship("Parent", back_populates="user", uselist=False)
    instructor_profile = relationship("Instructor", back_populates="user", uselist=False)

class Parent(Base):
    __tablename__ = "parents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    emergency_contact_name = Column(String(100))
    emergency_contact_phone = Column(String(20))
    address_line1 = Column(String(255))
    address_line2 = Column(String(255))
    city = Column(String(100))
    state = Column(String(50))
    zip_code = Column(String(10))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    user = relationship("User", back_populates="parent_profile")
    students = relationship("Student", back_populates="parent", cascade="all, delete-orphan")
    account = relationship("Account", back_populates="parent", uselist=False)

class Student(Base):
    __tablename__ = "students"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("parents.id", ondelete="CASCADE"), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date)
    gender = Column(String(20))
    school_grade = Column(String(20))
    medical_notes = Column(Text)
    photo_release = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    parent = relationship("Parent", back_populates="students")
    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")

class Instructor(Base):
    __tablename__ = "instructors"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    bio = Column(Text)
    specialties = Column(ARRAY(String))
    years_experience = Column(Integer)
    certifications = Column(ARRAY(String))
    photo_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    user = relationship("User", back_populates="instructor_profile")
    classes = relationship("DanceClass", back_populates="instructor")

class DanceStyle(Base):
    __tablename__ = "dance_styles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    icon = Column(String(50))
    is_active = Column(Boolean, default=True)
    classes = relationship("DanceClass", back_populates="style")

class ClassLevel(Base):
    __tablename__ = "class_levels"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    min_age = Column(Integer)
    max_age = Column(Integer)
    sort_order = Column(Integer, default=0)
    classes = relationship("DanceClass", back_populates="level")

class DanceClass(Base):
    __tablename__ = "classes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    style_id = Column(UUID(as_uuid=True), ForeignKey("dance_styles.id"))
    level_id = Column(UUID(as_uuid=True), ForeignKey("class_levels.id"))
    instructor_id = Column(UUID(as_uuid=True), ForeignKey("instructors.id"))
    day_of_week = Column(Integer)
    start_time = Column(Time)
    end_time = Column(Time)
    studio_room = Column(String(50))
    max_capacity = Column(Integer, default=20)
    monthly_tuition = Column(DECIMAL(10, 2), default=0.00)
    is_active = Column(Boolean, default=True)
    start_date = Column(Date)
    end_date = Column(Date)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    style = relationship("DanceStyle", back_populates="classes")
    level = relationship("ClassLevel", back_populates="classes")
    instructor = relationship("Instructor", back_populates="classes")
    enrollments = relationship("Enrollment", back_populates="dance_class", cascade="all, delete-orphan")


class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    enrollment_date = Column(Date, default=datetime.utcnow().date)
    status = Column(String(20), default="active")
    drop_date = Column(Date)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    student = relationship("Student", back_populates="enrollments")
    dance_class = relationship("DanceClass", back_populates="enrollments")

class Event(Base):
    __tablename__ = "events"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    event_type = Column(String(50))
    location = Column(String(255))
    venue_address = Column(Text)
    start_date = Column(Date)
    end_date = Column(Date)
    registration_deadline = Column(Date)
    entry_fee = Column(DECIMAL(10, 2))
    notes = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    participants = relationship("EventParticipant", back_populates="event", cascade="all, delete-orphan")

class EventParticipant(Base):
    __tablename__ = "event_participants"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    registration_date = Column(Date, default=datetime.utcnow().date)
    fee_paid = Column(Boolean, default=False)
    notes = Column(Text)
    event = relationship("Event", back_populates="participants")

class Account(Base):
    __tablename__ = "accounts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("parents.id", ondelete="CASCADE"), unique=True)
    current_balance = Column(DECIMAL(10, 2), default=0.00)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    parent = relationship("Parent", back_populates="account")
    transactions = relationship("Transaction", back_populates="account", cascade="all, delete-orphan")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    account_id = Column(UUID(as_uuid=True), ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"))
    amount = Column(DECIMAL(10, 2), nullable=False)
    transaction_type = Column(String(50), nullable=False)
    description = Column(Text)
    status = Column(String(20), default="completed")
    payment_method = Column(String(50))
    stripe_payment_id = Column(String(255))
    due_date = Column(Date)
    paid_date = Column(Date)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    account = relationship("Account", back_populates="transactions")

class BlogPost(Base):
    __tablename__ = "blog_posts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(Text)
    featured_image = Column(String(500))
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

class GalleryAlbum(Base):
    __tablename__ = "gallery_albums"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    cover_image = Column(String(500))
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"))
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    images = relationship("GalleryImage", back_populates="album", cascade="all, delete-orphan")

class GalleryImage(Base):
    __tablename__ = "gallery_images"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    album_id = Column(UUID(as_uuid=True), ForeignKey("gallery_albums.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500))
    caption = Column(Text)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    album = relationship("GalleryAlbum", back_populates="images")

class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    target_roles = Column(ARRAY(String))
    is_pinned = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    publish_date = Column(Date, default=datetime.utcnow().date)
    expire_date = Column(Date)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    recipient_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject = Column(String(255))
    body = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class ChatLog(Base):
    __tablename__ = "chat_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    session_id = Column(UUID(as_uuid=True))
    message = Column(Text, nullable=False)
    response = Column(Text)
    is_authenticated = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
