import { Accounts } from 'meteor/accounts-base';
import ledger from './ledger-create.js';
import { Random } from 'meteor/random';

console.log('inside accounts server hook');

// Create an account for the user (no need to save it as we can always address it with an alias)
Meteor.startup(() => {
    Accounts.onCreateUser((options, user) => {
        console.log('top-level on create user');
        const userAlias = String(user._id);

        // TODO: Wrap this in Async so that user is not a promise but just a regular object
        ledger.accounts.create({
            alias: userAlias,
            keys: [{alias: 'exchange'}],
            tags: {type: 'user'},
        }).then(acct => {
            ledger.transactions.transact(builder => {
                builder.issue({
                    assetAlias: 'sek',
                    amount: 10000,
                    destinationAccountAlias: userAlias,
                    referenceData: {source: 'initialCurrencyDeposit'},
                });
                builder.issue({
                    assetAlias: 'kwh',
                    amount: 100,
                    destinationAccountAlias: userAlias,
                    referenceData: {source: 'initialEnergyDeposit'},
                });
            });
        }).catch(err => {
            console.log('in err catch block');
            console.log(err.message);
        });

        console.log('constructing user object');
        user.txId = Random.id(); // Need to add the `random` package
        user.userInfo = {
            name: '',
            monthlyConsumption: '',
        };

        if (options.profile) {
            user.profile = options.profile;
        }
        return user;

        /*
        ledger.accounts.create({
            alias: userAlias,
            keys: [{alias: 'exchange'}],
            tags: {type: 'user'},
        }, (err, result) => {
            console.log('currency account callback');
            if (err) {
                console.log('account creation');
                console.log(err.message);
            }
        });

        console.log('between account and issue');

        ledger.transactions.transact(builder => {
            builder.issue({
                assetAlias: 'sek',
                amount: 10000,
                destinationAccountAlias: userAlias,
                referenceData: {source: 'initialCurrencyDeposit'},
            });
            builder.issue({
                assetAlias: 'kwh',
                amount: 100,
                destinationAccountAlias: userAlias,
                referenceData: {source: 'initialEnergyDeposit'},
            });
        }, (err, result) => {
            console.log('transact callback');
            if (err) {
                console.log('initial deposit');
                console.log(err.message);
            }
        });
        */
    });
});

