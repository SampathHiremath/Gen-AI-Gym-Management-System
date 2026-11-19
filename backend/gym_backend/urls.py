from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse, HttpResponse

def api_root(request):
    # Check if request is coming from a web browser looking for an HTML page
    accept_header = request.META.get('HTTP_ACCEPT', '')
    if 'text/html' in accept_header and not request.path.startswith('/api'):
        html_content = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pulse AI Gym Backend - Server Status</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    background: #0a0d14;
                    color: #f8fafc;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    padding: 24px;
                }
                .card {
                    background: #101522;
                    border: 1px solid rgba(204, 255, 0, 0.3);
                    border-radius: 16px;
                    padding: 40px;
                    max-width: 620px;
                    width: 100%;
                    box-shadow: 0 0 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(204, 255, 0, 0.15);
                    text-align: center;
                }
                .badge {
                    display: inline-block;
                    background: rgba(204, 255, 0, 0.15);
                    color: #ccff00;
                    border: 1px solid rgba(204, 255, 0, 0.4);
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 0.82rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    margin-bottom: 20px;
                }
                h1 {
                    font-size: 2rem;
                    font-weight: 900;
                    margin-bottom: 12px;
                    letter-spacing: -0.5px;
                }
                .highlight {
                    color: #ccff00;
                }
                p {
                    color: #94a3b8;
                    font-size: 1rem;
                    line-height: 1.6;
                    margin-bottom: 28px;
                }
                .notice-box {
                    background: #07090e;
                    border-left: 4px solid #00f0ff;
                    padding: 16px;
                    border-radius: 8px;
                    text-align: left;
                    margin-bottom: 28px;
                    font-size: 0.92rem;
                    color: #cbd5e1;
                }
                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: #ccff00;
                    color: #000;
                    font-weight: 800;
                    text-decoration: none;
                    padding: 14px 32px;
                    border-radius: 8px;
                    font-size: 1.05rem;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 0 20px rgba(204, 255, 0, 0.3);
                }
                .btn:hover {
                    transform: scale(1.03);
                    box-shadow: 0 0 30px rgba(204, 255, 0, 0.5);
                }
                .endpoints {
                    margin-top: 32px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    font-size: 0.8rem;
                    color: #64748b;
                }
                .endpoints a {
                    color: #00f0ff;
                    text-decoration: none;
                    margin: 0 6px;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="badge">● Django Backend API Running (Port 8000)</div>
                <h1>PULSE <span class="highlight">AI GYM</span> API</h1>
                <p>The Django Python backend API service is up and healthy!</p>
                
                <div class="notice-box">
                    <strong>Notice:</strong> This tab (<code style="color:#00f0ff;">http://127.0.0.1:8000/</code>) is the backend REST API server.<br><br>
                    To view the interactive React website UI, open:
                    <div style="margin-top:8px; font-weight:700; color:#ccff00; font-size:1.1rem;">
                        👉 <a href="http://localhost:5173" style="color:#ccff00; text-decoration:underline;">http://localhost:5173</a>
                    </div>
                </div>

                <a href="http://localhost:5173" class="btn">
                    Open React Gym Website (localhost:5173) &rarr;
                </a>

                <div class="endpoints">
                    Direct API Endpoints:
                    <a href="/api/classes/">/api/classes/</a> |
                    <a href="/api/memberships/plans/">/api/memberships/plans/</a> |
                    <a href="/admin/">/admin/</a>
                </div>
            </div>
        </body>
        </html>
        """
        return HttpResponse(html_content, content_type='text/html')

    return JsonResponse({
        'name': 'Pulse AI Gym API',
        'status': 'online',
        'version': '1.0.0',
        'features': [
            'Gen AI Workout Generator',
            'AI Macro & Meal Matrix',
            'PulseCoach AI 24/7 Agent',
            'Biomechanical Exercise Form Advisor',
            'Class Schedules & Spot Booking',
            'Membership Plans & Tiers',
            'MySQL 8.0 Integration'
        ],
        'endpoints': {
            'accounts': '/api/accounts/',
            'memberships': '/api/memberships/',
            'classes': '/api/classes/',
            'ai_services': '/api/ai/',
            'contact': '/api/contact/',
            'admin': '/admin/'
        }
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('api/', api_root, name='api_index'),
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/memberships/', include('memberships.urls')),
    path('api/classes/', include('classes.urls')),
    path('api/ai/', include('ai_services.urls')),
    path('api/contact/', include('contact.urls')),
]
