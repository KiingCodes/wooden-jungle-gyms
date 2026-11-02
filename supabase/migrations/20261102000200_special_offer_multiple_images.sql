ALTER TABLE public.special_offers
  ADD COLUMN images text[] NOT NULL DEFAULT ARRAY[]::text[];

UPDATE public.special_offers
SET images = ARRAY[image_path]
WHERE image_path IS NOT NULL AND cardinality(images) = 0;
