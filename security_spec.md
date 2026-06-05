# Security Specification: Aman Platform (منصة الأمان) - Phase 2 Hardening

## 1. Data Invariants
- **Identity Integrity**: Listings must bear the authentic `userId` of the creator, which matches `request.auth.uid`. No identity spoofing is permitted.
- **State Control**: Only admins can approve listings (`approved = true`) or modify user roles. Users cannot change their own `approved` state once created (defaults to false or remains unchanged during owner updates).
- **Relational Integrity**: Deleting a listing is strictly permitted only by its verified owner (`userId` matches the current session uid) or an authenticated custom administrator.
- **Resource Sizing Guards**: Max string lengths and array count restrictions on uploaded image schemas protect against cost and memory exhaustion.

## 2. Updated "Dirty Dozen" Payloads
1. **P1: Self-Approval Spoof**: Standard user submits property with `approved: true`.
2. **P2: User Role Self-Promotion**: Standard user submits user document update with `role: "admin"`.
3. **P3: Listing Hijack**: User A attempts to update a listing belonging to User B (different `userId`).
4. **P4: Creator Spoofing**: User A creates a property setting `userId: UserB_UID`.
5. **P5: Over-Sized Images Array**: Submitting a listing with 100 image URLs inside `images`.
6. **P6: Giant Title Load**: Property `title` field exceeds 250 characters.
7. **P7: Invalid ID Injection**: Injecting script tags or unsafe character sequences as `propertyId`.
8. **P8: Unauthorized Listing Erasure**: Unauthenticated guest trying to delete a verified vehicle.
9. **P9: Price State Poisoning**: Injecting invalid structure in the listings.
10. **P10: Ghost Fields Injection**: Adding shadow fields such as `adminBypass: true`.
11. **P11: Missing User Integrity**: Document creation without `userId`.
12. **P12: Modification of Immutable Creation Date**: Standard user tries to falsify old dates during edits.

## 3. Deployment Rules Draft
The security rules mathematically secure these collections. Let's deploy the rules.
