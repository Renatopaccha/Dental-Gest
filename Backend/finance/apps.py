from django.apps import AppConfig


class FinanceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'finance'
    verbose_name = 'Finanzas'

    def ready(self):
        """Registrar signals cuando la app esté lista."""
        import finance.signals  # noqa: F401
