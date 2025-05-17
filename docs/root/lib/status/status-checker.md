# status-checker.js

Source: `src/lib/status/status-checker.js`

## Classes

<dl>
<dt><a href="#StatusChecker">StatusChecker</a></dt>
<dd><p>Class responsible for checking Docker container statuses</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ServiceStatus">ServiceStatus</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="StatusChecker"></a>

## StatusChecker
Class responsible for checking Docker container statuses

**Kind**: global class  

* [StatusChecker](#StatusChecker)
    * [.getServicesStatus()](#StatusChecker+getServicesStatus) ⇒ <code>Promise.&lt;Array.&lt;ServiceStatus&gt;&gt;</code>
    * [.formatStatusOutput(services)](#StatusChecker+formatStatusOutput) ⇒ <code>Array.&lt;string&gt;</code>
    * [.checkAllServicesRunning(services)](#StatusChecker+checkAllServicesRunning) ⇒ <code>Object</code>

<a name="StatusChecker+getServicesStatus"></a>

### statusChecker.getServicesStatus() ⇒ <code>Promise.&lt;Array.&lt;ServiceStatus&gt;&gt;</code>
Get status of all services

**Kind**: instance method of [<code>StatusChecker</code>](#StatusChecker)  
<a name="StatusChecker+formatStatusOutput"></a>

### statusChecker.formatStatusOutput(services) ⇒ <code>Array.&lt;string&gt;</code>
Format status output with colors and symbols

**Kind**: instance method of [<code>StatusChecker</code>](#StatusChecker)  
**Returns**: <code>Array.&lt;string&gt;</code> - Formatted status lines  

| Param | Type |
| --- | --- |
| services | [<code>Array.&lt;ServiceStatus&gt;</code>](#ServiceStatus) | 

<a name="StatusChecker+checkAllServicesRunning"></a>

### statusChecker.checkAllServicesRunning(services) ⇒ <code>Object</code>
Check if all required services are running

**Kind**: instance method of [<code>StatusChecker</code>](#StatusChecker)  

| Param | Type |
| --- | --- |
| services | [<code>Array.&lt;ServiceStatus&gt;</code>](#ServiceStatus) | 

<a name="ServiceStatus"></a>

## ServiceStatus : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Service name |
| isRunning | <code>boolean</code> | Whether the service is running |
| state | <code>string</code> | Current state of the service |
| [error] | <code>string</code> | Error message if any |

