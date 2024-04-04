import django.dispatch

__all__ = [
    'reset_password_token_created',
    'pre_password_reset',
    'post_password_reset',
]

# Signal used to create a password reset
reset_password_token_created = django.dispatch.Signal(
    providing_args=["instance", "reset_password_token"],
)

# Unused signals for before and after password resets
pre_password_reset = django.dispatch.Signal(providing_args=["user"])
post_password_reset = django.dispatch.Signal(providing_args=["user"])
