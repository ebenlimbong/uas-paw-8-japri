from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPUnauthorized
from passlib.context import CryptContext
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

from .. import models


def _json_error(message, status=400):
    return {
        "success": False,
        "error": message,
        "status": status,
    }


@view_config(route_name="api_register", renderer="json", request_method="POST")
def register(request):
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

from ..utils.jwt_helper import create_token

@view_config(route_name='login', renderer='json', request_method='POST')
def login(request):
    data = request.json_body
    email = data.get("email")
    password = data.get("password")

    user = request.dbsession.query(models.User).filter_by(email=email).first()
    if not user:
        return _json_error("Email tidak ditemukan.")

    if not pwd_context.verify(password, user.password):
        return _json_error("Password salah.")

    token = create_token(user.id, user.role)

    return {
        "success": True,
        "message": "Login berhasil.",
        "token": token,
        "data": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    }






