SELECT
  date(
    COALESCE(
      json_extract(data, '$.time'),
      json_extract(data, '$.timestamp'),
      json_extract(data, '$.part.time.start'),
      0
    ) / 1000,
    'unixepoch'
  ) as date,
  COUNT(*) as eventCount
FROM event
WHERE json_extract(data, '$.time') IS NOT NULL
   OR json_extract(data, '$.timestamp') IS NOT NULL
GROUP BY date
ORDER BY date
