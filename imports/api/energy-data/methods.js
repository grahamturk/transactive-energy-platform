import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
import ledger from '../../startup/server/ledger-create.js';

const baseUrl = 'http://api.eia.gov/series/?api_key=4f053fdb4a721607bb9f10445e52c152';
//console.log("loaded the methods module");

Meteor.methods({
    'fetchEnergyData'(stateAbbr) {
        check(stateAbbr, String);

        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        const sid = 'ELEC.CONS_TOT.NG-' + stateAbbr + '-98.A';
        //console.log(sid);

        this.unblock();
        try {
            const res = HTTP.get(baseUrl, {
                params: {
                    series_id: sid,
                }
            });
            const data = res.data;
            const energyData = data.series[0].data;
            //console.log(energyData);
            return energyData;

        } catch(e) {
            throw e;
        }
    },

    /*
    'fetchLeaderboard'() {
        //console.log(Meteor.users.find({}, { sort: { "userInfo.monthlyConsumption":  -1 } }).fetch());
        return Meteor.users.find({}, { sort: { "userInfo.monthlyConsumption": 1 } }).map(user => {
            return (
                {
                    name: user.userInfo.name,
                    email: user.emails[0].address,
                    consumption: user.userInfo.monthlyConsumption,
                }
            );
        });
    },
    */

    'updateProfile'(newProfile) {
        check(newProfile, Object);
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        Meteor.users.update(this.userId, { $set: { userInfo: newProfile } });
        // publish this top level info
    },

    'calculateBalances'() {
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        return ledger.balances.queryAll({
            filter: 'account_alias=$1',
            filterParams: [this.userId],
            sumBy: ['asset_alias']
        }).then(balances => {
            console.log('successfully got balances');
            let balanceObj = {};
            for (let i in balances) {
                const balance = balances[i];
                balanceObj[balance.sumBy.assetAlias] = balance.amount;
            }
            return balanceObj;
        }).catch(err => {
            console.log(err.message);
            throw err;
        });
    },

    'enactTransfer'(cashAmount, energyAmount, destTxId) {
        check(cashAmount, Number);
        check(energyAmount, Number);
        check(destTxId, String);

        console.log('transfer amounts:');
        console.log(cashAmount);
        console.log(energyAmount);

        console.log('in enact transfer');
        const self = this;
        return ledger.transactions.transact(builder => {
            const user = Meteor.users.findOne({'txId': destTxId});

            if (cashAmount > 0) {
                console.log('inside cash amount positive');
                builder.transfer({
                    assetAlias: 'sek',
                    amount: cashAmount,
                    sourceAccountAlias: String(self.userId),
                    destinationAccountAlias: String(user._id),
                    referenceData: {
                        type: 'p2p_payment',
                        subtype: 'cash_exchange',
                    },
                });
            }

            if (energyAmount > 0) {
                console.log('inside energy amount positive');
                builder.transfer({
                    assetAlias: 'kwh',
                    amount: energyAmount,
                    sourceAccountAlias: String(self.userId),
                    destinationAccountAlias: String(user._id),
                    referenceData: {
                        type: 'p2p_payment',
                        subtype: 'energy_exchange',
                    }
                });
            }
        }).catch(err => {
            throw err;
        });
    },

    'deposit'(amount) {
        ledger.transactions.transact(builder => {
            builder.issue({
                assetAlias: 'sek',
                amount: amount,
                destinationAccountAlias: String(this.userId),
                referenceData: {
                    type: 'userDeposit',
                    system: '',
                }
            })
        })
    },

    'cashOut'(amount) {
        ledger.transactions.transact(builder => {
            builder.retire({
                assetAlias: 'sek',
                amount: amount,
                sourceAccountAlias: String(this.userId),
                referenceData: {
                    type: 'withdrawal',
                    system: '',
                }
            })
        })
    }
});