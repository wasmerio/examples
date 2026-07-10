-- Seed a website for the send-event route. The admin user uuid is umami's
-- fixed default from prisma/migrations/01_init/migration.sql.
INSERT INTO "website" ("website_id", "name", "domain", "created_by", "user_id", "created_at", "updated_at")
VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeffff0000',
  'framework-test',
  'framework.test',
  '41e2b680-648e-4b09-bcd7-3e2b10c06264',
  '41e2b680-648e-4b09-bcd7-3e2b10c06264',
  now(),
  now()
)
ON CONFLICT ("website_id") DO NOTHING;
