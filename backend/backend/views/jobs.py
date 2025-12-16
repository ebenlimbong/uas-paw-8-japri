from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPForbidden

from .. import models
from ..utils.auth_decorators import login_required, role_required

from sqlalchemy import or_


def _json_error(message, status=400):
    return {
        "success": False,
        "error": message,
        "status": status,
    }


# 1) CREATE JOB (Employer)
@view_config(
    route_name="api_jobs",
    renderer="json",
    request_method="POST"
)
@login_required
@role_required("employer")
def create_job(request):
    data = request.json_body or {}

    title = data.get("title")
    description = data.get("description")
    requirements = data.get("requirements")
    salary = data.get("salary")
    location = data.get("location")
    job_type = data.get("type")

    if not all([title, description, requirements]):
        request.response.status = 400
        return _json_error("title, description, dan requirements wajib diisi.")

    db = request.dbsession
    current_user = request.user  # dari JWT (dict: {user_id, role})

    job = models.Job(
        employer_id=current_user["user_id"],
        title=title,
        description=description,
        requirements=requirements,
        salary=salary,
        location=location,
        type=job_type,
    )
    db.add(job)
    db.flush()  # supaya job.id terisi

    return {
        "success": True,
        "message": "Job berhasil dibuat.",
        "data": job.to_dict(),
    }


# 2) LIST JOBS (semua job)
@view_config(
    route_name="api_jobs",
    renderer="json",
    request_method="GET"
)
def list_jobs(request):
    db = request.dbsession
    jobs = db.query(models.Job).all()

    return {
        "success": True,
        "data": [job.to_dict() for job in jobs],
    }


# 3) GET JOB DETAIL
@view_config(
    route_name="api_job_detail",
    renderer="json",
    request_method="GET"
)
def get_job_detail(request):
    db = request.dbsession
    job_id = int(request.matchdict["id"])

    job = db.query(models.Job).get(job_id)
    if not job:
        request.response.status = 404
        return _json_error("Job tidak ditemukan.", status=404)

    return {
        "success": True,
        "data": job.to_dict(),
    }


# 4) UPDATE JOB (Employer, owner only)
@view_config(
    route_name="api_job_detail",
    renderer="json",
    request_method="PUT"
)
@login_required
@role_required("employer")
def update_job(request):
    db = request.dbsession
    job_id = int(request.matchdict["id"])
    current_user = request.user

    job = db.query(models.Job).get(job_id)
    if not job:
        request.response.status = 404
        return _json_error("Job tidak ditemukan.", status=404)

    # hanya employer pemilik job yang boleh edit
    if job.employer_id != current_user["user_id"]:
        request.response.status = 403
        return _json_error("Kamu tidak boleh mengubah job ini.", status=403)

    data = request.json_body or {}
    # update hanya field yang dikirim
    for field in ["title", "description", "requirements", "salary", "location", "type"]:
        if field in data:
            setattr(job, field, data[field])

    return {
        "success": True,
        "message": "Job berhasil diupdate.",
        "data": job.to_dict(),
    }


# 5) DELETE JOB (Employer, owner only)
@view_config(
    route_name="api_job_detail",
    renderer="json",
    request_method="DELETE"
)
@login_required
@role_required("employer")
def delete_job(request):
    db = request.dbsession
    job_id = int(request.matchdict["id"])
    current_user = request.user

    job = db.query(models.Job).get(job_id)
    if not job:
        request.response.status = 404
        return _json_error("Job tidak ditemukan.", status=404)

    if job.employer_id != current_user["user_id"]:
        request.response.status = 403
        return _json_error("Kamu tidak boleh menghapus job ini.", status=403)

    db.delete(job)

    return {
        "success": True,
        "message": "Job berhasil dihapus.",
    }


@view_config(route_name="job_search", renderer="json", request_method="GET")
def search_jobs(request):
    db = request.dbsession
    query = db.query(models.Job)

    # Mengambil parameter query
    keyword = request.params.get("q")
    location = request.params.get("location")
    job_type = request.params.get("type")
    min_salary = request.params.get("min_salary")
    max_salary = request.params.get("max_salary")

    # Fitur search
    if keyword:
        query = query.filter(or_(
            models.Job.title.ilike(f"%{keyword}%"),
            models.Job.description.ilike(f"%{keyword}%"),
            models.Job.requirements.ilike(f"%{keyword}%")
        ))

    # Filter berdasarkan Lokasi
    if location:
        query = query.filter(models.Job.location.ilike(f"%{location}%"))

    # Filter berdasarkan  Job Type
    if job_type:
        query = query.filter(models.Job.type.ilike(f"%{job_type}%"))


    # Filter berdasarkan Salary 
    try:
        if min_salary:
            query = query.filter(models.Job.salary >= int(min_salary))
        if max_salary:
            query = query.filter(models.Job.salary <= int(max_salary))
    except ValueError:
        return {"success": False, "error": "Invalid salary value"}

    results = [job.to_dict() for job in query.all()]

    return {"success": True, "count": len(results), "data": results}