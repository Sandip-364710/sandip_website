from django.contrib import admin
from .models import HomeView,AboutView,ServiceView,Contact,SkillsView
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

admin.site.register(HomeView)
admin.site.register(AboutView)
admin.site.register(ServiceView)
admin.site.register(Contact)
admin.site.register(SkillsView)

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'is_staff', 'is_active']
    ordering = ['email']
    search_fields = ['email']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )

admin.site.register(CustomUser, CustomUserAdmin)


# Register your models here.
