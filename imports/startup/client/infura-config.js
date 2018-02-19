import { HTTP } from 'meteor/http';
import { uport } from './uport-create';

// import web3 from 'web3';

const InfuraConfig = {

    contracts: {},

    init: function() {
        return InfuraConfig.initWeb3();
    },

    initWeb3: function() {
        web3 = uport.getWeb3();

        return InfuraConfig.initContract();
    },

    initContract: function() {
        HTTP.get(Meteor.absoluteUrl("EnergyMarket.json"), function (err, result) {
            const energyMarketArtifact = result.data;

            const energyMarketABI = web3.eth.contract(energyMarketArtifact.abi);

            //TODO: may have to do asynchronously because on client

            InfuraConfig.contracts.EnergyMarketInstance = energyMarketABI.at('0xcd0abd1071f7012a3bd9694a312913bc338277b1');

            //InfuraConfig.contracts.EnergyMarket.setProvider(uport.getProvider());
        });
    }
};

export default InfuraConfig;
