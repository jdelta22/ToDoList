from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets, permissions, status
from django.contrib.auth.models import User
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters import FilterSet, CharFilter

from .models import Task, Category, TaskShare
from .serializers import RegisterSerializer, TaskSerializer, CategorySerializer, SharedTaskSerializer, TaskShareSerializer

# Create your views here.

class TaskFilter(FilterSet):

    completed = CharFilter(
        method='filter_completed'
    )

    class Meta:
        model = Task
        fields = ['completed', 'categories']

    def filter_completed(self, queryset, name, value):

        user = self.request.user

        if value == "true":

            return queryset.filter(
                Q(
                    owner=user,
                    completed=True
                ) |
                Q(
                    shares__user=user,
                    shares__completed=True,
                    shares__accepted=True
                )
            ).distinct()

        if value == "false":

            return queryset.filter(
                Q(
                    owner=user,
                    completed=False
                ) |
                Q(
                    shares__user=user,
                    shares__completed=False,
                    shares__accepted=True
                )
            ).distinct()

        return queryset

class RegisterViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    queryset = User.objects.all()

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = TaskFilter

    search_fields = [
        'title',
        'description',
    ]
    ordering_fields = [
        'created_at',
        'title',
    ]
    

    def get_queryset(self):
        user = self.request.user
        owned_tasks = Task.objects.filter(owner=user)
        shared_tasks = Task.objects.filter(
            shares__user=user,
            shares__accepted=True
        )
        return (owned_tasks | shared_tasks).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        task = self.get_object()
        if task.owner != self.request.user and not TaskShare.objects.filter(task=task, user=self.request.user, can_edit=True).exists():
            raise permissions.PermissionDenied("You do not have permission to edit this task.")
        serializer.save()

    # =========================
    # PRIVATE SHARE (INVITE): convida usuários específicos para compartilhar a tarefa, com opções de permissão (apenas visualização ou edição).
    # o dono da tarefa consegue visualizar a lista de usuários compartilhados e suas permissões, e pode revogar o acesso a qualquer momento.
    # além de saber se o usuário completou a tarefa ou não.
    # =========================

    @action(detail=True, methods=['post'])
    def invite(self, request, pk=None):

        task = self.get_object()

        if task.owner != request.user:
            return Response(
                {'detail': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        username = request.data.get('username')
        can_edit = request.data.get('can_edit', False)

        if not username:
            return Response(
                {'detail': 'Username is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        invited_user = User.objects.filter(
            username=username
        ).first()

        if not invited_user:
            return Response(
                {'detail': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if invited_user == request.user:
            return Response(
                {'detail': 'You cannot invite yourself'},
                status=status.HTTP_400_BAD_REQUEST
            )

        TaskShare.objects.update_or_create(
            task=task,
            user=invited_user,
            defaults={
                'can_edit': can_edit,
                'accepted': None
            }
        )

        return Response({
            'detail': f'Invite sent to {username}'
        })


# =========================
# PUBLIC SHARE: clona a tarefa para um usuário específico, criando uma nova tarefa idêntica, mas de propriedade do usuário que a clonou. A tarefa original permanece inalterada e privada.
# =========================

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def Clone_public_task(request, share_code):

    original_task = Task.objects.filter(
        share_code=share_code,
        is_public=True
    ).first()

    if not original_task:
        return Response(
            {'detail': 'Invalid share link'},
            status=status.HTTP_404_NOT_FOUND
        )

    new_task = Task.objects.create(
        owner=request.user,
        title=original_task.title,
        description=original_task.description,
        completed=False
    )

    for category in original_task.categories.all():
        new_task.categories.add(category)

    return Response({
        'detail': 'Task cloned successfully',
        'task_id': new_task.id
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_public(request, share_code):

    task = Task.objects.filter(
        share_code=share_code
    ).first()

    if not task:
        return Response(
            {'detail': 'Task not found'},
            status=404
        )

    if task.owner != request.user:
        return Response(
            {'detail': 'Permission denied'},
            status=403
        )

    task.is_public = not task.is_public
    task.save()

    return Response({
        'is_public': task.is_public,
        'share_code': str(task.share_code)
    })

@api_view(['GET'])
def public_task_detail(request, share_code):

    task = Task.objects.filter(
        share_code=share_code,
        is_public=True
    ).first()

    if not task:
        return Response(
            {'detail': 'Task not found'},
            status=404
        )

    serializer = TaskSerializer(task)

    return Response(serializer.data)
    
class CategoryViewSet(viewsets.ModelViewSet):
    pagination_class = None
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
class SharedByMeViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = SharedTaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]
    filterset_fields = [
        'shares__completed',
        'is_public',
        'categories',
    ]

    search_fields = [
        'title',
        'description',
    ]
    ordering_fields = [
        'created_at',
        'updated_at',
        'title',
    ]
    ordering = ['-created_at']

    def get_queryset(self):

        return Task.objects.filter(
            owner=self.request.user,
            shares__isnull=False
        ).prefetch_related(
            'shares__user',
            'categories',
        ).distinct().order_by('-created_at')

class TaskReceivedShareViewSet(viewsets.ModelViewSet):
    serializer_class = TaskShareSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        'accepted',
        'completed',
        'can_edit',
        'task__categories',
        'task__owner',
    ]

    search_fields = [
        'task__title',
        'task__description',
    ]
    ordering_fields = [
        'task__created_at',
        'task__updated_at',
    ]
    ordering = ['-task__created_at']


    def get_queryset(self):
        return TaskShare.objects.filter(Q(user=self.request.user)).exclude(
        accepted=False).order_by('-task__created_at')
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):

        share = self.get_object()

        if share.user != request.user:
            return Response(
                {'detail': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        share.accepted = True
        share.save()

        return Response({
            'detail': 'Invite accepted'
        })
    
    @action(detail=True, methods=['post'])
    def decline(self, request, pk=None):

        share = self.get_object()

        if share.user != request.user:
            return Response(
                {'detail': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        share.accepted = False
        share.save()

        return Response({
            'detail': 'Invite declined'
        })
    
    @action(detail=True, methods=['patch'])
    def toggle_complete(self, request, pk=None):

        share = self.get_object()

        if share.user != request.user:
            return Response(
                {'detail': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        share.completed = not share.completed
        share.save()

        return Response({
            'completed': share.completed
        })
    
@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def revoke_share(request, task_id, share_id):

    try:
        share = TaskShare.objects.get(
            id=share_id,
            task_id=task_id
        )

        share.delete()

        return Response(
            {'detail': 'Share revoked successfully'},
            status=status.HTTP_200_OK
        )

    except TaskShare.DoesNotExist:
        return Response(
            {"detail": "Compartilhamento não encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )