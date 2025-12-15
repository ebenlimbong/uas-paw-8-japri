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
