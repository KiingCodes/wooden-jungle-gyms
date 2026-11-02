# Special offers setup

The public offers page and admin dashboard use Supabase Auth, the `special_offers`
table, and the `special-offer-images` Storage bucket.

Existing installations should apply any unapplied migration in
`migrations/`, including `20261102000200_special_offer_multiple_images.sql`,
before using the multi-photo editor. It adds `images` and copies each existing
`image_path` into the array so current offer photos remain intact.

## One-time setup

1. Apply `migrations/20261102000100_special_offers.sql` to the Supabase project
   connected to this site. Use `supabase db push` for a linked project, or run the
   migration in the Supabase SQL Editor.
2. In **Authentication → Users**, invite or create the admin account with the
   email address you will use to sign in. Email/password sign-in must be enabled.
3. In the SQL Editor, approve that exact email address (lowercase):

   ```sql
   INSERT INTO public.admin_users (email)
   VALUES (lower(trim('your-admin@example.com')));
   ```

4. Open `/admin` on the website and sign in. Password resets use the project's
   configured site URL and redirect allowlist.

Only emails in `public.admin_users` can create, edit, publish, or delete offers
and upload images. The database and Storage policies enforce this independently
of the dashboard UI. Public visitors can read published offers and their images;
drafts remain visible only to approved admins. Images must be JPG, PNG, or WebP
and no larger than 8 MB.

Offers can be saved as drafts, published immediately, or scheduled with start
and end dates. Expired and not-yet-started offers are automatically hidden from
the public site.
