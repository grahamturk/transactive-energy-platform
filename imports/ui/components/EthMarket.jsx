import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EthereumConfig from '../../startup/client/ethereum-config.js';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button, Label, Alert } from 'react-bootstrap';
import { uport, MNID } from '../../startup/client/uport-create.js';

export default class EthMarket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            availableEnergy: '',
            energyToPurchase: '',
            energyToGenerate: '',
            returnedPurchaseEnergy: '',
            userIsRegistered: false,
            alertVisible: false,
            transactionSuccessful: false,
            alertMessage: '',
        };

        this.energyInstance = {};
        this.ethAccount = {};
        this.networkAddress = '';

        this.setup = this.setup.bind(this);

        this.waitForMined = this.waitForMined.bind(this);
        this.pollingLoop = this.pollingLoop.bind(this);

        this.updateMarket = this.updateMarket.bind(this);
        this.handleRequestCredentials = this.handleRequestCredentials.bind(this);

        this.handleTransact = this.handleTransact.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleGenerate = this.handleGenerate.bind(this);
        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);

        this.handleTextChange = this.handleTextChange.bind(this);
    }

    componentDidMount() {
        console.log('eth market component did mount');
        this.setup();
    }

    waitForMined(txHash, response, pendingCB, successCB) {
        if (response.blockNumber) {
            successCB();
        } else {
            pendingCB();
            this.pollingLoop(txHash, response, pendingCB, successCB)
        }
    };

    pollingLoop(txHash, response, pendingCB, successCB) {
        setTimeout(function () {
            web3.eth.getTransaction(txHash, (error, response) => {
                if (error) { throw error }
                if (response === null) {
                    response = { blockNumber: null };
                } // Some ETH nodes do not return pending tx
                this.waitForMined(txHash, response, pendingCB, successCB);
            })
        }, 1000) // check again in one sec.
    };

    setup() {
        // Fetch user's Ethereum account

        /*web3.eth.getAccounts((error, accounts) => {
            if (error) {
                console.log(error);
            }

            this.ethAccount = accounts[0];
            */

        uport.requestCredentials({
            notifications: true,
        }).then(credentials => {
            console.log(credentials);

            console.log('inside request credentials callback');
            //return Meteor.call('uportAddCredentials', credentials);

            const decodedId = MNID.decode(credentials.address);
            this.networkAddress = decodedId.address;
            this.ethAccount = this.networkAddress;

            // Fetch instance of EnergyMarket contract
            /*
            return EthereumConfig.contracts.EnergyMarket.deployed();
        }).then(instance => {

            console.log('got the instance');
            this.energyInstance = instance;
            */

            this.energyInstance = EthereumConfig.contracts.EnergyMarketInstance;

            console.log('about to return isregistered');
            // Is the user registered with the EnergyMarket contract

            //return this.energyInstance.isRegistered.call(this.ethAccount);


            this.energyInstance.isRegistered.call(this.ethAccount, (error, result) => {
                this.setState({
                    userIsRegistered: result,
                });

                this.energyInstance.getAvailableEnergy.call((error, totalAvailableEnergy) => {
                    this.setState({
                        availableEnergy: totalAvailableEnergy.toNumber(),
                    });
                });
            });
        });

        /*
        }).then(result => {

            console.log('returned result of isRegistered');
            this.setState({
                userIsRegistered: result,
            });

            // Fetch energy available in the market
            return this.energyInstance.getAvailableEnergy.call();
        }).then(totalAvailableEnergy => {
            console.log('got total energy');
            this.setState({
                availableEnergy: totalAvailableEnergy.toNumber(),
            });
        }).catch(err => {
            console.log('Setup error');
            console.log(err.message);

            this.setState({
                alertVisible: true,
                transactionSuccessful: false,
                alertMessage: err.message,
            });
        });
        */
    }

    handleRequestCredentials() {
        uport.requestCredentials({
            notifications: true,
        }).then((credentials) => {
            console.log(credentials);

            //return Meteor.call('uportAddCredentials', credentials);

            const decodedId = MNID.decode(credentials.address);
            this.networkAddress = decodedId.address;

        }).catch((err) => {
            console.log(err.message);
        });
    }

    updateMarket() {
        return this.energyInstance.getAvailableEnergy.call().then(totalAvailableEnergy => {
            this.setState({
                availableEnergy: totalAvailableEnergy.toNumber(),
            });
            /*for (let i = 0; i < pendingTransactions.length; i++) {
                if (!pendingTransactions.claimed) {
                    // display the transaction
                }
            }*/
        }).catch(err => {
            console.log('Update market error');
            console.log(err.message);

            this.setState({
                alertVisible: true,
                transactionSuccessful: false,
                alertMessage: 'Error retrieving total available energy',
            });
        });
    }

    handleRegister(event) {
        event.preventDefault();

        this.energyInstance.registerUser((error, txHash) => {
            if (error) {
                console.log('RegisterUser error');
                console.log(err.message);

                this.setState({
                    userIsRegistered: false,
                    alertVisible: true,
                    transactionSuccessful: false,
                    alertMessage: 'Failed to register. Either user has registered before or server error',
                });
            }
            this.waitForMined(txHash, { blockNumber: null },
                function pendingCB() {
                    this.setState({
                        alertVisible: true,
                        transactionSuccessful: true,
                        alertMessage: 'Waiting for block to be mined',
                    });
                },
                function successCB(data) {
                    console.log('CB success');
                    console.log(data);
                    this.setState({
                        userIsRegistered: true,
                        alertVisible: true,
                        transactionSuccessful: true,
                        alertMessage: 'Successfully registered user for smart contract',
                    });
                })
        });


        // web3.eth.getTransactionReceipt(hashString [, callback])

        /*
        this.energyInstance.registerUser({from: this.ethAccount}).then(result => {
            this.setState({
                userIsRegistered: true,
                alertVisible: true,
                transactionSuccessful: true,
                alertMessage: 'Successfully registered user for smart contract',
            });
        }).catch(err => {
            console.log('RegisterUser error');
            console.log(err.message);

            this.setState({
                userIsRegistered: false,
                alertVisible: true,
                transactionSuccessful: false,
                alertMessage: 'Failed to register. Either user has registered before or server error',
            });
        });
        */
    }

    handleTransact(event) {
        event.preventDefault();

        // grab energy amount
        const energyNum = parseInt(this.state.energyToPurchase);

        this.setState({
            energyToPurchase: '',
        });

        this.energyInstance.purchaseEnergy(energyNum, {from: this.ethAccount}).then(result => {
            let consumedEventLog = undefined;
            for (let i = 0; i < result.logs.length; i++) {
                let log = result.logs[i];
                if (log.event === "Consumed") {
                    consumedEventLog = log;
                    break;
                }
            }

            if (consumedEventLog !== undefined) {
                this.setState({
                    availableEnergy: consumedEventLog.args.newTotal.toNumber(),
                    alertVisible: true,
                    transactionSuccessful: true,
                    alertMessage: 'Successfully purchased energy',
                });
            }

            //return this.updateMarket();
        }).catch(err => {
            console.log('Transact Error');
            console.log(err.message);

            this.setState({
                alertVisible: true,
                transactionSuccessful: false,
                alertMessage: 'Error: failed to purchase energy',
            });
        });
    }

    handleGenerate(event) {
        event.preventDefault();
        const energyNum = parseInt(this.state.energyToGenerate);

        console.log('energy to generate');
        console.log(energyNum);

        this.setState({
            energyToGenerate: '',
        });

        this.energyInstance.generateEnergy(energyNum, {from: this.ethAccount}).then(result => {
            // TODO: make sure this does not cause a state update conflict
            //console.log(result);
            //console.log(result.receipt);
            let generateEventLog = undefined;
            for (let i = 0; i < result.logs.length; i++) {
                 let log = result.logs[i];
                if (log.event === "Generated") {
                    console.log('generated caught');
                    generateEventLog = log;
                    break;
                }
            }

            if (generateEventLog !== undefined) {
                console.log(generateEventLog.args.newTotal.toNumber());
                this.setState({
                    availableEnergy: generateEventLog.args.newTotal.toNumber(),
                    alertVisible: true,
                    transactionSuccessful: true,
                    alertMessage: 'Successfully generated energy',
                });
            }

            //return this.updateMarket();
        }).catch(err => {
            console.log('Generate error');
            console.log(err.message);

            this.setState({
                alertVisible: true,
                transactionSuccessful: false,
                alertMessage: 'Error: generation unsuccessful',
            });
        });

    }

    handleTextChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleAlertDismiss() {
        this.setState({
            alertVisible: false,
        });
    }

    render() {
        const alertStyle = this.state.transactionSuccessful ? "success" : "danger";

        return (
            <Row>
                <Col md={6}>
                    <h2><Label>Ethereum Marketplace</Label></h2>
                    {this.state.alertVisible ?
                        <Alert bsStyle={alertStyle} onDismiss={this.handleAlertDismiss}>
                            <p>{this.state.alertMessage}</p>
                        </Alert> :
                        ''
                    }
                    <Button bsStyle="primary" type="button" onClick={this.handleRequestCredentials}>
                        Request uPort Credentials
                    </Button>
                    <h5>Available energy: {this.state.availableEnergy !== '' ? this.state.availableEnergy : "Still loading"}</h5>
                    <form>
                        <FormGroup
                            controlId="register"
                        >
                            <Button type="submit" onClick={this.handleRegister} disabled={this.state.userIsRegistered}>Register for market</Button>
                        </FormGroup>
                        <FormGroup
                            controlId="generateEnergy"
                        >
                            <ControlLabel>Energy amount to generate</ControlLabel>
                            <FormControl
                                type="text"
                                name="energyToGenerate"
                                value={this.state.energyToGenerate}
                                onChange={this.handleTextChange.bind(this)}
                            />
                            <Button type="submit" onClick={this.handleGenerate}>Submit</Button>
                        </FormGroup>
                        <FormGroup
                            controlId="purchaseEnergy"
                        >
                            <ControlLabel>Energy amount to purchase</ControlLabel>
                            <FormControl
                                type="text"
                                name="energyToPurchase"
                                value={this.state.energyToPurchase}
                                onChange={this.handleTextChange.bind(this)}
                            />
                            <Button type="submit" onClick={this.handleTransact}>Submit</Button>
                        </FormGroup>
                    </form>
                </Col>
            </Row>
        );
    }
}