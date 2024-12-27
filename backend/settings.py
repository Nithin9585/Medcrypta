import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
  dsn="your-sentry-dsn",
  integrations=[DjangoIntegration()],
)
