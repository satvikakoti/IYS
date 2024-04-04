"""
    serializers.py: Python file that holds all serializers needed for JSON formatting

    Contributors: Michelle Peters, Luis Ferrer

    Created: 10/27/2020
    Updated: 11/24/2020
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework.authtoken.models import Token
from .models import Videos, Tags, Message, MessageReply, Invite_Message, EmailVerificationTokenModel
from django.utils.translation import ugettext_lazy as _

# for rest framework, supplies json data for api
class UserSerializer(serializers.ModelSerializer):
    """
    User serializer. Model refers to the django model to serialize.
    The fields refer to the which parameters the model will display in the REST api.
    extra_kwargs: Hide plaintext password
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'organization', 'password', 'is_admin', 'is_active']
        #hide password
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        # adds token to every user
        Token.objects.create(user=user)
        emailVerify = EmailVerificationTokenModel.objects.create(user=user)
        emailVerify.send_verification_email()
        # user.send_verification_email(Token.objects.get(user=user))
        return user

    # custom update method needed to use validated password
    def update(self, instance, validated_data):
        user = super().update(instance, validated_data)
        try:
            user.set_password(validated_data['password'])
            user.save()
        except KeyError:
            pass
        return user

class TokenSerializer(serializers.ModelSerializer):
    """
    Token serializer. Model refers to the django model to serialize.
    The fields refer to the which parameters the model will display in the REST api.
    """
    class Meta:
        model = Token
        fields = ['key', 'user']

class EmailVerificationTokenSerializer(serializers.ModelSerializer):
    """
    Password Verification Token serializer. Model refers to the django model to serialize.
    The fields refer to the which parameters the model will display in the REST api.
    """
    class Meta:
        model = EmailVerificationTokenModel
        fields = ['email_token', 'user']

class VideoSerializer(serializers.ModelSerializer):
    """
    Video serialier. Model refers to the django model to serializer.
    The fields refer to the which parameters the model will display in the REST api.
    """
    class Meta:
        model = Videos
        fields = ['id', 'userId', 'title', 'url', 'tagger1', 'tagger2', 'tagger1Complete', 'tagger2Complete', 'message', 'author']

class TagSerializer(serializers.ModelSerializer):
    """
    Tag serializer. Model refers to the django model to serialize.
    The fields refer to the which parameters the model will display in the REST api.
    """
    class Meta:
        model = Tags
        fields = ['id','userID','videoID','thought_choice', 'tone', 'context', 'comment' ,'timestamp', 'score']

class MessageSerializer(serializers.ModelSerializer):
    """
    Message serializer. Model refers to the django model to serialize.
    The fields refer to the which parameters the model will display in the REST api.
    """
    class Meta:
        model = Message
        fields = ['id', 'title', 'description', 'user', 'receiver_email', 'date_created', 'author', 'url', 'videoID']

class MessageReplySerializer(serializers.ModelSerializer):
    """
    Message reply serializer. Model refers to the django model to serialize.
    The fields refer to the which parameters the model will display in the REST api.
    """
    class Meta:
        model = MessageReply
        fields = ['id', 'content', 'user', 'message', 'date_created', 'username']
        
class Invite_MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for message invites
    """
    class Meta:
        model = Invite_Message
        fields = ['id', 'user', 'message', 'is_author']
    
__all__ = [
    'EmailSerializer',
    'PasswordTokenSerializer',
    'PasswordResetTokenSerializer',
]


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordTokenSerializer(serializers.Serializer):
    password = serializers.CharField(label=_("Password"), style={'input_type': 'password'})
    token = serializers.CharField()

class PasswordResetTokenSerializer(serializers.Serializer):
    token = serializers.CharField()
