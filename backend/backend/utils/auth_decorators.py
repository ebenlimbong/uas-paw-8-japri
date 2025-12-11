from pyramid.httpexceptions import HTTPUnauthorized, HTTPForbidden

def require_auth(view):
    def wrapper(request):
        if not request.user:
            raise HTTPUnauthorized(json_body={"error": "Unauthorized"})
        return view(request)
    return wrapper

def require_role(*roles):
    def decorator(view):
        def wrapper(request):
            if not request.user:
                raise HTTPUnauthorized(json_body={"error": "Unauthorized"})

            if request.user["role"] not in roles:
                raise HTTPForbidden(json_body={"error": "Forbidden"})

            return view(request)
        return wrapper
    return decorator
