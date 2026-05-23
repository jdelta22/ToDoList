from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets, permissions, status
from django.contrib.auth.models import User
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import Task, Category, TaskShare
from .serializers import RegisterSerializer, TaskSerializer, CategorySerializer, TaskShareSerializer

# Create your views here.

class RegisterViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    queryset = User.objects.all()

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

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
        share_code=share_code
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
    
class CategoryViewSet(viewsets.ModelViewSet):

    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class TaskSharedViewSet(viewsets.ModelViewSet):
    serializer_class = TaskShareSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TaskShare.objects.filter(Q(task__owner=self.request.user))
    
class TaskReceivedShareViewSet(viewsets.ModelViewSet):
    serializer_class = TaskShareSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TaskShare.objects.filter(Q(user=self.request.user))
    
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