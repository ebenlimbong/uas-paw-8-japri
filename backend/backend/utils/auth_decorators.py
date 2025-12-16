from pyramid.httpexceptions import HTTPUnauthorized, HTTPForbidden


def login_required(func):
    def wrapper(request):
        if not hasattr(request, "user") or request.user is None:
            request.response.status = 401
            return {
                "success": False,
                "error": "Unauthorized, login dulu."
            }
        return func(request)

    return wrapper


def role_required(role):
    def decorator(func):
        def wrapper(request):
            if not hasattr(request, "user") or request.user is None:
                request.response.status = 401
                return {
                    "success": False,
                    "error": "Unauthorized, login dulu."
                }

            if request.user.get("role") != role:
                request.response.status = 403
                return {
                    "success": False,
                    "error": f"Akses ditolak, role '{role}' dibutuhkan."
                }

            return func(request)

        return wrapper
    return decorator
