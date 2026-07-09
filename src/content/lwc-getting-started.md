---
title: Lightning Web Components – Getting Started
category: LWC
tags: lwc, lightning-web-components, frontend
summary: Anatomy of an LWC bundle, wire adapters, and Apex method calls.
---

## Bundle Anatomy

An LWC bundle is 4 files sharing a folder name:

```
myComponent/
  myComponent.js
  myComponent.html
  myComponent.js-meta.xml
  myComponent.css
```

## Wiring Apex

```js
import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';

export default class ContactList extends LightningElement {
    @wire(getContacts) contacts;
}
```

```apex
public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [SELECT Id, Name, Email FROM Contact LIMIT 50];
    }
}
```

## Imperative Apex Call

Use imperative calls for anything that writes data (`cacheable=false`, no `@wire`):

```js
import saveRecord from '@salesforce/apex/ContactController.saveRecord';

handleSave() {
    saveRecord({ contact: this.draft })
        .then(() => this.showToast('Success', 'Saved', 'success'))
        .catch(error => this.showToast('Error', error.body.message, 'error'));
}
```

## Exposing to App Builder

Set targets in the `.js-meta.xml` file:

```xml
<targets>
    <target>lightning__AppPage</target>
    <target>lightning__RecordPage</target>
</targets>
```
