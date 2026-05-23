from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from tasks.models import TaskShare


class Command(BaseCommand):

    help = 'Remove declined task shares older than 7 days'

    def handle(self, *args, **kwargs):

        deleted_count, _ = TaskShare.objects.filter(
            accepted=False,
            updated_at__lt=timezone.now() - timedelta(days=7)
        ).delete()

        self.stdout.write(
            self.style.SUCCESS(
                f'{deleted_count} declined shares deleted.'
            )
        )