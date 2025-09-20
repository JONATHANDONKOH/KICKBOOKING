# TODO: Modify User Book Stadium Payment Modal

## Tasks
- [ ] Remove startTime and endTime fields from the payment modal in app/user/book-stadium/page.tsx
- [ ] Change bookingDate input from 'date' to 'datetime-local' to accept any date and time
- [ ] Modify calculateTotalAmount to use a fixed duration (e.g., 1 hour) instead of start/end time
- [ ] Update form validation to remove requirements for startTime and endTime
- [ ] Update handlePaymentSubmit to not send start_time and end_time to the API
- [ ] Adjust total amount display and calculation logic
- [ ] Test the changes to ensure booking works without time specification
