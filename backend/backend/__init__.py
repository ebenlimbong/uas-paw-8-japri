from pyramid.config import Configurator
from pyramid.response import Response
from .utils.jwt_helper import decode_token


def cors_tween_factory(handler, registry):
    """CORS Tween to handle preflight requests and add CORS headers."""
    def cors_tween(request):
        # Handle preflight OPTIONS requests
        if request.method == 'OPTIONS':
            response = Response()
            response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Max-Age'] = '86400'
            return response
        
        # Normal request - add CORS headers to response
        response = handler(request)
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response
    
    return cors_tween


def auth_tween_factory(handler, registry):
    def auth_tween(request):
        token = request.headers.get("Authorization")

        if token and token.startswith("Bearer "):
            token = token.split(" ")[1]
            from .utils.jwt_helper import decode_token
            payload = decode_token(token)
            request.user = payload  # None jika invalid
        else:
            request.user = None

        return handler(request)

    return auth_tween


def main(global_config, **settings):
    with Configurator(settings=settings) as config:
        config.include('pyramid_jinja2')
        config.include('.models')
        config.include('.routes')
        config.scan('.views')
        # Add CORS tween FIRST (outermost) to handle all requests including OPTIONS
        config.add_tween("backend.cors_tween_factory")
        config.add_tween("backend.auth_tween_factory")
    return config.make_wsgi_app()
