# performLogin.js

Source: `src/agent/lib/scraper/performLogin.js`

## Functions

<dl>
<dt><a href="#performLogin">performLogin(scraper)</a> ⇒ <code><a href="#LoginResult">Promise.&lt;LoginResult&gt;</a></code></dt>
<dd><p>Performs login for the scraper instance using credentials from environment variables
and handles both cookie and password-based authentication.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#LoginResult">LoginResult</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="performLogin"></a>

## performLogin(scraper) ⇒ [<code>Promise.&lt;LoginResult&gt;</code>](#LoginResult)
Performs login for the scraper instance using credentials from environment variables
and handles both cookie and password-based authentication.

**Kind**: global function  
**Returns**: [<code>Promise.&lt;LoginResult&gt;</code>](#LoginResult) - The login result  

| Param | Type | Description |
| --- | --- | --- |
| scraper | <code>Scraper</code> | The scraper instance to authenticate |

<a name="LoginResult"></a>

## LoginResult : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| success | <code>boolean</code> | Whether the login was successful |
| message | <code>string</code> \| <code>null</code> | Optional message describing the result |

