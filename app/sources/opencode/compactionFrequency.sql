SELECT
  COUNT(*) as compaction_parts,
  COUNT(DISTINCT session_id) as sessions_with_compaction
FROM part
WHERE json_extract(data, '$.type') = 'compaction'
