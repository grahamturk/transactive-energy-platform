import { HTTP } from 'meteor/http';
import { uport } from './uport-create';
import './truffle-contract.js';

// import web3 from 'web3';

const EthereumConfig = {

    web3Provider: null,
    contracts: {},

    init: function() {
        return EthereumConfig.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            EthereumConfig.web3Provider = web3.currentProvider;
        } else {
            EthereumConfig.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }

        //web3 = new Web3(EthereumConfig.web3Provider);
        web3 = uport.getWeb3();

        return EthereumConfig.initContract();
    },

    initContract: function() {
        HTTP.get(Meteor.absoluteUrl("EnergyMarket.json"), function (err, result) {
            const EnergyMarketArtifact = result.data;

            console.log('energy market artifact');
            console.log(EnergyMarketArtifact);

            //EthereumConfig.contracts.EnergyMarket = TruffleContract(EnergyMarketArtifact);
            const energyMarketABI = web3.eth.contract(EnergyMarketArtifact.abi);

            //TODO: may have to do asynchronously because on client

            const contractObj = energyMarketABI.at('0xe151709f28864417ed7864c319d9b011074640f4');

            EthereumConfig.contracts.EnergyMarketInstance = contractObj;

            //EthereumConfig.contracts.EnergyMarket.setProvider(EthereumConfig.web3Provider);
            //EthereumConfig.contracts.EnergyMarket.setProvider(uport.getProvider());
        });
    }
};

export default EthereumConfig;
