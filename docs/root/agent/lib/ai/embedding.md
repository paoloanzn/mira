# embedding.js

Source: `src/agent/lib/ai/embedding.js`

<a name="LocalEmbeddingClient"></a>

## LocalEmbeddingClient

**Kind**: global class

- [LocalEmbeddingClient](#LocalEmbeddingClient)
  - [new LocalEmbeddingClient()](#new_LocalEmbeddingClient_new)
  - [new LocalEmbeddingClient()](#new_LocalEmbeddingClient_new)
  - _instance_
    - [.initialize()](#LocalEmbeddingClient+initialize) ⇒ <code>Promise.&lt;void&gt;</code>
    - [.generateEmbeddings(input)](#LocalEmbeddingClient+generateEmbeddings) ⇒ <code>Promise.&lt;Array.&lt;number&gt;&gt;</code>
  - _static_
    - [.getInstance()](#LocalEmbeddingClient.getInstance) ⇒ [<code>LocalEmbeddingClient</code>](#LocalEmbeddingClient)

<a name="new_LocalEmbeddingClient_new"></a>

### new LocalEmbeddingClient()

Client for generating embeddings using a local model.
Implements the Singleton pattern to ensure only one instance exists.

<a name="new_LocalEmbeddingClient_new"></a>

### new LocalEmbeddingClient()

Creates a new LocalEmbeddingClient instance.

<a name="LocalEmbeddingClient+initialize"></a>

### localEmbeddingClient.initialize() ⇒ <code>Promise.&lt;void&gt;</code>

Initializes the embedding model.

**Kind**: instance method of [<code>LocalEmbeddingClient</code>](#LocalEmbeddingClient)  
**Throws**:

- <code>AIGenerationError</code> If model initialization fails

<a name="LocalEmbeddingClient+generateEmbeddings"></a>

### localEmbeddingClient.generateEmbeddings(input) ⇒ <code>Promise.&lt;Array.&lt;number&gt;&gt;</code>

Generates embeddings for the given input text.

**Kind**: instance method of [<code>LocalEmbeddingClient</code>](#LocalEmbeddingClient)  
**Returns**: <code>Promise.&lt;Array.&lt;number&gt;&gt;</code> - The generated embedding vector  
**Throws**:

- <code>AIGenerationError</code> If embedding generation fails

| Param | Type                | Description                         |
| ----- | ------------------- | ----------------------------------- |
| input | <code>string</code> | The text to generate embeddings for |

<a name="LocalEmbeddingClient.getInstance"></a>

### LocalEmbeddingClient.getInstance() ⇒ [<code>LocalEmbeddingClient</code>](#LocalEmbeddingClient)

Gets the singleton instance of LocalEmbeddingClient.

**Kind**: static method of [<code>LocalEmbeddingClient</code>](#LocalEmbeddingClient)  
**Returns**: [<code>LocalEmbeddingClient</code>](#LocalEmbeddingClient) - The singleton instance
