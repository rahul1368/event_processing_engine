const amqp = require('amqplib/callback_api');
const CONN_URL = 'amqp://iupkqwvp:5fziO4WWTNZU25VqvTV-JuTqdMjA6a_2@toad.rmq.cloudamqp.com/iupkqwvp';//'amqp://gsgmnvnl:NITe9ThLkXQvKVLl7L6gEtMllb6obQmw@dinosaur.rmq.cloudamqp.com/gsgmnvnl';

let ch = null;
amqp.connect(CONN_URL, function (err, conn) {
    //console.log(err)
    conn.createChannel(function (err, channel) {
        ch = channel;
    });
});

const publishToQueue = async (queueName, data) => {
    ch.sendToQueue(queueName, new Buffer(JSON.stringify(data)), {persistent: true});
}

process.on('exit', (code) => {
    ch.close();
    console.log(`Closing rabbitmq channel`);
});

module.exports = publishToQueue