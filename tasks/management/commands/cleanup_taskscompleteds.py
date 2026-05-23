from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from tasks.models import Task


class Command(BaseCommand):

    help = 'Delete completed tasks older than 30 days'

    def handle(self, *args, **kwargs):

        deleted_count, _ = Task.objects.filter(
            completed=True,
            completed_at__lt=timezone.now() - timedelta(days=30)
        ).delete()

        self.stdout.write(
            self.style.SUCCESS(
                f'{deleted_count} completed tasks deleted.'
            )
        )