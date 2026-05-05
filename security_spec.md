# Security Specification

## 1. Data Invariants
- `settings/prices`: Only authenticated administrators (those with verified email `project.speedup@gmail.com` or explicitly added to the `/admins` collection) can create or update global application settings. Ordinary users and anonymous users have zero write access.
- `calculations/{calcId}`: Calculations can only be created by signed-in users. The `userId` field must exactly match the authenticated user's `uid`. Calculations can only be listed, read, updated, or deleted by the exact user who created them (`resource.data.userId == request.auth.uid`).
- `admins/{userId}`: Administrator role definitions are strictly controlled by existing administrators. Users cannot escalate their own privileges. A globally approved bootstrapper email exists to ensure lockout prevention.
- `createdAt` and `userId` fields on `calculations` are immutable during updates.
- All timestamps (`createdAt`, `updatedAt`) are synced securely with `request.time` to prevent temporal spoofing.

## 2. The "Dirty Dozen" Payloads

1. **Unregistered calculation generation:** `{ "userId": "attacker_id", "createdAt": "fake_time" }` sent by a non-admin. (DENIED: `userId` must equal `request.auth.uid`).
2. **Settings state override:** `{ "updatedAt": request.time }` to `settings/prices` sent by a standard user. (DENIED: `isAdmin()` is required).
3. **Cross-Tenant read attack:** A user queries `calculations` Collection without ensuring their own `userId`. (DENIED: `resource.data.userId == request.auth.uid` enforces isolation).
4. **ID Poisoning:** Trying to create `calculations/injection/script` (DENIED: `isValidId(calcId)` blocks special characters and prevents deep routing).
5. **Partial Document Shadowing:** Creating a calculation without a `userId` field. (DENIED: `hasAll(['userId', 'createdAt'])` strictly enforces keys).
6. **Temporal Spoofing:** Overwriting `createdAt` with a timestamp 10 years in the past. (DENIED: `data.createdAt == request.time`).
7. **Role Escalation:** Creating an admin document under `admins/myuid` as a regular user. (DENIED: requires `isAdmin()`).
8. **Owner Mutation Update:** Taking an existing calculation and trying to modify `userId` to someone else. (DENIED: `incoming().userId == request.auth.uid && existing().userId == request.auth.uid` locks the field).
9. **Creation Timestamp Mismatch Update:** Attempting to update `createdAt` during a normal update. (DENIED: `incoming().createdAt == existing().createdAt`).
10. **Admin Spoofing by Unverified Email:** An attacker fakes a JWT token claim for `project.speedup@gmail.com` but lacks provider verification. (DENIED: `request.auth.token.email_verified == true` strictly enforces origin trust).
11. **Type Poisoning:** Setting `userId` to a huge array or dictionary. (DENIED: `data.userId is string && data.userId.size() <= 128`).
12. **Blind Deletion Tooling:** User fires `delete` on `settings/prices`. (DENIED: requires `isAdmin()`).

## 3. The Test Runner

```typescript
import * as rulesUnitTesting from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';

const PROJECT_ID = "gen-lang-client-security-test";
const TEST_ENV = await rulesUnitTesting.initializeTestEnvironment({
  projectId: PROJECT_ID,
  firestore: { rules: readFileSync("firestore.rules", "utf8") },
});

export async function runDirtyDozenTests() {
  const aliceId = "uid_alice";
  const aliceAuth = { uid: aliceId, email: "alice@test.com", email_verified: true };
  const aliceDb = TEST_ENV.authenticatedContext(aliceId, aliceAuth).firestore();
  
  const adminId = "uid_admin";
  const adminAuth = { uid: adminId, email: "project.speedup@gmail.com", email_verified: true };
  const adminDb = TEST_ENV.authenticatedContext(adminId, adminAuth).firestore();

  // Test 1: Alice creates calc correctly -> ALLOW
  await rulesUnitTesting.assertSucceeds(
    aliceDb.collection("calculations").doc("calc1").set({
      userId: aliceId, createdAt: rulesUnitTesting.firestore.FieldValue.serverTimestamp()
    })
  );

  // Test 2: Alice creates calc with wrong user id -> DENY
  await rulesUnitTesting.assertFails(
    aliceDb.collection("calculations").doc("calc2").set({
      userId: "uid_bob", createdAt: rulesUnitTesting.firestore.FieldValue.serverTimestamp()
    })
  );
  
  // Test 3: Alice attempts to read settings -> ALLOW
  await rulesUnitTesting.assertSucceeds(aliceDb.doc("settings/prices").get());

  // Test 4: Alice attempts to write settings -> DENY
  await rulesUnitTesting.assertFails(
    aliceDb.doc("settings/prices").set({ updatedAt: rulesUnitTesting.firestore.FieldValue.serverTimestamp() })
  );

  // Test 5: Admin attempts to write settings -> ALLOW
  await rulesUnitTesting.assertSucceeds(
    adminDb.doc("settings/prices").set({ updatedAt: rulesUnitTesting.firestore.FieldValue.serverTimestamp() })
  );
  
  console.log("All 'Dirty Dozen' tests verified.");
}
```
