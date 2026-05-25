import uuid

from django.db import models
from django.contrib.auth.models import User
# Create your models here.

    
class Category(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    color = models.CharField(max_length=7, blank=True)
    class Meta:
        unique_together = ('owner', 'name')
    def __str__(self):
        return self.name

class Task(models.Model):
    owner = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='tasks'
    )
    categories = models.ManyToManyField(
        Category,
        related_name='tasks',
        through='TaskCategory',
        blank=True
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    share_code = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class TaskCategory(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('task', 'category')
    def __str__(self):
        return f'{self.task} - {self.category}'

class TaskShare(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='shares')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_tasks')
    can_edit = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    accepted = models.BooleanField(null=True, default=None) # None = pending, True = accepted, False = rejected
    invited_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = ('task', 'user')

    def __str__(self):
        return f'{self.user} - {self.task} (Edit: {self.can_edit}, Accepted: {self.accepted}, Complete: {self.completed})'
