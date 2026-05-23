from django.shortcuts import render
from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from .models import Task, Category, TaskShare
from .serializers import RegisterSerializer, TaskSerializer, CategorySerializer, TaskShareSerializer
from django.db.models import Q


# Create your views here.

class RegisterViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    queryset = User.objects.all()

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter( Q(owner=user) | Q(shared_with=user) ).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        task = self.get_object()
        if task.owner != self.request.user and not TaskShare.objects.filter(task=task, user=self.request.user, can_edit=True).exists():
            raise permissions.PermissionDenied("You do not have permission to edit this task.")
        serializer.save()