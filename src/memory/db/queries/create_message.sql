INSERT INTO messages (conversation_id, user_id, content, embedding) 
VALUES ($1, $2, $3, $4)
RETURNING id; 