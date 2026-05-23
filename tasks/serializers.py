from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task, Category, TaskShare


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class TaskSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=False)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'completed', 'created_at', 'updated_at', 'shared_with'
        ]
    def create(self, validated_data):
        return Task.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.completed = validated_data.get('completed', instance.completed)
        instance.save()
        return instance

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'created_at']

class TaskShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskShare
        fields = ['id', 'task', 'user', 'can_edit', 'shared_at']