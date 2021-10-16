from django.db import models

# Create your models here.
class User(models.Model):
    date = models.DateField(blank=False)
    name = models.CharField(max_length=255, blank=False)
    email = models.EmailField(max_length = 255, blank=False)
    image = models.ImageField(upload_to ='./uploads/images/')
    pdf = models.FileField(upload_to ='./uploads/files/')

    def __str__(self):
        return f"{self.date}: {self.name}"

    class Meta:
        ordering = ["-id"]