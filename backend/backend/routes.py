def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    
    config.add_route('api_register', '/api/register')
    config.add_route('login', '/api/login')


    config.add_route('api_jobs', '/api/jobs')
    config.add_route("job_search", "/api/jobs/search")
    
    # detail / update / delete job berdasarkan ID
    config.add_route('api_job_detail', '/api/jobs/{id}')
    config.add_route("profile_me", "/api/profile/me")
    
    # Fitur apply job untuk user 
    config.add_route("job_apply", "/api/jobs/{id}/apply")
    
    # Api untuk user melihat pekerjaan yang sudah dilamar 
    config.add_route("my_applications", "/api/applications/me")
    
    # Api untuk employer, melihat data user yang melamar ke perusahaannya 
    config.add_route(
    "job_applications",
    "/api/jobs/{job_id}/applications"
    )
    
    # Api untuk employer mengupdate status dari seeker yang melamar di pekerjaan yang sudah diposting 
    config.add_route(
    "update_application_status",
    "/api/applications/{application_id}/status"
    )
    
    # Menambahkan fitur saved jobs 
    config.add_route("save_job", "/api/jobs/{id}/save")

    config.add_route("my_saved_jobs", "/api/saved_jobs/me")
    config.add_route("unsave_job", "/api/saved-jobs/{id}")
    
    # Menambahakn routes untuk company 
    config.add_route("company_profile_me", "/api/company/me")
    config.add_route("company_profile_public", "/api/company/{id}")

    config.add_route("auth_me", "/api/auth/me")
