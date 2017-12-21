import { Meteor } from 'meteor/meteor';

Meteor.publish('Meteor.users.userInfo', function() {
    if (this.userId) {
        return Meteor.users.find({_id: this.userId}, {fields: {userInfo: 1}});
    } else {
        this.ready();
    }
});

Meteor.publish('Meteor.users.balance', function() {
    if (this.userId) {
        return Meteor.users.find({_id: this.userId}, {fields: {balance: 1}});
    } else {
        this.ready();
    }
});

Meteor.publish('Meteor.users.txId', function() {
    if (this.userId) {
        return Meteor.users.find({_id: this.userId}, {fields: {txId: 1}});
    } else {
        this.ready();
    }
});

Meteor.publish('Meteor.users', function() {
    if (this.userId) {
        return Meteor.users.find({}, { sort: { "userInfo.monthlyConsumption": 1 } }, { fields: { 'userInfo.name': 1, txId: 1, 'userInfo.monthlyConsumption': 1 } });
        //return Meteor.users.find({}, {fields: {emails: 1}});
    } else {
        this.ready();
    }
});

