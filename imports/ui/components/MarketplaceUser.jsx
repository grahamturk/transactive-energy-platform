import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem, Modal, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default class MarketplaceUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sekAmount: '',
            kwhAmount: '',
            showModal: false,
        };

        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    closeModal() {
        this.setState({
            showModal: false,
            sekAmount: '',
            kwhAmount: '',
        });
    }

    openModal() {
        console.log('listgroupitem clicked');
        this.setState({ showModal: true });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        let sekAmt = 0;
        let kwhAmt = 0;
        if (!(this.state.sekAmount === '')) {
            sekAmt = parseInt(this.state.sekAmount);
        }
        if (!(this.state.kwhAmount === '')) {
            kwhAmt = parseInt(this.state.kwhAmount);
        }

        console.log('about to call enact transfer');
        Meteor.call('enactTransfer', sekAmt, kwhAmt, this.props.user.txId, (error, result) => {
            if (error) {
                this.setState({
                    showModal: false,
                });
                this.props.onTransfer(false, err.message);
            } else {
                this.setState({
                    showModal: false,
                });
                this.props.onTransfer(true, '');
            }
        });
    }

    render() {
        return (
            <div>
                <ListGroupItem onClick={this.openModal}>
                    {this.props.user.name}
                </ListGroupItem>
                <Modal show={this.state.showModal}
                       onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Transfer Assets</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Enter amounts to transfer to {this.props.user.name} (positive values only!)</h4>
                        <form onSubmit={this.handleSubmit}>
                            SEK Amount: <br />
                            <input
                                type="text"
                                name="sekAmount"
                                value={this.state.sekAmount}
                                onChange={this.handleChange}
                            />
                            <br />
                            kWh Amount: <br />
                            <input
                                type="text"
                                name="kwhAmount"
                                value={this.state.kwhAmount}
                                onChange={this.handleChange}
                            />
                            <br />
                            <input type="submit" value="Send" disabled={this.state.sekAmount === '' && this.state.kwhAmount === ''} />
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

MarketplaceUser.propTypes = {
    user: PropTypes.object,
    onTransfer: PropTypes.func,
};