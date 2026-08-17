from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('objectives/', views.get_objectives, name='get_objectives'),
    path('chat/', views.chat_endpoint, name='chat_endpoint'),
    path('reset/', views.reset_chat, name='reset_chat'),
]
