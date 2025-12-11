from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPUnauthorized
from passlib.context import CryptContext
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

from .. import models


def _json_error(message, status=400):
    """Helper untuk balikin error JSON rapi."""
    return {
        "success": False,
        "error": message,
        "status": status,
    }


@view_config(route_name="api_register", renderer="json", request_method="POST")
def register(request):
    """
    Register user baru (Job Seeker atau Employer).
    Body JSON:
    {
      "name": "...",
      "email": "...",
      "password": "...",
      "role": "seeker" | "employer"
    }
    """
    data = request.json_body or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    # 1. Validasi input sederhana
    if not all([name, email, password, role]):
        request.response.status = 400
        return _json_error("name, email, password, dan role wajib diisi.")

    role = role.lower()
    if role not in ("seeker", "employer"):
        request.response.status = 400
        return _json_error("role harus 'seeker' atau 'employer'.")

    dbsession = request.dbsession

    # 2. Cek email sudah dipakai atau belum
    existing = (
        dbsession.query(models.User)
        .filter(models.User.email == email)
        .first()
    )
    if existing:
        request.response.status = 400
        return _json_error("Email sudah terdaftar, silakan login.")

    # 3. Hash password
    hashed_password = pwd_context.hash(password)

    # 4. Simpan user
    user = models.User(
        name=name,
        email=email,
        password=hashed_password,
        role=role,
    )
    dbsession.add(user)
    dbsession.flush()  # supaya user.id keisi

    # 5. Kalau role seeker, buat record profil kosong di JobSeeker
    if role == "seeker" and hasattr(models, "JobSeeker"):
        seeker_profile = models.JobSeeker(
            user_id=user.id,
            skills="",
            experience="",
            cv_url="",
        )
        dbsession.add(seeker_profile)

    # 6. Response sukses
    return {
        "success": True,
        "message": "User berhasil diregister.",
        "data": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        },
    }


@view_config(route_name="api_login", renderer="json", request_method="POST")
def login(request):
    """
    Login user.
    Body JSON:
    {
      "email": "...",
      "password": "..."
    }
    """
    data = request.json_body or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        request.response.status = 400
        return _json_error("email dan password wajib diisi.")

    dbsession = request.dbsession

    user = (
        dbsession.query(models.User)
        .filter(models.User.email == email)
        .first()
    )

    if user is None:
        request.response.status = 401
        return _json_error("Email atau password salah.", status=401)

    # cek password
    if not pwd_context.verify(password, user.password):
        request.response.status = 401
        return _json_error("Email atau password salah.", status=401)

    # Di sini nanti bisa ditambah JWT / session.
    # Untuk sekarang kita balikin info user saja.
    return {
        "success": True,
        "message": "Login berhasil.",
        "data": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        },
    }
