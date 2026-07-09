---
title: Apex Trigger Best Practices
category: Apex
tags: apex, triggers, best-practices, bulkification
summary: One trigger per object, bulkified logic, and a handler pattern that scales.
---

## One Trigger Per Object

Salesforce doesn't guarantee execution order across multiple triggers on the same object. Stick to a single trigger per object and delegate logic to a handler class.

```apex
trigger AccountTrigger on Account (before insert, before update, after insert, after update) {
    AccountTriggerHandler.run(Trigger.new, Trigger.oldMap, Trigger.operationType);
}
```

## Always Bulkify

Never run SOQL or DML inside a `for` loop. Collect records first, then process them as a set.

```apex
public class AccountTriggerHandler {
    public static void run(List<Account> newList, Map<Id, Account> oldMap, System.TriggerOperation op) {
        Set<Id> ownerIds = new Set<Id>();
        for (Account acc : newList) {
            ownerIds.add(acc.OwnerId);
        }
        Map<Id, User> owners = new Map<Id, User>([SELECT Id, Email FROM User WHERE Id IN :ownerIds]);
        // bulk-safe logic here
    }
}
```

## Handler Pattern

Keep the trigger body a one-liner. Put all logic, including recursion guards, in the handler.

```apex
public class TriggerRecursionGuard {
    private static Boolean hasRun = false;
    public static Boolean shouldRun() {
        if (hasRun) return false;
        hasRun = true;
        return true;
    }
}
```

## Checklist

- No SOQL/DML inside loops
- Recursion guard for `after` triggers that update the same object
- Handler class covered by unit tests with bulk data (200+ records)
- Trigger.old / Trigger.new used instead of re-querying
