def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    
    config.add_route('api_register', '/api/register')
    config.add_route('login', '/api/login')


    config.add_route('api_jobs', '/api/jobs')
    # detail / update / delete job berdasarkan ID
    config.add_route('api_job_detail', '/api/jobs/{id}')
