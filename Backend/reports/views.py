from rest_framework.views import (
    APIView
)

from rest_framework.response import (
    Response
)

from rest_framework.permissions import (
    IsAuthenticated
)

from rest_framework import (
    status
)

from authentication.permissions import (
    IsAdminOrOwner
)

from .serializers import (
    ReportSerializer
)


class ReportCreateAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated,
        IsAdminOrOwner
    ]

    def post(
        self,
        request
    ):

        serializer = (
            ReportSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save(
            organization=
            request.user.
            organization
        )

        return Response(
            serializer.data,
            status=
            status.
            HTTP_201_CREATED
        )