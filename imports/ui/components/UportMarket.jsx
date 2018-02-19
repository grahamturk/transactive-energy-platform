import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfuraConfig from '../../startup/client/infura-config.js';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button, ButtonToolbar, Alert, Image, Modal } from 'react-bootstrap';
import { uport, MNID } from '../../startup/client/uport-create.js';

export default class UportMarket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            availableEnergy: '',
            userIsRegistered: false,
            alertVisible: false,
            transactionSuccessful: false,
            alertMessage: '',
            showModal: false,
            aioKey: '',
        };

        this.energyInstance = {};
        this.networkAddress = '';

        this.setup = this.setup.bind(this);

        this.waitForMined = this.waitForMined.bind(this);
        this.pollingLoop = this.pollingLoop.bind(this);

        this.handleRequestCredentials = this.handleRequestCredentials.bind(this);

        this.handleRegister = this.handleRegister.bind(this);
        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleAttest = this.handleAttest.bind(this);

        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    closeModal() {
        this.setState({
            showModal: false,
            aioKey: '',
        });
    }

    openModal() {
        this.setState({ showModal: true });
    }

    componentDidMount() {
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
        const decodedId = MNID.decode(this.props.credentials.address);
        this.networkAddress = decodedId.address;

        this.energyInstance = InfuraConfig.contracts.EnergyMarketInstance;

        // Is the user registered with the EnergyMarket contract

        this.energyInstance.isRegistered.call(this.networkAddress, (error, result) => {
            if (error) {
                this.setState({
                    alertVisible: true,
                    transactionSuccessful: false,
                    alertMessage: error.message,
                });
            }

            this.setState({
                userIsRegistered: result,
            });

            this.energyInstance.getAvailableEnergy.call((error, totalAvailableEnergy) => {
                if (error) {
                    this.setState({
                        alertVisible: true,
                        transactionSuccessful: false,
                        alertMessage: error.message,
                    });
                }
                this.setState({
                    availableEnergy: totalAvailableEnergy.toNumber(),
                });
            });
        });
    }

    handleRequestCredentials() {
        uport.requestCredentials({
            requested: ['name', 'avatar', 'country', 'address', 'aioKey'],
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

    handleRegister() {

        // web3.eth.getTransactionReceipt(hashString [, callback])

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
    }

    handleTextChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleAttest(event) {
        event.preventDefault();

        const key = this.state.aioKey;

        uport.attestCredentials({
            sub: this.networkAddress,
            claim: { aioKey: key },
        }).then(res => {
            this.setState({
                alertVisible: true,
                transactionSuccessful: true,
                alertMessage: 'Sign the attestation in the mobile app',
                aioKey: '',
                showModal: false,
            });
        }).catch(err => {
            this.setState({
                alertVisible: true,
                transactionSuccessful: false,
                alertMessage: err.message,
                aioKey: '',
                showModal: false,
            });
        })
    }

    handleAlertDismiss() {
        this.setState({
            alertVisible: false,
        });
    }

    render() {
        const alertStyle = this.state.transactionSuccessful ? "info" : "danger";

        return (
            <div>
                <Row>
                    <Col md={2}>
                        <header className="app-header">
                            <h1>TransactivE</h1>
                        </header>
                    </Col>
                    <Col md={1} mdOffset={8}>
                        <h3>{this.props.credentials.name}</h3>
                    </Col>
                    <Col md={1}>
                        <Image src={this.props.credentials.avatar.uri} circle responsive />
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        {this.state.alertVisible ?
                            <Alert bsStyle={alertStyle} onDismiss={this.handleAlertDismiss}>
                                <p>{this.state.alertMessage}</p>
                            </Alert> :
                            ''
                        }
                        <ButtonToolbar>
                            <Button bsStyle="default" type="button" onClick={this.handleRegister} disabled={this.state.userIsRegistered}>
                                Register for market
                            </Button>
                            <Button bsStyle="success" type="button" onClick={this.openModal}>
                                Attest Credentials
                            </Button>
                            <Button bsStyle="primary" type="button" onClick={this.handleRequestCredentials}>
                                Re-send uPort Credentials
                            </Button>
                        </ButtonToolbar>
                        <h5>Available energy: {this.state.availableEnergy !== '' ? this.state.availableEnergy : "Still loading"}</h5>
                        <Modal show={this.state.showModal}
                               onHide={this.closeModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Attest New Credentials</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
                                    <FormGroup
                                        controlId="attestAioKey"
                                    >
                                        <ControlLabel>Attest your Adafruit IO Key</ControlLabel>
                                        <FormControl
                                            type="text"
                                            name="aioKey"
                                            value={this.state.aioKey}
                                            onChange={this.handleTextChange.bind(this)}
                                        />
                                        <Button type="submit" onClick={this.handleAttest}>Submit</Button>
                                    </FormGroup>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={this.closeModal}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                </Row>
            </div>
        );
    }
}

UportMarket.propTypes = {
    credentials: PropTypes.object,
};