from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest
from datetime import date

from .. import models
from ..utils.auth_decorators import login_required, role_required


@view_config(route_name="save_job", renderer="json", request_method="POST")
@login_required
@role_required("seeker")
def save_job(request):
    db = request.dbsession
    job_id = int(request.matchdict["id"])

    seeker = db.query(models.JobSeeker)\
        .filter_by(user_id=request.user["user_id"]).first()

    job = db.query(models.Job).get(job_id)
    if not job:
        return {"success": False, "error": "Job tidak ditemukan"}

    # Cegah duplicate save
    exists = db.query(models.SavedJob).filter_by(
        seeker_id=seeker.id,
        job_id=job_id
    ).first()

    if exists:
        return {"success": False, "error": "Job sudah disimpan"}

    saved = models.SavedJob(
        seeker_id=seeker.id,
        job_id=job_id,
        created_at=date.today()
    )

    db.add(saved)

    return {"success": True, "message": "Job berhasil disimpan"}


@view_config(route_name="my_saved_jobs", renderer="json", request_method="GET")
@login_required
@role_required("seeker")
def my_saved_jobs(request):
    db = request.dbsession

    seeker = db.query(models.JobSeeker)\
        .filter_by(user_id=request.user["user_id"]).first()

    saved_jobs = db.query(models.SavedJob)\
        .filter_by(seeker_id=seeker.id).all()

    return {
        "success": True,
        "count": len(saved_jobs),
        "data": [sj.to_dict() for sj in saved_jobs]
    }