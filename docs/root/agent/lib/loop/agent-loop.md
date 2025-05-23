# agent-loop.js

Source: `src/agent/lib/loop/agent-loop.js`

<a name="agent-loop
Provides the core loop functionality for agent execution.module_"></a>

## agent-loop

Provides the core loop functionality for agent execution.

- [agent-loop
  Provides the core loop functionality for agent execution.](#agent-loop
  Provides the core loop functionality for agent execution.module*) \* [~LoopState](#agent-loop
  Provides the core loop functionality for agent execution.module*..LoopState) : <code>Object</code> \* [~LoopCallback](#agent-loop
  Provides the core loop functionality for agent execution.module\_..LoopCallback) : <code>function</code>

<a name="agent-loop
Provides the core loop functionality for agent execution.module_..LoopState"></a>

### agent-loop

Provides the core loop functionality for agent execution.~LoopState : <code>Object</code>
Represents the state of an agent loop

**Kind**: inner typedef of [<code>agent-loop
Provides the core loop functionality for agent execution.</code>](#agent-loop
Provides the core loop functionality for agent execution.module\_)  
**Properties**

| Name     | Type                                     | Description                           |
| -------- | ---------------------------------------- | ------------------------------------- |
| progress | <code>string</code>                      | Current progress state (LoopProgress) |
| outcome  | <code>string</code> \| <code>null</code> | Current outcome state (LoopOutcome)   |
| result   | <code>string</code> \| <code>null</code> | Result of the operation               |

<a name="agent-loop
Provides the core loop functionality for agent execution.module_..LoopCallback"></a>

### agent-loop

Provides the core loop functionality for agent execution.~LoopCallback : <code>function</code>
Callback function type for loop completion

**Kind**: inner typedef of [<code>agent-loop
Provides the core loop functionality for agent execution.</code>](#agent-loop
Provides the core loop functionality for agent execution.module\_)

| Param | Type                   | Description                   |
| ----- | ---------------------- | ----------------------------- |
| state | <code>LoopState</code> | The current state of the loop |
