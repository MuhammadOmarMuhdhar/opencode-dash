SELECT
  date(time_created/1000, 'unixepoch') as date,
  COUNT(DISTINCT project_id) as activeProjects
FROM session
GROUP BY date
ORDER BY date
