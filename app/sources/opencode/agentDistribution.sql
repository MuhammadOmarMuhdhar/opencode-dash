SELECT
  COALESCE(agent, 'unknown') as agent,
  COUNT(*) as sessionCount,
  ROUND(SUM(cost), 6) as totalCost
FROM session
WHERE agent IS NOT NULL AND agent != ''
GROUP BY agent
ORDER BY sessionCount DESC
