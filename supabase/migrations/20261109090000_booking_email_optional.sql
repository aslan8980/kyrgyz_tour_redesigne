-- Allow booking requests to provide only the selected contact method.
-- Email remains available and required by the form when email is selected.
alter table public.booking_requests
  alter column email drop not null;
