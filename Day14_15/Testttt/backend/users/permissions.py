from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    """
    Cho phép truy cập nếu user có role là ADMIN.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'ADMIN')

class IsCreatorRole(permissions.BasePermission):
    """
    Cho phép truy cập nếu user có role là CREATOR.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'CREATOR')
