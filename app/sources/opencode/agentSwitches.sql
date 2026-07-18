SELECT
  COALESCE(json_extract(data, '$.agent'), 'unknown') as agent,
  COUNT(*) as switches
FROM event
WHERE type = 'session.next.agent.switched.1'
GROUP BY agent
ORDER BY switches DESC
