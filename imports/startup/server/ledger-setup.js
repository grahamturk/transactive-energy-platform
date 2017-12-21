import ledger from './ledger-create.js';
import { Meteor } from 'meteor/meteor';
import { GlobalFlags } from '../../../imports/api/global-flags/global-flags.js';


Meteor.startup(() => {

    if (GlobalFlags.findOne({name: 'ledger-setup'})) {
        console.log('ledger already setup');
        return;
    }

    console.log('proceeding with ledger setup');

    ledger.keys.create({alias: 'treasury'}).then(key1 => {
        return ledger.keys.create({alias: 'exchange'});
    }).then(key2 => {
        return ledger.assets.create({
            alias: 'sek',
            keys: [{alias: 'treasury'}],
            tags: {type: 'currency'},
        });
    }).then(sekAsset => {
        return ledger.assets.create({
            alias: 'kwh',
            keys: [{alias: 'treasury'}],
            tags: {type: 'energy'},
        });
    }).then(kwhAsset => {
        Meteor.call('global-flags.insert', 'ledger-setup', true, (error) => {
            if (error) {
                console.log(error);
            }
        });
    }).catch(err => {
        console.log(err.message);
    });

    /*
    ledger.keys.create({alias: 'treasury'}, (err, result) => {
        if (err) {
            console.log('treasury key');
            console.log(err.message);
        }
    });
    ledger.keys.create({alias: 'exchange'}, (err, result) => {
        if (err) {
            console.log('exchange key');
            console.log(err.message);
        }
    });
    ledger.assets.create({
        alias: 'sek',
        keys: [{alias: 'treasury'}],
        tags: {type: 'currency'},
    }, (err, result) => {
        if (err) {
            console.log('sek asset');
            console.log(err.message);
        }
    });
    ledger.assets.create({
        alias: 'kwh',
        keys: [{alias: 'treasury'}],
        tags: {type: 'energy'},
    }, (err, result) => {
        if (err) {
            console.log('kwh asset');
            console.log(err.message);
        }
    });
    */
});