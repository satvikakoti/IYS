
from django import forms
from .models import Account

class UpdateFileForm (forms.ModelForm):
   class Meta:
       model = Account

       fields = [
           "username",
           "first_name",
           "last_name",
           "organization",
       ]

