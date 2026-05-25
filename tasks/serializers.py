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

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'created_at']


class TaskSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=False)
    categories = CategorySerializer(
        many=True,
        read_only=True
    )

    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        many=True,
        write_only=True,
        source='categories',
        required=False
    )
    owner = serializers.CharField(source='owner.username', read_only=True)
    is_owner = serializers.SerializerMethodField()
    share_completed = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()
    share_id = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        request = self.context.get('request')
        return obj.owner == request.user
    
    def get_share_completed(self, obj):
        request = self.context.get('request')
        share = TaskShare.objects.filter(
            task=obj,
            user=request.user
        ).first()
        return share.completed if share else None
    
    def get_share_id(self, obj):

        request = self.context.get('request')

        if not request:
            return None

        share = TaskShare.objects.filter(
            task=obj,
            user=request.user
        ).first()

        return share.id if share else None

    def get_can_edit(self, obj):
        request = self.context.get('request')
        if obj.owner == request.user:
            return True
        share = TaskShare.objects.filter(
            task=obj,
            user=request.user
        ).first()
        return share.can_edit if share else False

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'completed',
            'categories',
            'category_ids',
            'created_at',
            'updated_at',
            'share_code',
            'is_public',
            'owner',
            'is_owner',
            'share_id',
            'share_completed',
            'can_edit'
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
    
class SharedUserSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source='user.username',
        read_only=True
    )

    class Meta:
        model = TaskShare

        fields = [
            'id',
            'username',
            'can_edit',
            'completed',
            'accepted',
            'invited_at',
        ]

class SharedTaskSerializer(serializers.ModelSerializer):

    categories = CategorySerializer(
        many=True,
        read_only=True
    )

    users = SharedUserSerializer(
        source='shares',
        many=True,
        read_only=True
    )

    class Meta:
        model = Task

        fields = [
            'id',
            'title',
            'description',
            'completed',
            'categories',
            'share_code',
            'is_public',
            'created_at',
            'updated_at',
            'users',
        ]

class TaskShareSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)
    user = serializers.CharField(source='user.username',read_only=True)
    class Meta:
        model = TaskShare
        fields = ['id', 'task', 'user', 'can_edit', 'invited_at', 'accepted', 'completed']