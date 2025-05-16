# memory-client.js

Source: `src/agent/lib/memory/memory-client.js`

## Classes

<dl>
<dt><a href="#MemoryClient">MemoryClient</a></dt>
<dd><p>Client for interacting with the memory service.
Handles all communication between the agent and memory service.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getMemoryClient">getMemoryClient()</a> ⇒ <code><a href="#MemoryClient">MemoryClient</a></code></dt>
<dd><p>Gets the singleton instance of MemoryClient.</p>
</dd>
</dl>

<a name="MemoryClient"></a>

## MemoryClient

Client for interacting with the memory service.
Handles all communication between the agent and memory service.

**Kind**: global class

- [MemoryClient](#MemoryClient)
  - [new MemoryClient(baseUrl)](#new_MemoryClient_new)
  - [.createUser()](#MemoryClient+createUser) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>
  - [.getUser(userId)](#MemoryClient+getUser) ⇒ <code>Promise.&lt;{data: (Object\|null), error: (Error\|null)}&gt;</code>
  - [.createConversation(userIds)](#MemoryClient+createConversation) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>
  - [.createMessage(conversationId, userId, content)](#MemoryClient+createMessage) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>
  - [.getMessages(conversationId)](#MemoryClient+getMessages) ⇒ <code>Promise.&lt;{data: (Array\|null), error: (Error\|null)}&gt;</code>

<a name="new_MemoryClient_new"></a>

### new MemoryClient(baseUrl)

Creates a new MemoryClient instance.

| Param   | Type                | Description                    |
| ------- | ------------------- | ------------------------------ |
| baseUrl | <code>string</code> | Base URL of the memory service |

<a name="MemoryClient+createUser"></a>

### memoryClient.createUser() ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>

Creates a new user.

**Kind**: instance method of [<code>MemoryClient</code>](#MemoryClient)  
<a name="MemoryClient+getUser"></a>

### memoryClient.getUser(userId) ⇒ <code>Promise.&lt;{data: (Object\|null), error: (Error\|null)}&gt;</code>

Gets a user by ID.

**Kind**: instance method of [<code>MemoryClient</code>](#MemoryClient)

| Param  | Type                | Description   |
| ------ | ------------------- | ------------- |
| userId | <code>string</code> | The user's ID |

<a name="MemoryClient+createConversation"></a>

### memoryClient.createConversation(userIds) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>

Creates a new conversation.

**Kind**: instance method of [<code>MemoryClient</code>](#MemoryClient)

| Param   | Type                              | Description                                  |
| ------- | --------------------------------- | -------------------------------------------- |
| userIds | <code>Array.&lt;string&gt;</code> | Array of user IDs to add to the conversation |

<a name="MemoryClient+createMessage"></a>

### memoryClient.createMessage(conversationId, userId, content) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>

Creates a new message in a conversation.

**Kind**: instance method of [<code>MemoryClient</code>](#MemoryClient)

| Param          | Type                | Description         |
| -------------- | ------------------- | ------------------- |
| conversationId | <code>string</code> | The conversation ID |
| userId         | <code>string</code> | The user ID         |
| content        | <code>string</code> | The message content |

<a name="MemoryClient+getMessages"></a>

### memoryClient.getMessages(conversationId) ⇒ <code>Promise.&lt;{data: (Array\|null), error: (Error\|null)}&gt;</code>

Gets messages from a conversation.

**Kind**: instance method of [<code>MemoryClient</code>](#MemoryClient)

| Param          | Type                | Description         |
| -------------- | ------------------- | ------------------- |
| conversationId | <code>string</code> | The conversation ID |

<a name="getMemoryClient"></a>

## getMemoryClient() ⇒ [<code>MemoryClient</code>](#MemoryClient)

Gets the singleton instance of MemoryClient.

**Kind**: global function  
**Returns**: [<code>MemoryClient</code>](#MemoryClient) - The MemoryClient instance
