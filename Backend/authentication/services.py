from authentication.models import User
from organizations.models import Organization


def register_user(data):
    organization = (
        Organization.objects.create(name=data["company_name"]))

    user = User.objects.create_user(
        username=data["username"],email=data["email"],
        password=data["password"],organization=organization,
        role="OWNER"
    )

    return user