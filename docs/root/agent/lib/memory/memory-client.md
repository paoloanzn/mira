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
  - [.getOrCreateUser(hostname, [options])](#MemoryClient+getOrCreateUser) ⇒ <code>Promise.&lt;{userId: (string\|null), error: (Error\|null)}&gt;</code>
  - [.getOrCreateConversation(userId, agentUserId)](#MemoryClient+getOrCreateConversation) ⇒ <code>Promise.&lt;{conversationId: (string\|null), error: (Error\|null)}&gt;</code>
  - [.createConversation(userIds)](#MemoryClient+createConversation) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>
  - [.createMessage(conversationId, userId, content, [embedding])](#MemoryClient+createMessage) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>
  - [.getMessages(conversationId, [options])](#MemoryClient+getMessages) ⇒ <code>Promise.&lt;{data: (Array\|null), error: (Error\|null)}&gt;</code>
  - [.formatConversation(messages, agentUserId)](#MemoryClient+formatConversation) ⇒ <code>string</code>

<a name="new_MemoryClient_new"></a>

### new MemoryClient(baseUrl)

Creates a new MemoryClient instance.

| Param   | Type                | Description                    |
| ------- | ------------------- | ------------------------------ |
| baseUrl | <code>string</code> | Base URL of the memory service |

<a name="MemoryClient+getOrCreateUser"></a>

### memoryClient.getOrCreateUser(hostname, [options]) ⇒ <code>Promise.&lt;{userId: (string\|null), error: (Error\|null)}&gt;</code>

Get or create a user by hostname

**Kind**: instance method of [<code>MemoryClient</code>](#MemoryClient)

| Param              | Type                 | Description                          |
| ------------------ | -------------------- | ------------------------------------ |
| hostname           | <code>string</code>  | The hostname to identify the user    |
| [options]          | <code>Object</code>  | Additional options for user creation |
| [options.is_agent] | <code>boolean</code> | Whether the user is an agent         |

<a name="MemoryClient+getOrCreateConversation"></a>

### memoryClient.getOrCreateConversation(userId, agentUserId) ⇒ <code>Promise.&lt;{conversationId: (string\|null), error: (Error\|null)}&gt;</code>

Gets or creates a conversation for a user with the agent.

**Kind**: instance method of [<code>MemoryClient</code>](#MemoryClient)

| Param       | Type                | Description         |
| ----------- | ------------------- | ------------------- |
| userId      | <code>string</code> | The user's ID       |
| agentUserId | <code>string</code> | The agent's user ID |

<a name="MemoryClient+createConversation"></a>

### memoryClient.createConversation(userIds) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>

Creates a new conversation.

**Kind**: instance method of [<code>MemoryClient</code>](#MemoryClient)

| Param   | Type                              | Description                                  |
| ------- | --------------------------------- | -------------------------------------------- |
| userIds | <code>Array.&lt;string&gt;</code> | Array of user IDs to add to the conversation |

<a name="MemoryClient+createMessage"></a>

### memoryClient.createMessage(conversationId, userId, content, [embedding]) ⇒ <code>Promise.&lt;{data: ({id: string}\|null), error: (Error\|null)}&gt;</code>

Creates a new message in a conversation.

**Kind**: instance method of [<code>MemoryClient</code>](#MemoryClient)

| Param          | Type                              | Default       | Description                               |
| -------------- | --------------------------------- | ------------- | ----------------------------------------- |
| conversationId | <code>string</code>               |               | The conversation ID                       |
| userId         | <code>string</code>               |               | The user ID                               |
| content        | <code>string</code>               |               | The message content                       |
| [embedding]    | <code>Array.&lt;number&gt;</code> | <code></code> | Optional embedding vector for the message |

<a name="MemoryClient+getMessages"></a>

### memoryClient.getMessages(conversationId, [options]) ⇒ <code>Promise.&lt;{data: (Array\|null), error: (Error\|null)}&gt;</code>

Gets messages from a conversation.

**Kind**: instance method of [<code>MemoryClient</code>](#MemoryClient)

| Param               | Type                              | Description                            |
| ------------------- | --------------------------------- | -------------------------------------- |
| conversationId      | <code>string</code>               | The conversation ID                    |
| [options]           | <code>Object</code>               | Additional options                     |
| [options.embedding] | <code>Array.&lt;number&gt;</code> | Embedding vector for similarity search |
| [options.limit]     | <code>number</code>               | Maximum number of messages to return   |

<a name="MemoryClient+formatConversation"></a>

### memoryClient.formatConversation(messages, agentUserId) ⇒ <code>string</code>

Formats messages into a conversation string.

**Kind**: instance method of [<code>MemoryClient</code>](#MemoryClient)  
**Returns**: <code>string</code> - Formatted conversation string

| Param       | Type                | Description              |
| ----------- | ------------------- | ------------------------ |
| messages    | <code>Array</code>  | Array of message objects |
| agentUserId | <code>string</code> | The agent's user ID      |

<a name="getMemoryClient"></a>

## getMemoryClient() ⇒ [<code>MemoryClient</code>](#MemoryClient)

Gets the singleton instance of MemoryClient.

**Kind**: global function  
**Returns**: [<code>MemoryClient</code>](#MemoryClient) - The MemoryClient instance
