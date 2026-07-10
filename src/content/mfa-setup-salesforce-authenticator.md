---
title: How to Add MFA Using Salesforce Authenticator
category: Admin
tags: mfa, salesforce-authenticator, security, two-factor, login
summary: Register the Salesforce Authenticator mobile app as your MFA verification method, step by step.
---

## Before You Start

- A smartphone (iOS or Android) with internet or cellular data access.
- Your Salesforce username and password.
- A few minutes to complete the pairing process.

## Step-by-Step Instructions

### Step 1: Download the Salesforce Authenticator app

On your mobile device, download and install the free Salesforce Authenticator app from the Apple App Store (iOS) or Google Play Store (Android).

### Step 2: Log in to Salesforce

On your computer, log in to your Salesforce org as you normally would.

### Step 3: Open Advanced User Details

Click the gear icon (Settings) and select "Personal Settings" (or go directly to "My Settings"). In the Quick Find search box, type "Advanced User Details" and select it from the list.

### Step 4: Start the connection

On the Advanced User Details page, find the "App Registration: Salesforce Authenticator" section and click "Connect." A two-word phrase will appear on your screen — keep this page open.

### Step 5: Add your account in the mobile app

Open the Salesforce Authenticator app on your phone. If this is your first time opening it, you can skip or complete the intro tour. Tap "Add an Account" (or the + icon).

### Step 6: Enter the two-word phrase

Type the two-word phrase shown on your computer screen into the Salesforce Authenticator app on your phone, then tap "Connect" (or "Pair").

### Step 7: Confirm the connection on your phone

Your phone will display the connection details (device, browser, location). Review the information and tap "Connect" to approve it.

### Step 8: Verify success

Your computer screen will update to confirm the app is connected, and your phone will show a confirmation message. Salesforce Authenticator is now registered as your MFA verification method.

## Logging In After Setup

1. Enter your username and password as usual.
2. When prompted, approve the push notification on your phone, or open the app and enter the two-word phrase / code shown.
3. You're logged in once the verification is approved.

## Troubleshooting

- **Lost or new phone:** Log in with a backup verification method (if registered), then remove the old app connection and repeat this process to register the new device.
- **No internet on phone:** Salesforce Authenticator can generate a time-based code without an internet connection — tap the account in the app to view it.
- **Can't find Advanced User Details:** Confirm MFA / Salesforce Authenticator is enabled for your org's users; contact your Salesforce admin if the option isn't visible.

> **Note:** Keep your phone accessible when logging in — Salesforce sends a push notification to Salesforce Authenticator to approve each login (or a one-time code if you're offline).

## Reference

Salesforce Help — Connect Multi-Factor Authenticator to a User Account
