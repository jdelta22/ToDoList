from django.urls import path
from .views import RegisterViewSet, TaskViewSet, CategoryViewSet, Clone_public_task

urlpatterns = [
    path('register/', RegisterViewSet.as_view({'post': 'create'}), name='register'),
    path('tasks/', TaskViewSet.as_view({'get': 'list', 'post': 'create'}), name='task-list'),
    path('tasks/<int:pk>/', TaskViewSet.as_view({'get': 'retrieve', 'patch': 'update', 'delete': 'destroy'}), name='task-detail'),
    path('tasks/<int:pk>/invite/', TaskViewSet.as_view({'post': 'invite'}), name='task-invite'),
    path('tasks/<int:pk>/accept_invite/', TaskViewSet.as_view({'post': 'accept_invite'}), name='task-accept-invite'),
    path('tasks/<int:pk>/decline_invite/', TaskViewSet.as_view({'post': 'decline_invite'}), name='task-decline-invite'),
    path('public/tasks/<uuid:share_code>/clone/', Clone_public_task, name='clone-public-task'),
    path('categories/', CategoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='category-list'),
    path('categories/<int:pk>/', CategoryViewSet.as_view({'get': 'retrieve', 'patch': 'update', 'delete': 'destroy'}), name='category-detail'),
]