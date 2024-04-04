"""
    urls.py: Python file that holds all of the url patterns needed for the app folder to function

    Contributors: Michelle Peters, Luis Ferrer

    Created: 10/27/2020
    Updated: 11/24/2020
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from django.conf.urls.static import static
from django.conf import settings

from rest_framework import routers
from .views import UserViewSet, display, TokenViewSet, VideoViewset, user_prof, update_view, TagsViewset, EmailVerificationViewSet, GetDownloadURL, tag_api_view, video_tags_api, tag_instance, MessageViewSet, MessageReplyViewSet, Invite_MessageViewSet, ResetPasswordTokenViewSet, reset_password_request_token, reset_password_confirm, reset_password_validate_token
from . import views

# Register the REST APIs
router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('tokens', TokenViewSet)
router.register('videos', VideoViewset)
router.register('tags', TagsViewset)
router.register('messages', MessageViewSet)
router.register('replys', MessageReplyViewSet)
router.register('invite_messages', Invite_MessageViewSet)
router.register('reset_password_token', ResetPasswordTokenViewSet)
router.register('email_verify', EmailVerificationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('password_reset/validate_token/', reset_password_validate_token, name="reset-password-validate"),
    path('password_reset/confirm/', reset_password_confirm, name="reset-password-confirm"),
    path('password_reset/', reset_password_request_token, name="reset-password-request"),
    path('Home/', views.Home, name="Home"),
    path('Home/api/', views.user_list_api, name="user_list_api"),
    path('Home/api/<int:user_id>/', views.user_prof_api, name="user_api"),
    path('Home/user_videos/<int:user_id>/', views.user_videos, name="user_videos"),
    path('Home/untagged_videos/<int:user_id>/', views.untagged_videos, name="untagged_videos"),
    path('Home/pending_videos_target/<int:user_id>/', views.pending_videos_target, name="pending_videos_target"),
    path('Home/pending_videos_perceiver/<int:user_id>/', views.pending_videos_perceiver, name="pending_videos_perceiver"),
    path('Home/completed_videos_perceiver/<int:user_id>/',views.completed_videos_perceiver, name="completed_videos_perceiver"),
    path('Home/completed_videos_target/<int:user_id>/',views.completed_videos_target, name="completed_videos_target"),
    # path('Home/third_user/',views.third_user, name="third_user"),
    path('<int:id>/', views.user_prof),
    path('<int:id>/update', views.update_view),
    path('Home/downloadURL/', views.GetDownloadURL.as_view(), name='downloadURL'),
    path('Home/sendEmail/', views.SendEmail.as_view(), name='sendEmail'),
    path('Home/sendConfirmationEmail/', views.SendConfirmationEmail.as_view(), name="sendConfirmationEmail"),
    path('Home/sendEmailThirdUser/', views.SendThirdUserEmail.as_view(), name='sendEmailThirdUser'),
    path('Home/api/vid_tags/<int:vid_id>/uid/<int:uid>/', views.video_tags_api, name="vid_tags"),
    path('Home/api/tag/<int:tag_id>/', views.tag_instance, name="tag_instance"),
    path('Home/api/user_email/<str:email>/', views.user_email, name="user_email"),
]

urlpatterns  += static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

