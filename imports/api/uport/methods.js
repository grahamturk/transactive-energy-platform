import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({

    'uportAddCredentials'(credentials) {
        check(credentials, Object);
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        // Request credentials to login

        console.log(credentials);
        return Meteor.users.update(this.userId, { $set: { uportCredentials: credentials } });
    },

    'uportCallMethod'(contractInstance) {
        const user = Meteor.users.findOne(this.userId);

        const userCredentials = user.uportCredentials;

    }
});
