import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';

const baseUrl = 'http://api.eia.gov/series/?api_key=4f053fdb4a721607bb9f10445e52c152';
console.log("loaded the methods module");

Meteor.methods({
    'fetchEnergyData'(stateAbbr) {
        check(stateAbbr, String);

        const sid = 'ELEC.CONS_TOT.NG-' + stateAbbr + '-98.A';
        console.log(sid);

        this.unblock();
        try {
            const res = HTTP.get(baseUrl, {
                params: {
                    series_id: sid,
                }
            });
            const data = res.data;
            const energyData = data.series[0].data;
            console.log(energyData);
            return energyData;

        } catch(e) {
            throw e;
        }
    }
});