self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/telemetry.js",
        "destination": "/api/scripts/telemetry"
      },
      {
        "source": "/teams/:teamId/:path*",
        "destination": "/:path*"
      }
    ],
    "beforeFiles": [
      {
        "has": [
          {
            "type": "header",
            "key": "next-url",
            "value": "/websites/(?<nxtPwebsiteId>[^/]+?)(?:/.*)?"
          }
        ],
        "source": "/websites/:nxtPwebsiteId/replays/:nxtPsessionId",
        "destination": "/websites/:nxtPwebsiteId/(.)replays/:nxtPsessionId"
      },
      {
        "has": [
          {
            "type": "header",
            "key": "next-url",
            "value": "/websites/(?<nxtPwebsiteId>[^/]+?)(?:/.*)?"
          }
        ],
        "source": "/websites/:nxtPwebsiteId/sessions/:nxtPsessionId",
        "destination": "/websites/:nxtPwebsiteId/(.)sessions/:nxtPsessionId"
      }
    ],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()