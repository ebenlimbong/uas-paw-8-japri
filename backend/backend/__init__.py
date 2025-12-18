from pyramid.config import Configurator
from .utils.jwt_helper import decode_token

def auth_tween_factory(handler, registry):
    def auth_tween(request):
        # 1. HANDLE CORS PREFLIGHT (Penting agar browser tidak blokir)
        if request.method == "OPTIONS":
            response = request.response
            response.headers.update({
                'Access-Control-Allow-Origin': 'http://localhost:5173',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Authorization, Content-Type',
                'Access-Control-Allow-Credentials': 'true',
            })
            return response
        
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
        config.add_tween("backend.auth_tween_factory")
        config.include('pyramid_jinja2')
        config.include('.models')
        config.include('pyramid_default_cors')
        config.include('.routes')
        config.scan('.views')
    return config.make_wsgi_app()

