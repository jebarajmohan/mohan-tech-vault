---
title: OAuth Setup with External Client Apps
category: Integrations
tags: oauth, external-client-apps, rest-api, integration
summary: Configure an External Client App and walk through the OAuth 2.0 web server flow.
---

## Why External Client Apps

Salesforce is retiring Connected Apps in favor of **External Client Apps** for new OAuth integrations. They live under Setup > External Client App Manager and support the same OAuth flows.

## Create the App

1. Setup > External Client Apps > New External Client App
2. Enable OAuth Settings, set the callback URL
3. Select scopes: `api`, `refresh_token`, `offline_access`
4. Save and note the Consumer Key / Consumer Secret

## Web Server Flow

```
GET https://login.salesforce.com/services/oauth2/authorize
  ?response_type=code
  &client_id=YOUR_CONSUMER_KEY
  &redirect_uri=YOUR_CALLBACK_URL
```

Exchange the returned `code` for tokens:

```
POST https://login.salesforce.com/services/oauth2/token
  grant_type=authorization_code
  &code=AUTH_CODE
  &client_id=YOUR_CONSUMER_KEY
  &client_secret=YOUR_CONSUMER_SECRET
  &redirect_uri=YOUR_CALLBACK_URL
```

## Common Errors

- `redirect_uri_mismatch` — callback URL must match exactly, including trailing slash
- `invalid_client_id` — app not yet propagated (can take a few minutes) or wrong environment (sandbox vs production login URL)
- `invalid_grant` — authorization code already used or expired (codes are single-use, short-lived)
