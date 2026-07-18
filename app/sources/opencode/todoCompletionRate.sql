SELECT
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
  COUNT(*) as total
FROM todo
