
var amqp = require('amqplib/callback_api');
const CONN_URL = 'amqp://iupkqwvp:5fziO4WWTNZU25VqvTV-JuTqdMjA6a_2@toad.rmq.cloudamqp.com/iupkqwvp';

let actor_mapper={"send_confirmation_email":sendConfirmationMail,"send_confirmation_sms":sendConfirmationSMS,
"create_wallet_account":createWalletAccount,"send_cashback":sendCashBack};

amqp.connect(CONN_URL, function (err, conn) {
    conn.createChannel(function (err, ch) {
        ch.consume('user-messages', async function (msg) {
                
                msg.content=JSON.parse(msg.content);
                console.log("event name = ",msg.content.event);
                if(Object.keys(actor_mapper).indexOf(msg.content.event)!==-1){
                    let actor= actor_mapper[msg.content.event];
                    await actor(msg,ch);
                }
                else{
                    console.log("Error: Event not found!");
                }
            },{ noAck: false }
        );
    });
});


//Actor functions for different events

async function sendConfirmationMail(msg,ch){
    console.log('.....');
    setTimeout(function(){
        console.log("Message:",msg.content);
        ch.ack(msg);
    },1000);
}

async function sendConfirmationSMS(msg,ch){
    console.log('.....');
    setTimeout(function(){
        console.log("Message:",msg.content);
        ch.ack(msg);
    },1000);
}

async function createWalletAccount(msg,ch){
    console.log('.....');
    setTimeout(function(){
        console.log("Message:",msg.content);
        ch.ack(msg);
    },1000);
}

async function sendCashBack(msg,ch){
    console.log('.....');
    setTimeout(function(){
        console.log("Message:",msg.content);
        ch.ack(msg);
    },1000); 
}

