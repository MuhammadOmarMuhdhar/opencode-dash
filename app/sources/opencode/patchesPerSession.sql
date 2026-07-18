SELECT
  p.session_id as sessionId,
  s.title,
  COUNT(*) as patches
FROM part p
JOIN session s ON s.id = p.session_id
WHERE json_extract(p.data, '$.type') = 'patch'
GROUP BY p.session_id
ORDER BY patches DESC
LIMIT 20
