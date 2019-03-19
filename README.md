# DEXEOS embed trade API
✨ Enjoy DEXEOS Trade with your DApp!

## Flow
![Flow](flow.png)

## DEXEOS Public API

This documentation is based on [DEXEOS Public API](https://github.com/DEXEOS/dexeos-api-public).

## Keywords

Name | Description | Example
---- | ---- | ----
`<Market>` | DEXEOS Market type | `eos` or `cusd`
`<Lang>` | Language code | `en` or `ko` or `zh-CN` or `zh-TW`
`<code>` | Token code | `stablecarbon` for cusd
`<symbol>` | Token symbol in caps | `CUSD`

## Contents
- [Get started](#get-started)
- [Docs](#docs)
    - [URLs](#urls)
    - [Message Types](#message-types)
- [Example](#example)


## Get started

1. Add `iframe` in your app 
    ```
    <!--
      You have to add parameter like:
      ?market=<Market>&code=<code>&symbol=<symbol>

      also you can fetch available token lists with DEXEOS Public API.
      or see https://dexeos.io/trade
     -->
    <iframe title="DEXEOS Trade" src="https://dexeos.io/embed/?market=<Market>&code=<code>&symbol=<symbol>"></iframe>

    <!-- for example, CUSD in EOS Market: -->
    <iframe title="DEXEOS Trade" src="https://dexeos.io/embed/?market=eos&code=stablecarbon&symbol=CUSD"></iframe>
    ```

2. Add `Event Listener` for `message` to handle
    ```
    window.addEventListener("message", this.handleReceiveMessage, false);
    ```

3. Here is an example of handling `message` event:
    ```
   handleReceiveMessage = e => {
       if (e.data.indexOf("setImmediate") > -1) return;
       const receiveMessage = JSON.parse(e.data);
       const { msgId } = receiveMessage;
   
       const { key, transaction } = receiveMessage.data;
   
       switch (msgId) {
         case "onload": // Input Account Name here
           const options = { accountId: "dexeoswallet" };
           const message = { msgId: "signIn", data: options };
           e.source.postMessage(JSON.stringify(message), e.origin);
           break;
         case "buy":
           return this.handleTransaction(e, msgId, key, transaction);
         case "sell":
           return this.handleTransaction(e, msgId, key, transaction);
         case "cancel":
           return this.handleTransaction(e, msgId, key, transaction);
         default: break;
       }
    };
    
    handleTransaction = (e, msgId, key, transaction) => {
          eos
            .transaction(transaction)
            .then(result => this.handleTransactionSuccess(e, msgId, key, result))
            .catch(error => this.handleTransactionFailed(e, msgId, key, error));
    };
    
    // on success:
    handleTransactionSuccess = (e, msgId, key, result) => {
        const data = { key, result };
        const message = { msgId, data };
        e.source.postMessage(JSON.stringify(message), e.origin);
    };
    
    // on failed:
    handleTransactionFailed = (e, msgId, key, error) => {
        const data = { key, error };
        const message = { msgId, data };
        e.source.postMessage(JSON.stringify(message), e.origin);
    };
    ```
4. 🍺 That's all! It's easy ;)

## Docs

### URLs

Name | Value
---- | ----
Embed trade | `https://dexeos.io/embed/?market=<Market>&code=<code>&symbol=<symbol>&lang=<Lang>`
Token List | `https://api.dexeos.io/v3/token`

### Message Types

Type | Name | Description
---- | ---- | ----
Both | `buy` | buy or completed
| | `sell` | sell or completed
| | `cancel` | cancel or cancelled
Income | `onload` | on load
Send | `signIn` | User sign in
| | `signOut` | User sign out
| | `changeLanguage` | Change language

## Example
- [React.js](example/react/index.jsx)

