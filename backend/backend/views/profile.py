from pyramid.view import view_config

from .. import models
from ..utils.auth_decorators import login_required, role_required


def _json_error(request, message, status=400):
    request.response.status = status
    return {"success": False, "error": message}


@view_config(route_name="profile_me", renderer="json", request_method="GET")
@login_required
@role_required("seeker")
def get_profile_me(request):
    
    # mengambil profile milik user yang sudah login     

    user_payload = request.user  # dari auth tween
    user_id = user_payload["user_id"]

    user = request.dbsession.query(models.User).get(user_id)
    if not user:
        return _json_error(request, "User tidak ditemukan.", 404)

    seeker = request.dbsession.query(models.JobSeeker).filter_by(user_id=user_id).first()
    if not seeker:
        return _json_error(request, "Profil seeker belum ada.", 404)

    return {
        "success": True,
        "data": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "profile": {
                "skills": seeker.skills,
                "experience": seeker.experience,
                "cv_url": seeker.cv_url,
            }
        }
    }


@view_config(route_name="profile_me", renderer="json", request_method="PUT")
@login_required
@role_required("seeker")
def update_profile_me(request):
    
    user_payload = request.user
    user_id = user_payload["user_id"]

    data = request.json_body or {}

    user = request.dbsession.query(models.User).get(user_id)
    if not user:
        return _json_error(request, "User tidak ditemukan.", 404)

    seeker = request.dbsession.query(models.JobSeeker).filter_by(user_id=user_id).first()
    if not seeker:
        return _json_error(request, "Profil seeker belum ada.", 404)

    # update name (di tabel users)
    if "name" in data and data["name"] is not None:
        user.name = str(data["name"]).strip()

    # update profile fields (di job_seekers)
    if "skills" in data and data["skills"] is not None:
        seeker.skills = str(data["skills"]).strip()

    if "experience" in data and data["experience"] is not None:
        seeker.experience = str(data["experience"]).strip()

    if "cv_url" in data and data["cv_url"] is not None:
        seeker.cv_url = str(data["cv_url"]).strip()

    request.dbsession.flush()

    return {
        "success": True,
        "message": "Profil berhasil diupdate.",
        "data": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "profile": {
                "skills": seeker.skills,
                "experience": seeker.experience,
                "cv_url": seeker.cv_url,
            }
        }
    }
