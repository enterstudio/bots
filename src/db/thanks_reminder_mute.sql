UPDATE employee
SET meta = jsonb_merge(
  meta,
  '{"mute_thanksbot_reminder":true}'
)
WHERE slack=?
