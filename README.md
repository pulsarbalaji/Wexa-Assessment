# 🚀 Pulse Analytics Platform

A full-stack **multi-tenant analytics platform** built with **Django + Next.js**, designed for real-time event tracking, alerting, dashboard analytics, report automation, and organization-level isolation.

---

## 📌 Project Overview

Pulse Analytics Platform enables organizations to:

- Track incoming analytics events
- Monitor dashboards in real time
- Configure intelligent alert systems
- Generate scheduled reports
- Manage organization-level API keys
- Maintain secure multi-tenant data isolation

Built with **enterprise architecture principles**, including:

✅ Multi-Tenant Architecture  
✅ Organization-Level Data Isolation  
✅ JWT Authentication  
✅ Role-Based Access Control (RBAC)  
✅ Celery Async Background Jobs  
✅ Redis Queue Processing  
✅ Automated PDF Report Generation  
✅ Dynamic Dashboard Analytics  
✅ API Key Management  
✅ Modern SaaS Dashboard UI  

---

# 🏗 System Architecture

```txt
┌──────────────────────────────┐
│         Next.js UI           │
│      (React + TS + Tailwind) │
└──────────────┬───────────────┘
               │ REST APIs
               ▼
┌──────────────────────────────┐
│         Django REST API      │
│       (Business Logic)       │
└──────┬──────────┬────────────┘
       │          │
       ▼          ▼
 PostgreSQL     Redis
(Database)    (Background Jobs)
                  │
                  ▼
              Celery Worker
                  │
                  ▼
           Report Generation

✨ Features
🔐 Authentication & Authorization
JWT Authentication
Refresh Token Rotation
Secure Login / Signup
Role-Based Permissions

Roles:

OWNER
ADMIN
USER

Example Permission:

class IsAdminOrOwner(BasePermission):

    def has_permission(self, request, view):
        return request.user.role in [
            "OWNER",
            "ADMIN"
        ]
🏢 Multi-Tenant Organization System

Every organization has fully isolated data.

Example:

Event.objects.filter(
    organization=request.user.organization
)

Ensures:

Secure tenant separation
Zero data leakage
Enterprise SaaS architecture
📊 Dynamic Dashboard Analytics

Real-time dashboard analytics:

KPI Cards
Total Events
Total Purchases
Active Alerts
Reports Generated
Charts
Event Trend Chart
Event Distribution
Source Analytics
Top Event Sources

Built dynamically using:

React Query
Zustand
Recharts
Django Aggregations
📡 Event Ingestion System

Supports multiple ingestion methods.

Single Event API
POST /api/events/
Batch Upload
POST /api/events/batch/
CSV Upload
POST /api/events/upload/

Supported Event Sources:

Web
Mobile
SDK
API
Webhook
🚨 Alert Engine

Dynamic threshold-based alerts.

Example:

If purchase event > 100
within 30 minutes
→ Trigger Alert

Features:

Threshold Monitoring
Time Window Detection
Email Notifications
Alert History
Trigger Tracking

Powered by:

Celery
Redis
Scheduled Background Tasks
📄 Report Automation

Automated report generation:

Supported:
Daily Reports
Weekly Reports
Monthly Reports

Features:

PDF Generation
Email Delivery
Dashboard Analytics Export
Report History Tracking

Technology:

Celery
ReportLab
Django Email Backend
🔑 API Key Management

Organization-level API key management.

Supports:

Create API Key
Rotate API Key
Revoke API Key

Example Key:

pk_live_8d2a7f4f2c31a...
⚙️ Settings Management

Dynamic Settings Page:

User Profile
Update Name
Email
Username
Organization Settings
Organization Name
Workspace Settings
Security
Change Password
API Keys
Generate
Rotate
Delete
🛠 Tech Stack
Backend
Technology	Purpose
Django	Backend Framework
Django REST Framework	REST APIs
PostgreSQL	Database
Celery	Background Jobs
Redis	Task Queue
JWT	Authentication
ReportLab	PDF Generation
Pandas	CSV Processing
Frontend
Technology	Purpose
Next.js 15	Frontend Framework
TypeScript	Type Safety
TailwindCSS	Styling
Zustand	State Management
React Query	Server State
Axios	API Integration
Framer Motion	Animations
Recharts	Analytics Charts
📂 Project Structure
Backend
Backend/
│── authentication/
│── organizations/
│── dashboards/
│── events/
│── alerts/
│── reports/
│── config/
│── manage.py
Frontend
Frontend/
│── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── middleware.ts
⚡ Installation Guide
1. Clone Repository
git clone <your-github-url>
cd PulseAnalytics
Backend Setup
Create Virtual Environment
python -m venv venv

Activate:

Windows
venv\Scripts\activate
Linux / Mac
source venv/bin/activate
Install Dependencies
pip install -r requirements.txt
Configure Environment

Create:

.env

Example:

DEBUG=True

SECRET_KEY=your_secret_key

DATABASE_NAME=pulse_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432

ALLOWED_HOSTS=127.0.0.1,localhost

CELERY_BROKER_URL=redis://127.0.0.1:6379/0
CELERY_RESULT_BACKEND=redis://127.0.0.1:6379/0
Run Migrations
python manage.py makemigrations
python manage.py migrate
Create Superuser
python manage.py createsuperuser
Run Server
python manage.py runserver
Start Celery Worker
celery -A config worker -l info -P solo
Frontend Setup

Install Packages:

npm install

Create:

.env.local

Example:

NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws

Run:

npm run dev
🔐 Demo Credentials
Email:
admin@test.com

Password:
admin123

📷 Screenshots
Dashboard
<img width="1920" height="913" alt="image" src="https://github.com/user-attachments/assets/597914ec-1539-447c-b543-90fa0e20672c" />


Events

<img width="1920" height="725" alt="image" src="https://github.com/user-attachments/assets/187c160d-e97d-4692-bbca-60e689738484" />


Alerts

<img width="1920" height="629" alt="image" src="https://github.com/user-attachments/assets/ac59cfff-eee7-44c6-8b5e-a41a98a544c7" />


Reports

<img width="1920" height="734" alt="image" src="https://github.com/user-attachments/assets/cb012dc6-f602-48f1-b509-28d318a29add" />


Settings
<img width="1909" height="765" alt="image" src="https://github.com/user-attachments/assets/5fa6a80b-d785-4460-b6b4-dbb512959ce4" />
📌 API Documentation

Authentication

POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/refresh/

Events

GET /api/events/
POST /api/events/
POST /api/events/batch/
POST /api/events/upload/

Alerts

GET /api/alerts/
POST /api/alerts/

Reports

GET /api/reports/
POST /api/reports/
POST /api/reports/:id/run/
DELETE /api/reports/:id/

Dashboards

GET /api/dashboard/stats/
GET /api/dashboard/line-chart/
GET /api/dashboard/bar-chart/
GET /api/dashboard/pie-chart/
🚀 Future Improvements
WebSocket Live Analytics
AI-Based Anomaly Detection
Real-Time Notifications
Export to Excel
Advanced Dashboard Builder
Slack / Teams Integration
👨‍💻 Author

Your Name

Software Architect | Full Stack Developer

GitHub:
https://github.com/pulsarbalaji/

LinkedIn:
(https://www.linkedin.com/in/vijay-balaji-arumugam-525297286/)

⭐ Thank You

Thank you for reviewing this assignment.
# Pulse Analytics Platform

## Overview

A scalable analytics platform built using Django, Next.js, PostgreSQL, WebSockets, and Celery for real-time dashboards, alerts, and reporting.

## Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* React Query
* Zustand

### Backend

* Django
* Django REST Framework
* Django Channels
* JWT Authentication
* Celery

### Database & Infrastructure

* PostgreSQL
* Redis
* Render
* Vercel

## Features

* User Authentication (JWT)
* Dashboard Analytics
* Alerts Management
* Event Tracking
* Reports Generation
* Real-time Updates using WebSocket
* Role-based Access

## Local Setup

### Backend

```bash
cd Backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Environment Variables

### Backend

```env
SECRET_KEY=
DEBUG=
DATABASE_URL=
REDIS_URL=
EMAIL_HOST=
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
```

### Frontend

```env
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_WS_BASE_URL=
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_APP_VERSION=
```

## Live Deployment

### Frontend URL
https://wexa-assessment-hi76fit40-eik-villans-products.vercel.app/login

### Backend URL

https://wexa-assessment-d80d.onrender.com

## Architecture Decisions

* Django Channels used for real-time updates
* JWT authentication for secure API access
* Celery for asynchronous task processing
* PostgreSQL for relational data storage
* Next.js for scalable frontend rendering

## Known Limitations

* Celery workers may require paid infrastructure in cloud environments.
* Free-tier services may experience cold starts.

## Final Note

I enjoyed designing and implementing this scalable, enterprise-grade analytics platform and would be excited to discuss the architecture decisions and implementation details further.

