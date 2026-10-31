CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  preferred_gym text NOT NULL,
  location text NOT NULL,
  requirements text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.quote_requests TO anon;
GRANT ALL ON public.quote_requests TO service_role;

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can submit quote requests"
  ON public.quote_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX idx_quote_requests_created_at
  ON public.quote_requests (created_at DESC);