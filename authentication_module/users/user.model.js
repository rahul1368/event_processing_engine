const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    useremail: { type: String, unique: true, required: true },
    userphone: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }
});

const userWalletschema = new Schema({
    username: { type: String, unique: true, required: true },
    balance: { type: Number, required: true,default:0 },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });
userWalletschema.set('toJSON', { virtuals: true });

let user = mongoose.model('User', schema);
let wallet = mongoose.model('UserWalletSchema', userWalletschema);

module.exports = { user,wallet };