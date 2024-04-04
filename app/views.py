"""
    views.py: Python file that holds all of the views needed to render the backend pages

    Contributors: Michelle Peters, Luis Ferrer

    Created: 10/27/2020
    Updated: 11/25/2020
"""

from rest_framework.views import APIView
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.forms import inlineformset_factory

from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password, get_password_validators

from rest_framework import viewsets, status, generics, permissions, serializers, exceptions
from rest_framework.decorators import api_view
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import JSONParser
User = get_user_model()
from .serializers import UserSerializer, TokenSerializer, VideoSerializer, TagSerializer, MessageSerializer, MessageReplySerializer, Invite_MessageSerializer, EmailSerializer, PasswordTokenSerializer, PasswordResetTokenSerializer, EmailVerificationTokenSerializer
from .models import Account, Videos, Tags, Message, MessageReply, Invite_Message, ResetPasswordToken, EmailVerificationTokenModel, clear_expired, get_password_reset_token_expiry_time, get_password_reset_lookup_field
from .signals import reset_password_token_created
from .forms import UpdateFileForm
from django.views import generic
from datetime import datetime, timedelta

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from django.conf import settings as conf_settings

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.mail import send_mail, BadHeaderError, EmailMessage
import boto3
import uuid
import json
import csv
import os
from decouple import config

from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone

from django.dispatch import receiver
from django.urls import reverse

__all__ = [
    'ValidateToken',
    'ResetPasswordConfirm',
    'ResetPasswordRequestToken',
    'reset_password_validate_token',
    'reset_password_confirm',
    'reset_password_request_token'
]

class Invite_MessageViewSet(viewsets.ModelViewSet):
    """
    A serial viewset for Invite Message models 
    """
    queryset = Invite_Message.objects.all()
    serializer_class = Invite_MessageSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated,)
    
    @action(detail=False, methods=['POST'])
    def Invite_Video_Check(self, request):
        """
        Checks if users is invited to watch the video.
        """
        videoId = request.data['videoId']
        user = request.user
        try:
            message = Message.objects.get(videoID=videoId)
            invite = Invite_Message.objects.values().filter(message=message, user=user)
            
            try:
                return JsonResponse(data=list(invite), safe=False)
            except:
                return JsonResponse({'message': 'You are not invited'}, status=status.HTTP_404_NOT_FOUND)
        except:
            return JsonResponse({'message': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)

class ResetPasswordTokenViewSet(viewsets.ModelViewSet):
    queryset = ResetPasswordToken.objects.all()
    serializer_class = PasswordResetTokenSerializer

# global invite_user
# global third_email

class MessageViewSet(viewsets.ModelViewSet):
    """
    A serial viewset for all Message models 
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated,)
    
    @action(detail=False, methods=['POST'])
    def invite_check(self, request):
        """
        Checks if users is invited to the message.
        """
        message = request.data['message']
        user = request.user
        print(message)
        message_invite = Invite_Message.objects.values().filter(message=message, user=user)
        
        if message_invite.count() == 0:
            return JsonResponse({'message': 'Not Invited'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return JsonResponse(data=list(message_invite), safe=False)

    @action(detail=False, methods=['POST'])
    def send_invite(self, request):
        """
        Sends a message invite to the user.
        """
        # data = json.loads(request.body.decode('utf-8'))
        # email = data['email']
        email = request.data['email']
        # global invite_user
        # invite_user = email
        # print(email)
        try:
            user = Account.objects.get(username__iexact=email)
            message_id = request.data['message_id']
            message = Message.objects.get(id=message_id)

            serializeMessage = MessageSerializer(message, many=False)
            serializeUser = UserSerializer(user, many=False)

            invite = Invite_Message.objects.create(user=user, message=message, is_author=False)
            serializeInvite = Invite_MessageSerializer(invite, many=False)
            response = {'message': 'invite sent', 'result': serializeInvite.data}
            return Response(response, status=status.HTTP_200_OK)
        except:
            return JsonResponse({'message': 'Account does not exist'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['POST'])
    def send_video(self, request):
        """
        Sends a message to the user with the video link and message
        """
        email = request.data['email']
        print(email)
        second_user = Account.objects.get(username__iexact=email)
        url = request.data['url']
        videoID = request.data['videoID']
        user = request.user
        username = user.username
        date = datetime.now()
        
        formatedDate = date.strftime("%Y-%m-%d %H:%M:%S")
        title = username + ' has sent a video to be tagged.'
        description ='You can access the video here:'
        
        try:
            message = Message.objects.create(user=user, receiver_email=email, description=description, title=title, author=user.username, url=url, date_created=formatedDate, videoID=videoID)
            invite_author = Invite_Message.objects.create(user=user, message=message, is_author=True)
            invite_second_user = Invite_Message.objects.create(user=second_user, message=message, is_author=False)
            serializer = MessageSerializer(message, many=False)
            response = {'message': 'Message created', 'result': serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        except:
            return JsonResponse({'message': 'Message does not exist'}, status=status.HTTP_404_NOT_FOUND)
    '''
    @action(detail=False, methods=['POST'])
    def send_email_to_third_user(self, request):
        third_email = request.data['email']
        stats_url = request.data['url']
        subject = 'A member from In Your Shoes sent you a link to their stats page'
        message = 'You can access the statistics page here: ' + stats_url + '. (You must be signed into your account to access the page).'
        email_from = conf_settings.EMAIL_HOST_USER
        recipient_list = [third_email]
        print(recipient_list)
        try:
            send_mail( subject, message, email_from, recipient_list )
            return JsonResponse({'message': 'Success! Sent stats page!'})
        except BadHeaderError:
            return HttpResponse('Invalid header found.')
    '''
    @action(detail=False, methods=['GET'])
    def user_messages(self, request):
        """
        Lists all the current users messages
        """
        user = request.user
        message_invite = Invite_Message.objects.filter(user=user)
        message_id = message_invite.values('message_id')
        message = Message.objects.values().filter(pk__in=message_id)

        try:
            return JsonResponse(data=list(message.order_by('-id')), safe=False)
        except:
            return JsonResponse({'message': 'Message does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=True, methods=['POST'])
    def reply_confirmation(self, request, pk=None):
        """
        Creates a reply to a message
        """

        message = Message.objects.get(id=pk)
        reply = 'Video tagging has been completed and is ready for viewing.'
        user = request.user
        date = datetime.now()
            
        formatedDate = date.strftime("%Y-%m-%d %H:%M:%S")
        reply = MessageReply.objects.create(user=user, message=message, content=reply, username=user.username, date_created=formatedDate)
        serializer = MessageReplySerializer(reply, many=False)
        response = {'message': 'Message reply created', 'result': serializer.data}
        return Response(response, status=status.HTTP_200_OK)
        
        
    @action(detail=True, methods=['POST'])
    def send_reply(self, request, pk=None):
        """
        Creates a reply to a message
        """
        if 'content' in request.data:
            
            message = Message.objects.get(id=pk)
            content = request.data['content']
            user = request.user
            date = datetime.now()
            
            formatedDate = date.strftime("%Y-%m-%d %H:%M:%S")
            reply = MessageReply.objects.create(user=user, message=message, content=content, username=user.username, date_created=formatedDate)
            serializer = MessageReplySerializer(reply, many=False)
            response = {'message': 'Message reply created', 'result': serializer.data}
            return Response(response, status=status.HTTP_200_OK)

        else:
            response = {'message': 'You need to provide a content for the message'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['POST'])
    def message_replys(self, request, pk=None):
        """
        Lists all the replys in the current message
        """
        
        try:
            message = Message.objects.get(id=pk)
            return JsonResponse(data=list(MessageReply.objects.values().filter(message=message)), safe=False)
        except:
            return JsonResponse({'message': 'No replys'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=['POST'])
    def video_message(self, request):
        """
        Lists all the current users messages
        """
        videoId = request.data['videoId']
        message = Message.objects.values().filter(videoID=videoId)

        try:
            return JsonResponse(data=list(message.order_by('-id')), safe=False)
        except:
            return JsonResponse({'message': 'Message does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=['POST'])
    def new_message(self, request):
        """
        Lists all the current users messages
        """
        user = request.user
        receiver_email = request.data['receiver']
        receiver_list = receiver_email.split(",")
        content = request.data['description']
        title = request.data['title']
        date = datetime.now()
            
        formatedDate = date.strftime("%Y-%m-%d %H:%M:%S")

        try:
            message = Message.objects.create(user=user, title=title, receiver_email=receiver_list, author=user.username, description=content, date_created=formatedDate)
            invite_author = Invite_Message.objects.create(user=user, message=message, is_author=True)
            for item in receiver_list:
                second_user = Account.objects.get(username__iexact=item)
                invite_second_user = Invite_Message.objects.create(user=second_user, message=message, is_author=False)
            response = {'message': 'Invites sent'}
            return Response(response, status=status.HTTP_200_OK)
        except:
            return JsonResponse({'message': 'Message does not exist'}, status=status.HTTP_404_NOT_FOUND)

class MessageReplyViewSet(viewsets.ModelViewSet):
    """
    A serial viewset for all Message Reply models 
    """
    queryset = MessageReply.objects.all()
    serializer_class = MessageReplySerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated,)
    
    def update(self, request, *args, **kwargs):
        response = {'message': 'You cant update a message like that'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        response = {'message': 'You cant create a message like that'}
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    """
    A serial viewset for all user models 
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

class EmailVerificationViewSet(viewsets.ModelViewSet):
    """
    A serial viewset for all email verification token models
    """
    queryset = EmailVerificationTokenModel.objects.all()
    serializer_class = EmailVerificationTokenSerializer
    permission_classes = (AllowAny,)

    def update(self, *args, **kwargs):
        response = {'message': "You can't update an email verification token like that"}
        return JsonResponse(response, status=status.HTTP_400_BAD_REQUEST)

    # Used for multi-tenant application (e.g. re-verifying email if email was deleted)
    def create(self, request, *args, **kwargs):
        userId = request.data['user_id']
        user = User.objects.get(id=userId)
        verification = EmailVerificationTokenModel.objects.get(user=user)
        if not verification:
            # creates verification token when an exsiting verification doesn't exist
            verification = EmailVerificationTokenModel.objects.create(user=user)

        verification.send_verification_email()
        return JsonResponse({'message': 'Verification email sent.'}, status=status.HTTP_200_OK)

    # Action to verify the email using the email token data from request
    @action(detail=False, methods=['POST'])
    def verify_email(self, request, *args, **kwargs):
        try:
            emailToken = request.data['email_token']
            emailVerification = EmailVerificationTokenModel.objects.get(email_token=emailToken)

            emailVerification.user.is_registered = True
            emailVerification.user.save()
            emailVerification.delete()
            return JsonResponse({'message': 'Email verification successful'}, status=status.HTTP_200_OK)

        except EmailVerificationTokenModel.DoesNotExist:
            return JsonResponse({'message': 'Verification token does not exist'}, status=status.HTTP_404_NOT_FOUND)

class AuthTokenObtain(ObtainAuthToken):
    """
    A serial viewset for obtaining authorization tokens
    """
    def post(self, request, *args, **kwargs):
        username_change = Account.objects.get(username__iexact=request.data['username'])
        username_email = username_change.username
        data = {"username": username_email, "password":request.data['password']}
        serializer = self.serializer_class(data=data, context={'request': request})
        # If user does not exist, return 404_NOT_FOUND status msg
        serializer.is_valid(JsonResponse({'user': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND))
        user = serializer.validated_data['user']

        # If user not registered, return forbidden status msg
        if not user.is_registered:
            return JsonResponse({'user': 'User is not registered.'}, status=status.HTTP_403_FORBIDDEN)

        # Get the token of the user and return it
        token, created = Token.objects.get_or_create(user=user)
        return JsonResponse({'token': token.key}, status= status.HTTP_200_OK)

class TokenViewSet(viewsets.ModelViewSet):
    """
    A serial viewset for all token models 
    """
    queryset = Token.objects.all()
    serializer_class = TokenSerializer

class VideoViewset(viewsets.ModelViewSet):
    """
    A serial viewset for all videos models 
    """
    queryset = Videos.objects.all()
    serializer_class = VideoSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['GET'])
    def user_videos(self, request):
        """
        All videos uploaded by logged in user
        """
        user = request.user

        try:
            return JsonResponse(data=list(Videos.objects.values().filter(userId=user.id)), safe=False)
        except Videos.DoesNotExist:
            return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=['GET'])
    def user_videos_completed(self, request):
        """
        All videos uploaded by logged in user
        """
        user = request.user

        try:
            return JsonResponse(data=list((Videos.objects.values().filter(tagger1=user.id) | Videos.objects.values().filter(tagger2=user.id)) & (Videos.objects.values().filter(tagger1Complete=True) & Videos.objects.values().filter(tagger2Complete=True))) , safe=False)
        except Videos.DoesNotExist:
            return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=True, methods=['POST'])
    def video_completed(self, request, pk=None):
        """
        All videos uploaded by logged in user
        """
        try:
            video = Videos.objects.get(id=pk)
            user = request.user
            if (user.id == video.tagger1 or user.id == video.tagger2 or user.username == video.instructor):
                try:
                    return JsonResponse(data=list(Videos.objects.values().filter(id=pk)), safe=False)
                except Videos.DoesNotExist:
                    return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return JsonResponse({'message': 'You do not have permission'}, status=status.HTTP_404_NOT_FOUND)
        except Videos.DoesNotExist:
            return JsonResponse({'message': 'Video does not exist!'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['GET'])
    def untagged_videos(self, request):
        """
        All untagged videos of given user
        """
        user = request.user

        try:
            return JsonResponse(data=list(Videos.objects.values().filter(userId=user.id) & Videos.objects.values().filter(tagger1Complete=False) & Videos.objects.values().filter(tagger2Complete=False)), safe=False)
        except Videos.DoesNotExist:
            return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['GET'])
    def pending_videos_target(self, request):
        """
        All videos where the logged in user is the first tagger, and have been tagged by the first user
        """
        user = request.user

        try:
            return JsonResponse(data=list(Videos.objects.values().filter(tagger1=user.id) & Videos.objects.values().filter(tagger1Complete=True) & Videos.objects.values().filter(tagger2Complete=False)), safe=False)
        except Videos.DoesNotExist:
            return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['GET'])
    def pending_videos_perceiver(self, request):
        """
        All videos where the logged in user is the second tagger, and have been tagged by the first user
        """
        user = request.user

        try:
            return JsonResponse(data=list(Videos.objects.values().filter(tagger2=user.id) & Videos.objects.values().filter(tagger1Complete=True) & Videos.objects.values().filter(tagger2Complete=False)), safe=False)
        except Videos.DoesNotExist:
            return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['GET'])
    def completed_videos_target(self, request):
        """
        All videos where the logged in user is the first tagger, and both taggers have completed tagging
        """
        user = request.user

        try:
            return JsonResponse(data=list(Videos.objects.values().filter(tagger1=user.id) & Videos.objects.values().filter(tagger1Complete=True) & Videos.objects.values().filter(tagger2Complete=True)), safe=False)
        except Videos.DoesNotExist:
            return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['GET'])
    def completed_videos_perceiver(self, request):
        """
        All videos where the logged in user is the second tagger, and both taggers have completed tagging
        """
        user = request.user

        try:
            return JsonResponse(data=list(Videos.objects.values().filter(tagger2=user.id) & Videos.objects.values().filter(tagger1Complete=True) & Videos.objects.values().filter(tagger2Complete=True)), safe=False)
        except Videos.DoesNotExist:
            return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['POST'])
    def third_user(self, request, pk=None):
        """
        All videos where the logged in user is the third user, and both taggers have completed tagging
        """
        # user = request.user
        third_email = request.data['email']
        video = Videos.objects.get(id=pk)
        video.instructor = third_email
        video.save()
        # self.video_completed(pk=pk)
        try:
            return JsonResponse(data=list(Videos.objects.values().filter(instructor=third_email) & Videos.objects.values().filter(tagger1Complete=True) & Videos.objects.values().filter(tagger2Complete=True)), safe=False)

        except:
            return JsonResponse({'message': 'Video does not exist!!'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['POST'])
    def download_video(self, request):
        session = boto3.Session(aws_access_key_id=config('ACCESS_KEY_ID'), aws_secret_access_key=config('SECRET_ACCESS_KEY'), region_name="us-east-2")
        s3 = session.client("s3" )
        
        key = request.data['Key']

        # Generate the URL to get 'key-name' from 'bucket-name'
        url = s3.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": "iys-storage",
                "Key": key,
            },
            ExpiresIn=120,
        )

        return Response(url)

class TagsViewset(viewsets.ModelViewSet):
    """
    A serial viewset for all tag models 
    """
    queryset = Tags.objects.all()
    serializer_class = TagSerializer
    
    @action(detail=False, methods=['POST'])
    def video_tags(self, request):
        """
        Lists all the current users messages
        """
        videoId = request.data['videoId']
        tags = Tags.objects.values().filter(videoID=videoId)

        try:
            return JsonResponse(data=list(tags.order_by('-id')), safe=False)
        except:
            return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=['POST'])
    def first_tagger(self, request):
        """
        Lists all the current users messages
        """
        videoId = request.data['videoId']
        video = Videos.objects.get(id=videoId)
        tags = Tags.objects.values().filter(userID=video.tagger1, videoID_id=videoId)

        try:
            return JsonResponse(data=list(tags.order_by('timestamp')), safe=False)
        except:
            return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=False, methods=['POST'])
    def second_tagger(self, request):
        """
        Lists all the current users messages
        """
        videoId = request.data['videoId']
        video = Videos.objects.get(id=videoId)
        tags = Tags.objects.values().filter(userID=video.tagger2, videoID_id=videoId)

        try:
            return JsonResponse(data=list(tags.order_by('timestamp')), safe=False)
        except:
            return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)


class SendEmail(APIView):
    """
    Define the API view for sending and email
    """
    def post(self, request):
        # Get the value of the email received
        email = request.data['email']
        url = request.data['url']
        # global invite_user
        # invite_user = request.data['invite_email']
        subject = 'A member from In Your Shoes sent you a link to their video'
        message = 'You can access the video here: ' + url + '. (You must be signed into your account to access the video).' 
        email_from = conf_settings.EMAIL_HOST_USER
        recipient_list = [email]
        try:
            send_mail( subject, message, email_from, recipient_list )
            return JsonResponse({'message': 'Success!'})
        except BadHeaderError:
            return HttpResponse('Invalid header found.')

class SendConfirmationEmail(APIView):
    """
    Define the API view for sending and email
    """
    def post(self, request):
        # Get the value of the email received
        email = request.data['email']

        subject = 'Video tagging has been completed'
        message = 'A video you have sent another user for tagging has been completed and is ready for viewing.' 
        email_from = conf_settings.EMAIL_HOST_USER
        recipient_list = [email]
        send_mail( subject, message, email_from, recipient_list )
        return JsonResponse({'message': 'Success!'})

class GetDownloadURL(APIView):
    """
    Define the API view for sending and email
    """
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        # Get the service client.
        session = boto3.Session(aws_access_key_id=config('ACCESS_KEY_ID'), aws_secret_access_key=config('SECRET_ACCESS_KEY'), region_name="us-east-2")
        s3 = session.client("s3" )

        # Generate the URL to get 'key-name' from 'bucket-name'
        url = s3.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": "iys-storage",
                "Key": uuid.uuid4().hex[:32].upper(),
            },
            ExpiresIn=120,
        )

        return Response(url)

    # Delete the requested file from the s3 bucket
    def delete(self, request):
        
        session = boto3.Session(aws_access_key_id=config('ACCESS_KEY_ID'), aws_secret_access_key=config('SECRET_ACCESS_KEY'), region_name="us-east-2")
        s3 = session.client("s3" )

        # Parse the json body received from fetch request
        body = json.loads(request.body.decode('utf-8'))
        # Get the value of the key received
        key = body.get("keyString")
        # Use received key to delete that object from s3 bucket
        s3.delete_object(Bucket='iys-storage', Key=key)

        return Response({key}, status=status.HTTP_200_OK)


class SendThirdUserEmail(APIView):
    """
    Define the API view for sending stats page to third user
    """
    def post(self, request):
        # global third_email
        third_email = request.data['email']
        csv_reader = request.data['csv_file']
        keys = csv_reader[0].keys()

        with open('shows.csv', 'w', newline='') as f:
            dict_writer = csv.DictWriter(f, keys)
            dict_writer.writeheader()
            dict_writer.writerows(csv_reader)
        subject = 'A member from In Your Shoes sent you their CSV Report'
        message = 'You can access the report here:'

        email_from = conf_settings.EMAIL_HOST_USER
        recipient_list = [third_email]

        msg = EmailMessage(subject, message, email_from, recipient_list)

        with open('shows.csv', 'r', newline='') as f:
            msg.attach('Tags_sample.csv', f.read(), 'text/csv')
        file = 'shows.csv'
        # msg.send()

        try:
            msg.send()
            if (os.path.exists(file) and os.path.isfile(file)):
                os.remove(file)
                print("file deleted")
            # send_mail( subject, message, email_from, recipient_list )
            return JsonResponse({'message': 'Success! Sent stats page!'})
        except BadHeaderError:
            return HttpResponse('Invalid header found.')

class ResetPasswordValidateToken(GenericAPIView):
    """
    An Api View which provides a method to verify that a token is valid
    """
    throttle_classes = ()
    permission_classes = ()
    serializer_class = PasswordResetTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data['token']

        # get token validation time
        password_reset_token_validation_time = get_password_reset_token_expiry_time()

        # find token
        reset_password_token = ResetPasswordToken.objects.filter(key=token).first()

        if reset_password_token is None:
            return Response({'status': 'notfound'}, status=status.HTTP_404_NOT_FOUND)

        # check expiry date
        expiry_date = reset_password_token.created_at + timedelta(hours=password_reset_token_validation_time)

        if timezone.now() > expiry_date:
            # delete expired token
            reset_password_token.delete()
            return Response({'status': 'expired'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'status': 'OK'})


class ResetPasswordConfirm(GenericAPIView):
    """
    An Api View which provides a method to reset a password based on a unique token
    """
    throttle_classes = ()
    permission_classes = ()
    serializer_class = PasswordTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = serializer.validated_data['password']
        token = serializer.validated_data['token']

        # get token validation time
        password_reset_token_validation_time = get_password_reset_token_expiry_time()

        # find token
        reset_password_token = ResetPasswordToken.objects.filter(key=token).first()

        if reset_password_token is None:
            return Response({'status': 'notfound'}, status=status.HTTP_404_NOT_FOUND)

        # check expiry date
        expiry_date = reset_password_token.created_at + timedelta(hours=password_reset_token_validation_time)

        if timezone.now() > expiry_date:
            # delete expired token
            reset_password_token.delete()
            return Response({'status': 'expired'}, status=status.HTTP_404_NOT_FOUND)

        # change users password (if we got to this code it means that the user is_active)
        if reset_password_token.user.eligible_for_reset():
            try:
                # validate the password against existing validators
                validate_password(
                    password,
                    user=reset_password_token.user,
                    password_validators=get_password_validators(conf_settings.AUTH_PASSWORD_VALIDATORS)
                )
            except ValidationError as e:
                # raise a validation error for the serializer
                raise exceptions.ValidationError({
                    'password': e.messages
                })

            reset_password_token.user.set_password(password)
            reset_password_token.user.save()

        # Delete all password reset tokens for this user
        ResetPasswordToken.objects.filter(user=reset_password_token.user).delete()

        return Response({'status': 'OK'})


class ResetPasswordRequestToken(GenericAPIView):
    """
    An Api View which provides a method to request a password reset token based on an e-mail address

    Sends a signal reset_password_token_created when a reset token was created
    """
    throttle_classes = ()
    permission_classes = ()
    serializer_class = EmailSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        # before we continue, delete all existing expired tokens
        password_reset_token_validation_time = get_password_reset_token_expiry_time()

        # datetime.now minus expiry hours
        now_minus_expiry_time = timezone.now() - timedelta(hours=password_reset_token_validation_time)

        # delete all tokens where created_at < now - 24 hours
        clear_expired(now_minus_expiry_time)

        # find a user by email address (case insensitive search)
        users = User.objects.filter(**{'{}__iexact'.format(get_password_reset_lookup_field()): email})

        active_user_found = False

        # iterate over all users and check if there is any user that is active
        # also check whether the password can be changed (is useable), as there could be users that are not allowed
        # to change their password (e.g., LDAP user)
        for user in users:
            if user.eligible_for_reset():
                active_user_found = True

        # No active user found, raise a validation error
        # but not if DJANGO_REST_PASSWORDRESET_NO_INFORMATION_LEAKAGE == True
        if not active_user_found and not getattr(conf_settings, 'DJANGO_REST_PASSWORDRESET_NO_INFORMATION_LEAKAGE', False):
            raise exceptions.ValidationError({
                'email': [_(
                    "There is no active user associated with this e-mail address or the password can not be changed")],
            })

        # last but not least: iterate over all users that are active and can change their password
        # and create a Reset Password Token and send a signal with the created token
        for user in users:
            if user.eligible_for_reset():
                # define the token as none for now
                token = None

                # check if the user already has a token
                if user.password_reset_tokens.all().count() > 0:
                    # yes, already has a token, re-use this token
                    token = user.password_reset_tokens.all()[0]
                else:
                    # no token exists, generate a new token
                    token = ResetPasswordToken.objects.create(
                        user=user,
                        user_agent=request.META.get(conf_settings.HTTP_USER_AGENT_HEADER, ''),
                        ip_address=request.META.get(conf_settings.HTTP_IP_ADDRESS_HEADER, ''),
                    )
                # send a signal that the password token was created
                # let whoever receives this signal handle sending the email for the password reset
                reset_password_token_created.send(sender=self.__class__, instance=self, reset_password_token=token)
        # done
        return Response({'status': 'OK'})


reset_password_validate_token = ResetPasswordValidateToken.as_view()
reset_password_confirm = ResetPasswordConfirm.as_view()
reset_password_request_token = ResetPasswordRequestToken.as_view()

def Home(request):
    user_list = Account.objects.order_by('-first_name')
    context = {'user_list': user_list}
    return render(request, 'app/Home.html', context)

def user_prof(request, id):
    context = {}
    context["data"] = User.objects.get(id = id)
    return render(request, "app/Profile.html", context)

def update_view(request, id):
    context = {}
    obj = get_object_or_404(User, id = id)
    form = UpdateFileForm(request.POST or None, instance=obj)

    if form.is_valid():
        form.save()

    context["form"] = form
    return render(request, "app/update_view.html", context)


@api_view(['GET', 'PUT', 'POST'])
def user_prof_api(request, user_id):
    """
    API view that fetches and updates a single user instance
    """
    try:
        user = Account.objects.get(pk=user_id)
    except Account.DoesNotExist:
        return JsonResponse({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET': 
        user_serializer = UserSerializer(user)
        print(user_serializer.data)
        return JsonResponse(user_serializer.data)

    elif request.method == 'PUT':
        user_data = JSONParser().parse(request)
        user_serializer = UserSerializer(user, user_data)
        print(user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse(user_serializer.data)
        return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST', 'DELETE'])
def user_list_api(request):
    """
    A backup API if the REST variant is not functioning correctly
    """
    if request.method == 'GET':
        users = Account.objects.all()
        uid = request.GET.get('id', None)

        if uid is not None:
            users = users.filter(last_name__icontains=uid)
        
        user_serializer = UserSerializer(users, many=True)
        return JsonResponse(user_serializer.data, safe=False)

def upload_file(request):
    if request.method == 'POST':
       
       title = request.POST['title']
       video = request.POST['video']

       content = Videos(title=title, video=video)
       content.save()
       return redirect('Home')

    return render(request, 'app/upload.html')

def display(request):
    videos = Videos.objects.all()

    context = {
        'videos':videos,
    }

    return render (request, 'app/videos.html', context)

# Return all videos uploaded by tagger1 that are untagged as a JSON list
@api_view(['GET', 'PUT', 'POST'])
def user_videos(request, user_id):
    """
    Perform GET, PUT and POST API actions on all videos that
    share the same user id
    @param user_id accept an integer as a user id
    """
    try:
        return JsonResponse(data=list(Videos.objects.values().filter(tagger1=user_id)), safe=False)
    except Videos.DoesNotExist:
        return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'PUT', 'POST'])
def untagged_videos(self, request):
    """
    Primarily list videos that have not been marked as tagged
    """

    try:
        return JsonResponse(data=list(Videos.objects.values().filter(userId=user.id) & Videos.objects.values()
        .filter(tagger1Complete=False) & Videos.objects.values().filter(tagger2Complete=False)), safe=False)
    except Videos.DoesNotExist:
        return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'PUT', 'POST'])
def pending_videos_target(request, user_id):
    """
    Perform GET, PUT and POST API actions on all videos that
    share the same user id
    @param user_id accept an integer as a user id
    """
    try:
        return JsonResponse(data=list(Videos.objects.values().filter(tagger1=user_id) & Videos.objects.values()
        .filter(tagger1Complete=True) & Videos.objects.values().filter(tagger2Complete=False)), safe=False)
    except Videos.DoesNotExist:
        return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'PUT', 'POST'])
def pending_videos_perceiver(request, user_id):
    """
    Perform GET, PUT and POST API actions on all videos that
    share the same user id
    @param user_id accept an integer as a user id
    """
    try:
        return JsonResponse(data=list(Videos.objects.values().filter(tagger2=user_id) & Videos.objects.values()
        .filter(tagger1Complete=True) & Videos.objects.values().filter(tagger2Complete=False)), safe=False)
    except Videos.DoesNotExist:
        return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'PUT', 'POST'])
def completed_videos_target(request, user_id):
    """
    Perform GET, PUT and POST API actions on all videos that
    share the same user id
    @param user_id accept an integer as a user id
    """
    try:
        return JsonResponse(data=list(Videos.objects.values().filter(tagger1=user_id) & Videos.objects.values()
        .filter(tagger1Complete=True) & Videos.objects.values().filter(tagger2Complete=True)), safe=False)
    except Videos.DoesNotExist:
        return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'PUT', 'POST'])
def completed_videos_perceiver(request, user_id):
    """
    Perform GET, PUT and POST API actions on all videos that
    share the same user id
    @param user_id accept an integer as a user id
    """
    try:
        return JsonResponse(data=list(Videos.objects.values().filter(tagger2=user_id) & Videos.objects.values()
        .filter(tagger1Complete=True) & Videos.objects.values().filter(tagger2Complete=True)), safe=False)
    except Videos.DoesNotExist:
        return JsonResponse({'message': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)

# @api_view(['GET', 'PUT', 'POST'])
# def third_user(request):
#     """
#     Perform GET, PUT and POST API actions on all videos that
#     share the same user id
#     @param user_id accept an integer as a user id
#     """
#     try:
#         return HttpResponse("OK...kinda working now...Not template")
#         # return JsonResponse(data=list(Videos.objects.values().filter(instructor=user_id) & Videos.objects.values()
#         # .filter(tagger1Complete=True) & Videos.objects.values().filter(tagger2Complete=True)), safe=False)
#     except Videos.DoesNotExist:
#         return JsonResponse({'message': 'No permission!'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'PUT', 'POST'])
def tag_api_view(request):
    """
    Perform GET, PUT and POST API actions on all tag objects
    and list them as JSON format
    """
    if request.method == 'GET':
        tags = Tags.objects.all()
        tid = request.GET.get('id', None)

        if tid is not None:
            users = users.filter(comment__icontains=tid)
        
        tag_serializer = TagSerializer(tags, many=True)
        return JsonResponse(tag_serializer.data, safe=False)

@api_view(['GET', 'PUT', 'POST'])
def video_tags_api(request, vid_id, uid):
    """
    Perform GET, PUT and POST API actions on all tag objects
    that share the same user and video id and list in JSON
    @param uid accept an integer as a user id
    """
    try:
        return JsonResponse(data=list(Tags.objects.values().filter(videoID=vid_id, userID=uid).order_by('timestamp')), safe=False)
    except Videos.DoesNotExist:
        return JsonResponse({'message': 'Video Instance does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'PUT', 'POST'])
def tag_instance(request, tag_id):
    """
    Perform GET, PUT and POST API actions on a single tag object
    @param tag_id accept an integer as a tag_id
    """
    
    try:
        tag = Tags.objects.get(pk=tag_id)
    except Tags.DoesNotExist:
        return JsonResponse({'message': 'Tag does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        tag_serializer = TagSerializer(tag)
        return JsonResponse(tag_serializer.data)

    elif request.method == 'PUT':
        tag_data = JSONParser().parse(request)
        tag_serializer = TagSerializer(tag, tag_data)
        if tag_serializer.is_valid():
            tag_serializer.save()
            return JsonResponse(tag_serializer.data)
        return JsonResponse(tag_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'POST'])
def user_email(request, email):
    """
    Return userId corresponding to given email address
    """
    try:
        return JsonResponse(User.objects.values().get(username__iexact=email))
    except:
        return JsonResponse({'message': 'User with given email does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def email_registration_check(request, email, *args, **kwargs):

    Account.objects.get(pk=email)
    return JsonResponse({'token': token.key}, status= status.HTTP_200_OK)

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """

    # Get the user object
    userToReset = reset_password_token.user

    # Get the name and email of the user and create an url from it.
    email = userToReset.username
    url = "{}/Reset-password/{}".format(config('REACT_APP_FRONTEND_URL'), reset_password_token.key)

    subject = 'Reset email for your In-Your-Shoes Account'
    message = 'You can reset your password at: ' + url + ' (See password validation in the training portal).' 
    email_from = conf_settings.EMAIL_HOST_USER
    recipient_list = [email]
    try:
        send_mail( subject, message, email_from, recipient_list )
        return JsonResponse({'message': 'Success!'})
    except BadHeaderError:
        return HttpResponse('Invalid header found.')
