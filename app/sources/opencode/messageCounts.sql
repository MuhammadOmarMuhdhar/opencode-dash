SELECT
  session_id,
  COUNT(*) as message_count
FROM message
GROUP BY session_id
