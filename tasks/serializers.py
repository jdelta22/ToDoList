from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task, Category, TaskShare, TaskCategory


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
    categories = serializers.PrimaryKeyRelatedField(many=True, queryset=Category.objects.all(), required=False)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'completed', 'categories', 'created_at', 'updated_at', 'shared_with'
        ]
    def create(self, validated_data):
        categories = validated_data.pop('categories', [])

        task = Task.objects.create(**validated_data)

        for category in categories:
            TaskCategory.objects.create(
                task=task,
                category=category
            )

        return task

    def update(self, instance, validated_data):
        categories = validated_data.pop('categories', None)

        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.completed = validated_data.get('completed', instance.completed)
        instance.save()
        if categories is not None:
            instance.taskcategory_set.all().delete()
            for category in categories:
                TaskCategory.objects.create(
                    task=instance,
                    category=category
                )

        return instance
    
    def validate_categories(self, value):
        user = self.context['request'].user
        for category in value:
            if category.owner != user:
                raise serializers.ValidationError(f"Category '{category.name}' does not belong to the user.")
        return value
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'created_at']

class TaskShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskShare
        fields = ['id', 'task', 'user', 'can_edit', 'shared_at']