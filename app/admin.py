
r"""
    admin.py: Python file that holds all of the url patterns needed for the app folder to function

    Contributors: Michelle Peters, Luis Ferrer

    Created: 10/27/2020
    Updated: 11/24/2020
"""

from django.contrib import admin

from app.models import Account
from .models import Account, Videos, Tags, Message, MessageReply, Invite_Message, ResetPasswordToken

admin.site.register(Videos)
admin.site.register(Account)
admin.site.register(Tags)
admin.site.register(Message)
admin.site.register(MessageReply)
admin.site.register(Invite_Message)
admin.site.register(ResetPasswordToken)
