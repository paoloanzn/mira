SELECT m.*, u.id as user_id,
       1 - (m.embedding <=> $1) as similarity
FROM messages m
JOIN users u ON m.user_id = u.id
WHERE m.conversation_id = $2
  AND m.embedding IS NOT NULL
ORDER BY m.embedding <=> $1
LIMIT $3; 