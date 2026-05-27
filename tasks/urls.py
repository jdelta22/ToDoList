from django.urls import path
from .views import RegisterViewSet, TaskViewSet, CategoryViewSet, Clone_public_task, TaskReceivedShareViewSet, toggle_public, public_task_detail, SharedByMeViewSet, revoke_share

urlpatterns = [
    path('register/', RegisterViewSet.as_view({'post': 'create'}), name='register'),
    path('tasks/', TaskViewSet.as_view({'get': 'list', 'post': 'create'}), name='task-list'),
    path('tasks/<int:pk>/', TaskViewSet.as_view({'get': 'retrieve', 'patch': 'update', 'delete': 'destroy'}), name='task-detail'),
    path('tasks/<int:pk>/invite/', TaskViewSet.as_view({'post': 'invite'}), name='task-invite'),

    path('public/tasks/<uuid:share_code>/', public_task_detail, name='public-task-detail'),
    path('public/tasks/<uuid:share_code>/clone/', Clone_public_task, name='clone-public-task'),
    path('public/tasks/<uuid:share_code>/make-public/', toggle_public, name='make-public-task'),
    
    path('categories/', CategoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='category-list'),
    path('categories/<int:pk>/', CategoryViewSet.as_view({'get': 'retrieve', 'patch': 'update', 'delete': 'destroy'}), name='category-detail'),
    
    path('shares/', SharedByMeViewSet.as_view({'get': 'list'}), name='share-list'),
    path('shares/<int:pk>/', SharedByMeViewSet.as_view({'get': 'retrieve'}), name='share-detail'),
    path('tasks/<int:task_id>/shares/<int:share_id>/revoke/', revoke_share, name='share-revoke'),
    
    path('received-shares/', TaskReceivedShareViewSet.as_view({'get': 'list'}), name='received-shares'),
    path('received-shares/<int:pk>/', TaskReceivedShareViewSet.as_view({'get': 'retrieve'}), name='received-share-detail'),
    
    path('received-shares/<int:pk>/accept/', TaskReceivedShareViewSet.as_view({'post': 'accept'}), name='accept-share'),
    path('received-shares/<int:pk>/decline/', TaskReceivedShareViewSet.as_view({'post': 'decline'}), name='decline-share'),
    
    path('received-shares/<int:pk>/toggle-complete/', TaskReceivedShareViewSet.as_view({ 'patch': 'toggle_complete'}), name='toggle-share-complete'
),
]