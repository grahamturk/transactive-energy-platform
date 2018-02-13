import Artifactor from 'truffle-artifactor';
//import { Meteor } from 'meteor/meteor';
//import { HTTP } from 'meteor/http';

const ArtifactGenerator = {
    init: function() {
        console.log('inside artifact generator');
        /*HTTP.get(Meteor.absoluteUrl("EnergyMarket.json"), function (err, result) {
            let contract_data = {
                contract_name: result.data.contractName,
                abi: result.data.abi,
            };

            artifactor.save(contract_data, "./EnergyMarket.sol.js");
        });
        */
    }
};

export default ArtifactGenerator;