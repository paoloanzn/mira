# provider.js

Source: `src/agent/lib/ai/provider.js`

<a name="provider
Provides functionality to generate text using different AI providers.
Currently supports the OpenAI provider.module_"></a>

## provider
Provides functionality to generate text using different AI providers.
Currently supports the OpenAI provider.

* [provider
Provides functionality to generate text using different AI providers.
Currently supports the OpenAI provider.](#provider
Provides functionality to generate text using different AI providers.
Currently supports the OpenAI provider.module_)
    * [~defaultConfig](#provider
Provides functionality to generate text using different AI providers.
Currently supports the OpenAI provider.module_..defaultConfig) : <code>Object</code>
    * [~generateText(prompt, provider, [streamCallback], [modelSize], [tools], [maxSteps])](#provider
Provides functionality to generate text using different AI providers.
Currently supports the OpenAI provider.module_..generateText) ⇒ <code>Promise.&lt;{data: (string\|null), steps: (Array\|null), error: (Error\|string\|null)}&gt;</code>

<a name="provider
Provides functionality to generate text using different AI providers.
Currently supports the OpenAI provider.module_..defaultConfig"></a>

### provider
Provides functionality to generate text using different AI providers.
Currently supports the OpenAI provider.~defaultConfig : <code>Object</code>
Default configuration for text generation.

**Kind**: inner constant of [<code>provider
Provides functionality to generate text using different AI providers.
Currently supports the OpenAI provider.</code>](#provider
Provides functionality to generate text using different AI providers.
Currently supports the OpenAI provider.module_)  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| temperature | <code>number</code> | Sampling temperature. |
| maxInputTokens | <code>number</code> | Maximum input tokens. |
| maxOutputTokens | <code>number</code> | Maximum output tokens. |
| presencePenalty | <code>number</code> | Presence penalty. |
| frequencyPenalty | <code>number</code> | Frequency penalty. |
| maxSteps | <code>number</code> | Maximum number of tool execution steps. |

<a name="provider
Provides functionality to generate text using different AI providers.
Currently supports the OpenAI provider.module_..generateText"></a>

### provider
Provides functionality to generate text using different AI providers.
Currently supports the OpenAI provider.~generateText(prompt, provider, [streamCallback], [modelSize], [tools], [maxSteps]) ⇒ <code>Promise.&lt;{data: (string\|null), steps: (Array\|null), error: (Error\|string\|null)}&gt;</code>
Generates text using the specified AI provider.

**Kind**: inner method of [<code>provider
Provides functionality to generate text using different AI providers.
Currently supports the OpenAI provider.</code>](#provider
Provides functionality to generate text using different AI providers.
Currently supports the OpenAI provider.module_)  
**Returns**: <code>Promise.&lt;{data: (string\|null), steps: (Array\|null), error: (Error\|string\|null)}&gt;</code> - Result object containing either the generated text, execution steps (if tools were used), or an error.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| prompt | <code>string</code> |  | The prompt to send to the AI. |
| provider | <code>string</code> |  | The AI provider to use (e.g., ModelProvider.OPENAI). |
| [streamCallback] | <code>function</code> |  | Optional callback that receives chunks of streamed text. |
| [modelSize] | <code>string</code> | <code>&quot;ModelType.MEDIUM&quot;</code> | The size of the AI model to use. |
| [tools] | <code>Object</code> | <code>{}</code> | Optional tools that the model can use during generation. |
| [maxSteps] | <code>number</code> |  | Optional maximum number of tool execution steps. |

