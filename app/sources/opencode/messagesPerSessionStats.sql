SELECT
  ROUND(AVG(message_count), 2) as avg,
  MIN(message_count) as min,
  MAX(message_count) as max
FROM (
  SELECT COUNT(m.id) as message_count
  FROM session s
  LEFT JOIN message m ON m.session_id = s.id
  GROUP BY s.id
)
