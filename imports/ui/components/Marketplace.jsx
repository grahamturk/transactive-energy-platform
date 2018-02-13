import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';
import EthMarket from './EthMarket.jsx';
import MarketplaceUser from './MarketplaceUser.jsx';

export default class Marketplace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userCashBalance: '',
            userEnergyBalance: '',
            balanceAlertVisible: false,
            transferAlertVisible: false,
            transferSuccessful: false,
            transferErrorMessage: '',
        };

        this.handleBalanceDismiss = this.handleBalanceDismiss.bind(this);
        this.handleTransferDismiss = this.handleTransferDismiss.bind(this);
        this.handleTransfer = this.handleTransfer.bind(this);
    }

    componentDidMount() {
        console.log('in component did mount');
        this.fetchUserBalance();
    }

    fetchUserBalance() {
        Meteor.call('calculateBalances', (error, result) => {
            if (error) {
                console.log('error getting balances');
                console.log(error.message);
                this.setState({
                    balanceAlertVisible: true,
                });
            } else {
                console.log('in client balance return');
                console.log(result);
                this.setState({
                    balanceAlertVisible: false,
                    userCashBalance: result.sek,
                    userEnergyBalance: result.kwh,
                });
            }
        });
    }

    handleBalanceDismiss() {
        this.setState({
            balanceAlertVisible: false,
        });
    }

    handleTransferDismiss() {
        this.setState({
            transferAlertVisible: false,
        });
    }

    handleTransfer(isSuccessful, errMessage) {
        console.log('handling transfer in marketplace component');
        this.setState({
            transferAlertVisible: true,
            transferSuccessful: isSuccessful,
            transferErrorMessage: errMessage,
        });
        this.fetchUserBalance();
    }

    renderUsers() {
        const currentUserTxId = this.props.currentUser && this.props.currentUser.txId;
        return this.props.users.filter(user => user.txId !== currentUserTxId).map(user => {
            return (
                <MarketplaceUser
                    key={user.txId}
                    user={user}
                    onTransfer={this.handleTransfer}/>
            );
        })
    }

    render() {
        const transferAlertStyle = this.state.transferSuccessful ? "success" : "danger";
        const transferAlertMessage = this.state.transferSuccessful ? "Transferred successfully" : this.state.transferErrorMessage;
        const balanceAlertMessage = this.state.balanceAlertVisible ? 'Could not retrieve balance' : '';

        return (
            <Row>
                <Col md={12}>
                    <Row>
                        <Col md={12}>
                            <h3>Microgrid Marketplace</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <h4>Current Balance:</h4>
                            {this.state.balanceAlertVisible ?
                                <Alert bsStyle='danger' onDismiss={this.handleBalanceDismiss}>
                                    <p>{balanceAlertMessage}</p>
                                </Alert> :
                                <div>
                                    <p>Cash: {this.state.userCashBalance} SEK</p>
                                    <p>Energy: {this.state.userEnergyBalance} kWh</p>
                                </div>
                            }
                            {this.state.transferAlertVisible ?
                                <Alert bsStyle={transferAlertStyle} onDismiss={this.handleTransferDismiss}>
                                    <p>{transferAlertMessage}</p>
                                </Alert> :
                                ''
                            }
                        </Col>
                        <Col md = {8}>
                            <h4>Community Members</h4>
                            <ListGroup>
                                {this.renderUsers()}
                            </ListGroup>
                        </Col>
                    </Row>
                    <EthMarket />
                </Col>
            </Row>
        );
    }
}

Marketplace.propTypes = {
    currentUser: PropTypes.object,
    users: PropTypes.array,
};