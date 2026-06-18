# Teacher-Training-Portal - TODO

## Step 1: Locate and fix runtime errors in Login/Password reset
- [x] Add missing `ADMIN_CREDENTIALS` (or remove dependency) in `src/pages/LoginPage.jsx`
- [ ] Ensure Forgot/Reset password screens work without crashing

## Step 2: Validate Attendance OTP prerequisites
- [ ] Confirm `user.email` exists in `src/pages/AttendanceManager.jsx` usage
- [ ] Add guardrails + clearer error messages if missing

## Step 3: Test flows
- [ ] Run frontend and test: login -> forgot -> reset
- [ ] Run frontend and test: attendance status change -> OTP modal -> verify

