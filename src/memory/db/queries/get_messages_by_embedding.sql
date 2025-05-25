SELECT m.*, u.id as user_id,
       1 - (m.embedding <=> $1) as similarity
FROM messages m
JOIN users u ON m.user_id = u.id
JOIN conversation_participants cp ON cp.conversation_id = m.conversation_id
WHERE cp.user_id IN (
    SELECT cp2.user_id
    FROM conversation_participants cp2
    WHERE cp2.conversation_id = $2
)
AND m.embedding IS NOT NULL
AND 1 - (m.embedding <=> $1) > 0.7
ORDER BY m.embedding <=> $1
LIMIT $3;