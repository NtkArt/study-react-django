# Generated by Django 3.1.5 on 2021-01-12 19:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_auto_20210112_1938'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.IntegerField(auto_created=True, blank=True, primary_key=True, serialize=False, unique=True),
        ),
    ]
