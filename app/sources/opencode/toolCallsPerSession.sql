SELECT
  p.session_id as sessionId,
  s.title,
  COUNT(*) as toolCalls
FROM part p
JOIN session s ON s.id = p.session_id
WHERE json_extract(p.data, '$.type') = 'tool'
GROUP BY p.session_id
ORDER BY toolCalls DESC
LIMIT 20
