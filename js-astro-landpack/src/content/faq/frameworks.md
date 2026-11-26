---
question: Do my applications need to use Laravel?
order: 2
---

No. Applications connect over standard OpenID Connect, so any maintained client library will do — Laravel, Node, Python, Go, .NET, a mobile app, a single-page app. Point it at your issuer URL with the credentials you registered; most libraries read everything else from the discovery document.
