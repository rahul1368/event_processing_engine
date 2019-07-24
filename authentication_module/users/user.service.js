const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;
const publishToQueue = require('../../services/MQService');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    topUpBalance
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
    //put actions to queue
    let queue= "user-messages";
    let payload_1 = {"useremail":user.useremail,"userphone":user.userphone,"event":"send_confirmation_email"};
    let payload_2 = {"useremail":user.useremail,"userphone":user.userphone,"event":"send_confirmation_sms"};
    let payload_3 = {"useremail":user.useremail,"userphone":user.userphone,"event":"create_wallet_account"};
    await publishToQueue(queue,payload_1);
    await publishToQueue(queue,payload_2);
    await publishToQueue(queue,JSON.payload_3);
    
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function topUpBalance(userParam){
    //find the user from the database and perform actions related to topUpBalance here


    // and finally push events that need to be published into the queue
    let payload_1 = {"useremail":user.useremail,"userphone":user.userphone,"event":"send_confirmation_email"};
    let payload_2 = {"useremail":user.useremail,"userphone":user.userphone,"event":"send_cashback"};
    await publishToQueue(queue,payload_1);
    await publishToQueue(queue,payload_2);
}