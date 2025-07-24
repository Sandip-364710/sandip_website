# 🌀 Django Project with Docker Setup

This is a Django-based web application fully containerized using Docker. It includes a working Docker setup, SQLite database, and is easy to deploy on local or production environments.
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## 🧱 Project Structure
 -------------------------------------
# 📁 Project Structure

project-root/
|
├── Dockerfile  
├── docker-compose.yml  
├── requirements.txt  
├── manage.py  
├── db.sqlite3  
|
├── my_portfoliowebsite/  
│   ├── settings.py  
│   ├── urls.py  
│   ├── wsgi.py  
│   └── ...
|
├── media/  
│   ├── hero_images/  
│   ├── photos/  
│   └── product_images/
|
├── templates/        # HTML Templates  
├── static/           # Static files  
└── README.md


---

## 🐳 Docker Setup

### Dockerfile

```dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /my_website

COPY requirements.txt /my_portfoliowebsite/
RUN pip install -r requirements.txt

COPY my_portfoliowebsite /my_website

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
-----------------------------------------------------------
docker-compos.yml/

services:
  web:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    command: python manage.py runserver 0.0.0.0:8000
version: '3.9'
--------------------------------------------------------
requirements.txt/
Django>=4.2
-------------------------------------------------------
🚀 Run with Docker

# Build the image
docker-compose build

# Run the container
docker-compose up

# Visit in browser
http://localhost:8000
-------------------------------------------------------
💻 Run Without Docker (Local Setup)

python -m venv venv
source venv/Scripts/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
-------------------------------------------------------
📂 Static & Media Setup

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
--------------------------------------------------------
my live url

[Visit the Live Website](https://sandip-website-8jdn.onrender.com/)
















