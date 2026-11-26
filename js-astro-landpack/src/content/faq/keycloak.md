---
question: Why not Keycloak?
order: 5
---

Keycloak does considerably more: realms, SAML, LDAP, identity brokering, federation. If you need those, use it. Laravel SSO covers OAuth 2.0 and OpenID Connect and stops there, which is why it fits in a Laravel application you can read, change and deploy yourself — and why there is no new runtime, admin console or configuration language to learn.
