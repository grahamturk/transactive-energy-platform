import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { GlobalFlags } from './global-flags.js';

Meteor.methods({
    'global-flags.insert'(name, value) {
        check(name, String);
        check(value, Boolean);

        GlobalFlags.insert({
            name: name,
            value: value,
        });
    },
    'global-flags.update'(name, newValue) {
        check(name, String);
        check(value, Boolean);

        GlobalFlags.update({ name: name }, { $set: { value: newValue } });
    }
});
