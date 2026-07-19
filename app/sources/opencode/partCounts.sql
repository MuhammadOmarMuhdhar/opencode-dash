SELECT
  session_id,
  COUNT(*) as part_count
FROM part
GROUP BY session_id
