import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Alert } from 'react-bootstrap';

export default class ProfileInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.userProfile.name,
            consumption: this.props.userProfile.monthlyConsumption,
            alertVisible: false,
            saveSuccessful: false,
        };

        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDismiss = this.handleDismiss.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleSave(event) {
        event.preventDefault();
        const newProfile = {
            name: this.state.name,
            monthlyConsumption: parseInt(this.state.consumption),
        };
        console.log(newProfile);
        const self = this;
        Meteor.call('updateProfile', newProfile, (error, result) => {
            if (error) {
                self.setState({
                    name: this.props.userProfile.name,
                    consumption: this.props.userProfile.monthlyConsumption,
                    alertVisible: true,
                    saveSuccessful: false,
                })
            } else {
                self.setState({
                    alertVisible: true,
                    saveSuccessful: true,
                })
            }
        });
    }

    handleDismiss() {
        this.setState({
            alertVisible: false,
        })
    }

    render() {
        const alertStyle = this.state.saveSuccessful ? "success" : "danger";
        const alertMessage = this.state.saveSuccessful ? "Saved successfully" : "Server error, failed to save";
        return (
            <Row>
                <Col md={12}>
                    <form onSubmit={this.handleSave}>
                        Name: <br />
                        <input
                            type="text"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                        <br />
                        Last month's electricity consumption: <br />
                        <input
                            type="text"
                            name="consumption"
                            value={this.state.consumption}
                            onChange={this.handleChange}
                        />
                        <br />
                        <input type="submit" value="Save" />
                    </form>
                    { this.state.alertVisible ?
                        <Alert bsStyle={alertStyle} onDismiss={this.handleDismiss}>
                            <h4>{alertMessage}</h4>
                        </Alert> :
                        ''
                    }
                </Col>
            </Row>
        );
    }
}

ProfileInfo.propTypes = {
    userProfile: PropTypes.object,
};

