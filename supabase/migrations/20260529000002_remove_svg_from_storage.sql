-- =============================================================================
-- Security fix: remove image/svg+xml from the images bucket allow-list.
--
-- Why: SVG files are XML and can contain embedded <script> tags or event
-- handlers (onclick, onload, etc.).  When served from a public Supabase
-- Storage URL with Content-Type: image/svg+xml, browsers execute the
-- embedded JavaScript, making uploaded SVGs a stored-XSS vector.
--
-- The server-side MIME validation in lib/actions/storage.action.ts uses
-- magic-byte inspection (file-type library) which DOES detect SVG as
-- application/xml rather than image/svg+xml, but belt-and-suspenders:
-- remove SVG at the bucket level too.
-- =============================================================================

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
]
WHERE id = 'images';
