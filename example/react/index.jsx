// import Eos.js ~~~
import React, {Component} from 'react';

class Index extends Component {
    componentDidMount() {
        window.addEventListener("message", this.handleReceiveMessage);
    }

    handleReceiveMessage = e => {
        if (e.data.indexOf("setImmediate") > -1) return;
        const receiveMessage = JSON.parse(e.data);
        const { msgId } = receiveMessage;

        const { key, transaction } = receiveMessage.data;

        switch (msgId) {
            case "onload":
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
            default:
        }
    };

    handleTransaction = (e, msgId, key, transaction) => {
        // Call eos transaction action in here
        eos
            .transaction(transaction)
            .then(result => this.handleTransactionSuccess(e, msgId, key, result))
            .catch(error => this.handleTransactionFailed(e, msgId, key, error));
    };

    handleTransactionSuccess = (e, msgId, key, result) => {
        console.log("EOS Transaction Success ========>", result);
        const data = { key, result };
        const message = { msgId, data };
        e.source.postMessage(JSON.stringify(message), e.origin);
    };

    handleTransactionFailed = (e, msgId, key, error) => {
        console.log("EOS Transaction Error ========>", error);
        const data = { key, error };
        const message = { msgId, data };
        e.source.postMessage(JSON.stringify(message), e.origin);
    };

    render() {
        return (
            <iframe
                title="DEXEOS TRADE"
                src="https://dexeos.io/embed/?market=eos&code=eosjackscoin&symbol=JKR&lang=ko"
                frameBorder={0}
                width="100%"
                style={{ width: "100%", height: "100vh" }}
            />
        );
    }
}

export default Index;