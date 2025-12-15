from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound

from .. import models
from ..utils.auth_decorators import login_required, role_required

@view_config(
    route_name="company_profile_me",
    renderer="json",
    request_method="GET"
)
@login_required
@role_required("employer")
def get_company_profile(request):
    db = request.dbsession
    user_id = request.user["user_id"]

    profile = (
        db.query(models.CompanyProfile)
        .filter_by(employer_id=user_id)
        .first()
    )

    if not profile:
        return {
            "success": True,
            "data": None,
            "message": "Company profile belum dibuat"
        }

    return {
        "success": True,
        "data": {
            "company_name": profile.company_name,
            "description": profile.description,
            "website": profile.website,
            "location": profile.location,
        }
    }
