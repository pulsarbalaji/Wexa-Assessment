from rest_framework.views import (
    APIView
)

from rest_framework.response import (
    Response
)

from rest_framework.permissions import (
    IsAuthenticated
)

from .serializers import (
    OrganizationSerializer
)


class OrganizationAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request
    ):

        serializer = (
            OrganizationSerializer(
                request.user.organization
            )
        )

        return Response(
            serializer.data
        )

    def patch(
        self,
        request
    ):

        serializer = (
            OrganizationSerializer(
                request.user.organization,
                data=request.data,
                partial=True
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            serializer.data
        )