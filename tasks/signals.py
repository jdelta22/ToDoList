import random

from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Category

COLORS = [
    '#EF4444',
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
]

@receiver(pre_save, sender=Category)
def set_default_color(sender, instance, **kwargs):
    if not instance.color:
        instance.color = random.choice(COLORS)