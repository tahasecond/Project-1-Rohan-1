# Generated by Django 5.1.5 on 2025-02-15 03:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0012_userprofile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='wallet',
            field=models.DecimalField(decimal_places=2, default=10.0, max_digits=10),
        ),
    ]
