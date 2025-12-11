from pyramid.config import Configurator
from .utils.jwt_helper import decode_token

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
        config.add_tween("backend.auth_tween_factory")
    return config.make_wsgi_app()

