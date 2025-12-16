from pyramid.view import view_config
from pyramid.response import Response
from datetime import date

from .. import models
from ..utils.auth_decorators import login_required, role_required


@view_config(
    route_name="job_apply",
    renderer="json",
    request_method="POST"
)
@login_required
@role_required("seeker")
def apply_job(request):
    db = request.dbsession
    user_payload = request.user
    job_id = int(request.matchdict["id"])

    # 1. Ambil job
    job = db.query(models.Job).get(job_id)
    if not job:
        request.response.status = 404
        return {"success": False, "error": "Job tidak ditemukan."}

    # 2. Ambil seeker profile
    seeker = (
        db.query(models.JobSeeker)
        .filter_by(user_id=user_payload["user_id"])
        .first()
    )

    if not seeker:
        request.response.status = 400
        return {"success": False, "error": "Profil seeker belum dibuat."}

    # 3. Cek apakah sudah pernah apply
    existing = (
        db.query(models.Application)
        .filter_by(job_id=job.id, seeker_id=seeker.id)
        .first()
    )

    if existing:
        request.response.status = 400
        return {"success": False, "error": "Anda sudah melamar job ini."}

    # 4. Simpan application
    application = models.Application(
        job_id=job.id,
        seeker_id=seeker.id,
        status="pending",
        applied_date=date.today()
    )

    db.add(application)

    return {
        "success": True,
        "message": "Berhasil melamar pekerjaan.",
        "data": {
            "job_id": job.id,
            "status": application.status,
            "applied_date": str(application.applied_date)
        }
    }

@view_config(
    route_name="my_applications",
    renderer="json",
    request_method="GET"
)
@login_required
@role_required("seeker")
def my_applications(request):
    db = request.dbsession
    user_payload = request.user

    # 1. Ambil seeker profile
    seeker = (
        db.query(models.JobSeeker)
        .filter_by(user_id=user_payload["user_id"])
        .first()
    )

    if not seeker:
        request.response.status = 400
        return {
            "success": False,
            "error": "Profil seeker tidak ditemukan."
        }

    # 2. Ambil semua application milik seeker
    applications = (
        db.query(models.Application)
        .filter_by(seeker_id=seeker.id)
        .all()
    )

    # 3. Serialize response
    results = []
    for app in applications:
        results.append({
            "application_id": app.id,
            "status": app.status,
            "applied_date": str(app.applied_date),
            "job": {
                "id": app.job.id,
                "title": app.job.title,
                "location": app.job.location,
                "salary": app.job.salary,
                "type": app.job.type
            }
        })

    return {
        "success": True,
        "count": len(results),
        "data": results
    }


@view_config(
    route_name="job_applications",
    renderer="json",
    request_method="GET"
)
@login_required
@role_required("employer")
def job_applications(request):
    db = request.dbsession
    user_payload = request.user

    job_id = request.matchdict.get("job_id")

    # 1. Ambil job
    job = db.query(models.Job).filter_by(id=job_id).first()
    if not job:
        request.response.status = 404
        return {
            "success": False,
            "error": "Job tidak ditemukan."
        }

    # 2. Pastikan job milik employer yang login
    if job.employer_id != user_payload["user_id"]:
        request.response.status = 403
        return {
            "success": False,
            "error": "Tidak berhak melihat pelamar job ini."
        }

    # 3. Ambil semua application
    applications = job.applications

    results = []
    for app in applications:
        seeker = app.seeker
        user = seeker.user

        results.append({
            "application_id": app.id,
            "status": app.status,
            "applied_date": str(app.applied_date),
            "seeker": {
                "id": seeker.id,
                "name": user.name,
                "email": user.email,
                "skills": seeker.skills,
                "experience": seeker.experience,
                "cv_url": seeker.cv_url
            }
        })

    return {
        "success": True,
        "job": {
            "id": job.id,
            "title": job.title
        },
        "count": len(results),
        "data": results
    }


@view_config(
    route_name="update_application_status",
    renderer="json",
    request_method="PUT"
)
@login_required
@role_required("employer")
def update_application_status(request):
    db = request.dbsession
    user_payload = request.user

    application_id = request.matchdict.get("application_id")
    data = request.json_body or {}
    new_status = data.get("status")

    ALLOWED_STATUS = ["pending", "shortlisted", "rejected"]

    # 1. Validasi status
    if new_status not in ALLOWED_STATUS:
        request.response.status = 400
        return {
            "success": False,
            "error": f"Status harus salah satu dari {ALLOWED_STATUS}"
        }

    # 2. Ambil application
    application = (
        db.query(models.Application)
        .filter_by(id=application_id)
        .first()
    )

    if not application:
        request.response.status = 404
        return {
            "success": False,
            "error": "Application tidak ditemukan."
        }

    # 3. Pastikan job milik employer
    job = application.job
    if job.employer_id != user_payload["user_id"]:
        request.response.status = 403
        return {
            "success": False,
            "error": "Tidak berhak mengubah status application ini."
        }

    # 4. Update status
    application.status = new_status
    db.flush()

    seeker = application.seeker
    user = seeker.user

    return {
        "success": True,
        "message": "Status application berhasil diperbarui.",
        "data": {
            "application_id": application.id,
            "status": application.status,
            "job": {
                "id": job.id,
                "title": job.title
            },
            "seeker": {
                "id": seeker.id,
                "name": user.name,
                "email": user.email
            }
        }
    }
