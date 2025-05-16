# memory-manager.js

Source: `src/memory/db/memory-manager.js`

<a name="MemoryManager"></a>

## MemoryManager ⇐ <code>Database</code>

**Kind**: global class  
**Extends**: <code>Database</code>

- [MemoryManager](#MemoryManager) ⇐ <code>Database</code>
  - [new MemoryManager()](#new_MemoryManager_new)
  - [.createUser()](#MemoryManager+createUser) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>
  - [.getUser(userId)](#MemoryManager+getUser) ⇒ <code>Promise.&lt;{data: (Object\|null), error: (Error\|null)}&gt;</code>
  - [.createConversation(userIds)](#MemoryManager+createConversation) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>
  - [.createMessage(conversationId, userId, content)](#MemoryManager+createMessage) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>
  - [.getMessages(conversationId)](#MemoryManager+getMessages) ⇒ <code>Promise.&lt;{data: (Array\|null), error: (Error\|null)}&gt;</code>
  - [.getMessagesByEmbedding(embedding, conversationId, limit)](#MemoryManager+getMessagesByEmbedding) ⇒ <code>Promise.&lt;{data: (Array\|null), error: (Error\|null)}&gt;</code>
  - [.updateMessageEmbedding(messageId, embedding)](#MemoryManager+updateMessageEmbedding) ⇒ <code>Promise.&lt;{data: (Array\|null), error: (Error\|null)}&gt;</code>

<a name="new_MemoryManager_new"></a>

### new MemoryManager()

Class for managing memory operations.

<a name="MemoryManager+createUser"></a>

### memoryManager.createUser() ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>

Creates a new user.

**Kind**: instance method of [<code>MemoryManager</code>](#MemoryManager)  
<a name="MemoryManager+getUser"></a>

### memoryManager.getUser(userId) ⇒ <code>Promise.&lt;{data: (Object\|null), error: (Error\|null)}&gt;</code>

Gets a user by ID.

**Kind**: instance method of [<code>MemoryManager</code>](#MemoryManager)

| Param  | Type                | Description    |
| ------ | ------------------- | -------------- |
| userId | <code>string</code> | The user's ID. |

<a name="MemoryManager+createConversation"></a>

### memoryManager.createConversation(userIds) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>

Creates a new conversation.

**Kind**: instance method of [<code>MemoryManager</code>](#MemoryManager)

| Param   | Type                              | Description                                   |
| ------- | --------------------------------- | --------------------------------------------- |
| userIds | <code>Array.&lt;string&gt;</code> | Array of user IDs to add to the conversation. |

<a name="MemoryManager+createMessage"></a>

### memoryManager.createMessage(conversationId, userId, content) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>

Creates a new message in a conversation.

**Kind**: instance method of [<code>MemoryManager</code>](#MemoryManager)

| Param          | Type                | Description          |
| -------------- | ------------------- | -------------------- |
| conversationId | <code>string</code> | The conversation ID. |
| userId         | <code>string</code> | The user ID.         |
| content        | <code>string</code> | The message content. |

<a name="MemoryManager+getMessages"></a>

### memoryManager.getMessages(conversationId) ⇒ <code>Promise.&lt;{data: (Array\|null), error: (Error\|null)}&gt;</code>

Gets messages from a conversation.

**Kind**: instance method of [<code>MemoryManager</code>](#MemoryManager)

| Param          | Type                | Description          |
| -------------- | ------------------- | -------------------- |
| conversationId | <code>string</code> | The conversation ID. |

<a name="MemoryManager+getMessagesByEmbedding"></a>

### memoryManager.getMessagesByEmbedding(embedding, conversationId, limit) ⇒ <code>Promise.&lt;{data: (Array\|null), error: (Error\|null)}&gt;</code>

Gets messages similar to an embedding vector.

**Kind**: instance method of [<code>MemoryManager</code>](#MemoryManager)

| Param          | Type                              | Default        | Description                              |
| -------------- | --------------------------------- | -------------- | ---------------------------------------- |
| embedding      | <code>Array.&lt;number&gt;</code> |                | The embedding vector to compare against. |
| conversationId | <code>string</code>               |                | The conversation ID.                     |
| limit          | <code>number</code>               | <code>5</code> | Maximum number of messages to return.    |

<a name="MemoryManager+updateMessageEmbedding"></a>

### memoryManager.updateMessageEmbedding(messageId, embedding) ⇒ <code>Promise.&lt;{data: (Array\|null), error: (Error\|null)}&gt;</code>

Updates a message's embedding.

**Kind**: instance method of [<code>MemoryManager</code>](#MemoryManager)

| Param     | Type                              | Description           |
| --------- | --------------------------------- | --------------------- |
| messageId | <code>string</code>               | The message ID.       |
| embedding | <code>Array.&lt;number&gt;</code> | The embedding vector. |
