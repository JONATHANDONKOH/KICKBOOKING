# TODO List for KickBooking Project

## Current Task: Update Contact Page (Phone Numbers and Colors to Match Homepage)

### Steps:
1. **Update phone numbers**: In `app/contact/page.tsx`, change the Phone details in `contactInfo` array to ["0240528361", "0242737456"].
   - Status: [x] Completed

2. **Update root background gradient**: In `app/contact/page.tsx`, change the main div class from `bg-gradient-to-b from-gray-900 via-black to-gray-900` to `bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900`.
   - Status: [x] Completed

3. **Update navigation background**: In `app/contact/page.tsx`, update the nav class from `bg-black/90` to `bg-black/20 backdrop-blur-md border-b border-white/10`.
   - Status: [x] Completed

4. **Update Contact Info section**: In `app/contact/page.tsx`, replace inline `style={{ backgroundColor: '#1E1E1E' }}` with `bg-gradient-to-r from-slate-900 to-green-900`. Update card classes to `bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/30 transition-all duration-300`.
   - Status: [x] Completed

5. **Update Contact Form section**: In `app/contact/page.tsx`, change form container to `bg-black/20 backdrop-blur-sm border-white/20 rounded-lg shadow-lg`. Update inputs/textarea to `bg-black/10 border-white/20 text-white`.
   - Status: [x] Completed

6. **Test changes**: Run `pnpm dev`, navigate to `/contact`, verify numbers and colors match homepage, check responsiveness and form functionality.
   - Status: [ ] Pending

## Previous Tasks
*(Any existing todos from before can be listed here if needed; assuming this is additive.)*

Last Updated: Current session
