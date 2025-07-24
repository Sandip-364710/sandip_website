
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /my_website

COPY requirements.txt /my_website/
RUN pip install -r requirements.txt

COPY my_portfoliowebsite /my_website


CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]







