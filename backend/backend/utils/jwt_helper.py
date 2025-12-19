import jwt
import datetime
import os # Tambahkan ini
from pyramid.settings import asbool

# Ubah baris ini agar fleksibel
# Ia akan mencari di settings production.ini, jika tidak ada pakai default
def get_secret_key(request=None):
    if request:
        return request.registry.settings.get('jwt.secret', '3b3n_k3r3n')
    return os.environ.get('JWT_SECRET', '3b3n_k3r3n')

SECRET_KEY = get_secret_key()

def create_token(user_id, role):
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=6)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def decode_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
