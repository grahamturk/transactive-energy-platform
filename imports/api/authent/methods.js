import { Meteor, Accounts } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
    'authent.register'(userinfo) {
        Accounts.validateNewUser((user) => {
            new SimpleSchema({
                _id
            })
        })
    }
});