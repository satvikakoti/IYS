"""
    models.py: Python file that holds all of the models necessary for structuring data

    Contributors: Michelle Peters, Luis Ferrer

    Created: 10/27/2020
    Updated: 11/24/2020
"""

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import get_user_model
from decouple import config
from django.core.mail import send_mail, BadHeaderError
from django.conf import settings as conf_settings

from app.tokens import get_token_generator

# 
class MyAccountManager(BaseUserManager):
    """
    Creates the user using abstract base user
    """
    # creates regular user
    def create_user(self, username, first_name, last_name, organization=None, password=None):
        """
        Function that will create a regular user
        @role the role that will be used to determine control and access of data. (For future use)
        """
        if not username:
            raise ValueError("Users must have an email address")

        user =  self.model(
                username        = self.normalize_email(username),
                first_name      = first_name,
                last_name       = last_name,
                organization    = organization,
        )

        if organization is not None:
            print(organization)
        user.set_password(password)
        user.save(using=self._db)
        return user

    # creates super user
    def create_superuser(self, username, password):
        """
        Function that will create a super user
        @self used to refer to the object itself
        @username the email provided
        """
        user = self.create_user(
            username           = self.normalize_email(username),
            first_name      = "admin",
            last_name       = "admin",
            organization    = "admin",
            password        = password,
        )
        user.is_admin       = True
        user.is_staff       = True
        user.is_superuser   = True
        user.save(using=self._db)
        return user


class Account(AbstractBaseUser):
    """
    Outline for user objects to be created
    first_name, last_name, organization, role and username will take
    chars as inputs with the username (an email field) having larger limit of chars and must be unique.
    is_admin, is_active, is_staff, is_superuser determine control level with all but is_active set to true
    """
    first_name      = models.CharField(max_length=30)
    last_name       = models.CharField(max_length=30, default="")
    organization    = models.CharField(max_length=30, default=None)
    username        = models.EmailField(verbose_name="username", max_length=60, unique=True)
    is_registered   = models.BooleanField(default=False)
    # fields required to make custom user model
    date_joined     = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    last_login      = models.DateTimeField(verbose_name='last login', auto_now=True)
    is_admin        = models.BooleanField(default=False)
    is_active       = models.BooleanField(default=True)
    is_staff        = models.BooleanField(default=False)
    is_superuser    = models.BooleanField(default=False)
    
    # field used for login system username
    USERNAME_FIELD = 'username'

    objects = MyAccountManager()

    def __str__(self):
        return self.username

    # permissions that must be set
    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

class Videos(models.Model):
    """
    A custom video model. Title and url will take chars with the url having a max limit of 500.
    Tagger1 and Tagger2 refer to the two users who mark tag instances of the video, both will use an int.
    Tagger1Complete and Tagger2Complete take booleans.
    """
    userId          = models.IntegerField(default=0)
    title           = models.CharField(max_length=100, default="")
    url             = models.CharField(max_length=500, default="")
    tagger1         = models.IntegerField(default=0)
    tagger2         = models.IntegerField(default=0)
    instructor      = models.EmailField(verbose_name="third_user", default=None, max_length=60)
    tagger1Complete = models.BooleanField(default=False)
    tagger2Complete = models.BooleanField(default=False)
    author = models.EmailField(verbose_name="username", default=None, max_length=60)
    message = models.IntegerField(default=0, blank=True, null=True)
    # tags    = models.ManyToOneRel()

    class Meta:
        verbose_name = 'video'
        verbose_name_plural = 'videos'

    def __str__(self):
        return self.title

class Tags(models.Model):
    """
    Model that defines a Tag user. User and video ID will take an int.
    thought_choice, tone and context are limited to the enumerations given.
    Comment will take chars with a max limit of 600 and timestamp will take a float field
    """

    # Thought/Feeling constants
    THOUGHT = "TH"
    FEELING = "FE"

    # Tone constants
    TONE_POSITIVE = 'POS'
    TONE_NEGATIVE = 'NEG'
    TONE_NEUTRAL = 'NEU'

    # Context constants
    SELF = 'SLF'
    DIA_PARTNER = 'DPT'
    THIRD_PARTY = 'OPP'
    CURRENT_CONTEXT = 'CTX'
    OTHER_EVENT = 'OEC'

    # Thought/Feeling Enumeration
    THOUGHT_PATTERN = (
        (THOUGHT, 'Thought'),
        (FEELING, 'Feeling')
    )

    # Tone Enumeration
    TONE_CHOICE = (
        (TONE_POSITIVE, 'Positive'),
        (TONE_NEGATIVE, 'Negative'),
        (TONE_NEUTRAL, 'Neutral')
    )

    # Context Enumeration
    CONTEXT_CHOICES = (
        (SELF , 'Self'),
        (DIA_PARTNER , 'Dialogue Partner'),
        (THIRD_PARTY , 'Other Person or Persons'),
        (CURRENT_CONTEXT , 'Current Context'),
        (OTHER_EVENT , 'Other Event or Circumstance')
    )

    userID = models.IntegerField(default=0)
    videoID = models.ForeignKey(Videos, on_delete=models.CASCADE)
    thought_choice = models.CharField(choices=THOUGHT_PATTERN, max_length=2)
    tone = models.CharField(choices=TONE_CHOICE, max_length=3)
    context = models.CharField(choices=CONTEXT_CHOICES, max_length=3)
    comment = models.CharField(max_length=600, default="")
    timestamp = models.FloatField(default=0, max_length=6)
    score = models.IntegerField(default=None, blank=True, null=True)

    def __str__(self):
        return self.context

class Message(models.Model):
    """
    Model that defines a Message that will be sent to a user.
    """
    title = models.CharField(max_length=100, default="")
    description = models.TextField(max_length=360, default="")
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    receiver_email = models.EmailField(max_length=60)
    date_created = models.CharField(max_length=100, default="")
    author = models.EmailField(verbose_name="username", default=None, max_length=60)
    url = models.URLField(default=None, blank=True, null=True)
    videoID = models.IntegerField(default=0, blank=True, null=True)

    def __str__(self):
        return self.title

class MessageReply(models.Model):
    """
    Model that defines a Message reply that will reply to a message.
    """
    content = models.TextField(max_length=360, default="")
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    date_created = models.CharField(max_length=100, default="")
    username = models.EmailField(verbose_name="username", max_length=60)
    
    def __str__(self):
        return self.content

class Invite_Message(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    is_author = models.BooleanField(default=False)
    

# get the token generator class
TOKEN_GENERATOR_CLASS = get_token_generator()

__all__ = [
    'ResetPasswordToken',
    'get_password_reset_token_expiry_time',
    'get_password_reset_lookup_field',
    'clear_expired',
]

class EmailVerificationTokenModel(models.Model):
    """
    Model that defines how email is verified before using the account.
    """
    # Key Generation is the same as forgot password reset token model
    @staticmethod
    def generate_key():
        """ generates a pseudo random code using os.urandom and binascii.hexlify """
        return TOKEN_GENERATOR_CLASS.generate_token()
    
    email_token = models.CharField(max_length=110, db_index=True, unique=True)
    user = models.ForeignKey(Account, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not self.email_token:
            self.email_token = self.generate_key()
        return super(EmailVerificationTokenModel, self).save(*args, **kwargs)

    # Method to send the verification email.
    def send_verification_email(self):
        email = self.user.username

        url = "{}/Email-verification/{}".format(config('REACT_APP_FRONTEND_URL'), self.email_token)
        subject = 'Please verify your In-Your-Shoes Account'
        message = 'Confirm your email at: ' + url + ' .' 
        email_from = conf_settings.EMAIL_HOST_USER
        recipient_list = [email]
        try:
            send_mail( subject, message, email_from, recipient_list )
        except BadHeaderError:
            return HttpResponse('Invalid header found.')

    def __str__(self):
        return self.content

#>>> Obtained from django-rest-passwordreset pip module
class ResetPasswordToken(models.Model):
    """
    Model that defines how users can reset their passwords.
    
    """

    # Method to generate a 100-110 char token key
    @staticmethod
    def generate_key():
        """ generates a pseudo random code using os.urandom and binascii.hexlify """
        return TOKEN_GENERATOR_CLASS.generate_token()

    user = models.ForeignKey(
        Account,
        related_name='password_reset_tokens',
        on_delete=models.CASCADE,
        verbose_name=_("The User which is associated to this password reset token")
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("When was this token generated")
    )

    # Key field, though it is not the primary key of the model
    key = models.CharField(
        max_length=110,
        db_index=True,
        unique=True
    )

    ip_address = models.GenericIPAddressField(
        default="",
        blank=True,
        null=True,
    )
    user_agent = models.CharField(
        max_length=256,
        verbose_name=_("HTTP User Agent"),
        default="",
        blank=True,
    )

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        return super(ResetPasswordToken, self).save(*args, **kwargs)

    def __str__(self):
        return "Password reset token for user {user}".format(user=self.user)


def get_password_reset_token_expiry_time():
    """
    Returns the password reset token expirty time in hours (default: 24)
    Set Django SETTINGS.DJANGO_REST_MULTITOKENAUTH_RESET_TOKEN_EXPIRY_TIME to overwrite this time
    :return: expiry time
    """
    # get token validation time
    return getattr(settings, 'DJANGO_REST_MULTITOKENAUTH_RESET_TOKEN_EXPIRY_TIME', 24)

def get_password_reset_lookup_field():
    """
    Returns the password reset lookup field (default: email)
    Set Django SETTINGS.DJANGO_REST_LOOKUP_FIELD to overwrite this time
    :return: lookup field
    """
    return getattr(settings, 'DJANGO_REST_LOOKUP_FIELD', 'email')

def clear_expired(expiry_time):
    """
    Remove all expired tokens
    :param expiry_time: Token expiration time
    """
    ResetPasswordToken.objects.filter(created_at__lte=expiry_time).delete()

def eligible_for_reset(self):
    if not self.is_active:
        # if the user is active we dont bother checking
        return False
 
    if getattr(settings, 'DJANGO_REST_MULTITOKENAUTH_REQUIRE_USABLE_PASSWORD', True):
        # if we require a usable password then return the result of has_usable_password()
        return self.has_usable_password()
    else:
        # otherwise return True because we dont care about the result of has_usable_password()
        return True

# add eligible_for_reset to the user class
UserModel = get_user_model()
UserModel.add_to_class("eligible_for_reset", eligible_for_reset)

#<<<
