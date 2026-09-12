# Security Specification - NEEMA HEEP MICROFINANCE

## 1. Data Invariants
- A `Registration` must have a `type`, `status`, and `phone`.
- `members` subcollection belongs to a `Registration`.
- `Payment` must link to a `registrationId`.
- `Lead` status updates are restricted to authorized personnel (admins).
- Users can only read their own registration data if authenticated.

## 2. Access Control Matrix
| Collection | Create | Read (Get/List) | Update | Delete |
|------------|--------|-----------------|--------|--------|
| registrations | Public | Owner/Admin | Admin (Limited fields) | Admin |
| registrations/{id}/members | Public | Owner/Admin | Owner/Admin | Admin |
| payments | Public | Owner/Admin | Admin | Admin |
| leads | Public | Admin | Admin | Admin |
| contact_messages | Public | Admin | Admin | Admin |
| career_applications | Public | Admin | Admin | Admin |
| volunteer_applications | Public | Admin | Admin | Admin |
| partnership_applications | Public | Admin | Admin | Admin |
| callback_requests | Public | Admin | Admin | Admin |
| jobs | Admin | Public | Admin | Admin |
| admins | None | System | None | None |

## 3. The "Dirty Dozen" Payloads
1. **Identity Spoofing**: Attempt to create a registration with `ownerId: "someone_else"`.
2. **State Shortcutting**: Attempt to create a registration with `status: "approved"`.
3. **Ghost Fields**: Attempt to add `isVerified: true` to a registration update.
4. **ID Poisoning**: Attempt to create a document with a 2MB string as ID.
5. **PII Leak**: Unauthorized user trying to list all registrations.
6. **Relational Sync Break**: Creating a member for a non-existent registration.
7. **Negative Amount**: Creating a payment with `amount: -1000`.
8. **Admin Promotion**: User trying to add themselves to the `admins` collection.
9. **Action Bypass**: Updating a terminal-status registration (e.g., approved).
10. **Shadow Write**: Updating `createdAt` timestamp.
11. **Orphaned Member**: Listing members without going through the parent registration.
12. **Denial of Wallet**: Sending a massive 1MB string in a text field.

## 4. Test Runner Plan
The tests will verify that:
- Public users can submit forms (leads, registrations) but not read them.
- Only users in the `admins` collection can access the dashboard data.
- Validation helpers enforce types and mandatory fields.
