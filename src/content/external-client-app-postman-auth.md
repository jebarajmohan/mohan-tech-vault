---
title: External Client App + Postman Authentication (Client Credentials Flow)
category: Integrations
tags: oauth, external-client-apps, postman, client-credentials, integration-user, rest-api
summary: Connect Postman to Salesforce using an External Client App and an Integration User via the OAuth 2.0 Client Credentials flow.
---

## Purpose

Connect Salesforce to Postman using an **External Client App** and a **Salesforce Integration User**, authenticating with the OAuth 2.0 **Client Credentials** flow — no interactive login, no refresh token juggling.

## Prerequisites

- Salesforce Enterprise/Unlimited Edition
- My Domain enabled
- An Integration User already created
- Postman installed

## Step 1: Create an Integration User

- Setup → Users → New User
- User License: **Salesforce Integration**
- Profile: **Minimum Access - API Only Integrations**
- Active: Yes

## Step 2: Create an External Client App

- Setup → External Client App Manager
- Click **New External Client App**
- Provide name, API name, and contact email

## Step 3: Configure OAuth

- Enable OAuth
- Callback URL: `https://oauth.pstmn.io/v1/callback`
- Scopes: `api`, `full`, `refresh_token`

## Step 4: Enable Client Credentials Flow

Enable **Client Credentials Flow** and save.

## Step 5: Deploy the External Client App

Click **Deploy**. Until deployed, the app can't issue tokens.

## Step 6: Configure Policies

- **Permitted Users:** Admin approved users are pre-authorized
- **Run As User:** Integration User
- **IP Relaxation:** Relax IP restrictions (recommended for testing)

## Step 7: Copy Credentials

- Copy the **Client ID** (Consumer Key)
- Copy the **Client Secret**

## Step 8: Token Endpoint

```
https://<MyDomain>.sandbox.my.salesforce.com/services/oauth2/token
```

- Do **NOT** use `https://test.salesforce.com`
- Do **NOT** use `*.my.salesforce-setup.com`

## Step 9: Postman Request

- **Method:** POST
- **Header:** `Content-Type: application/x-www-form-urlencoded`
- **Body (x-www-form-urlencoded):**

```
grant_type=client_credentials
client_id=<Consumer Key>
client_secret=<Consumer Secret>
```

### Successful Response

Contains `access_token`, `instance_url`, and `token_type`.

```json
{
  "access_token": "00D...",
  "instance_url": "https://yourinstance.my.salesforce.com",
  "token_type": "Bearer"
}
```

## Use the Access Token

```
Authorization: Bearer <access_token>
```

## Create Account Example

```
POST /services/data/v67.0/sobjects/Account
```

```json
{
  "Name": "Postman Test Account"
}
```

## Common Errors

- **authentication failure** — wrong flow selected, or bad client ID/secret
- **request not supported on this domain** — use your My Domain URL instead of `test.salesforce.com`
- **NOT_FOUND** — wrong REST endpoint or object name

## Checklist

- Use an External Client App (not a legacy Connected App)
- Deploy the app before testing
- Enable Client Credentials Flow
- Set Run As User to the Integration User
- Use your My Domain URL for the token endpoint
- Use `grant_type=client_credentials`
- Send the `Authorization: Bearer <token>` header on every API request
