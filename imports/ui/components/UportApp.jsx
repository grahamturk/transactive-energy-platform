import React, { Component } from 'react';

import { Grid, Row, Col, Button, Jumbotron } from 'react-bootstrap';
import { uport } from '../../../imports/startup/client/uport-create.js';

import UportMarket from './UportMarket.jsx';

export default class UportApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            userCredentials: {},
        };
        this.renderUportModal = this.renderUportModal.bind(this);
    }

    renderUportModal() {
        uport.requestCredentials({
            requested: ['name', 'avatar', 'country', 'address', 'aioKey'],
            notifications: true,
        }).then(credentials => {
            console.log(credentials);
            this.setState({
                userCredentials: credentials,
                isLoggedIn: true,
            });
        }).catch(err => {
            console.log(err);
        })
    }

    render() {
        return (
            <div className="container">
                <Grid>
                    {this.state.isLoggedIn ? <UportMarket credentials={this.state.userCredentials}/> :
                        <Row>
                            <Col md={2} mdOffset={5}>
                                <Jumbotron>
                                    <Button bsStyle="primary" bsSize="large" onClick={this.renderUportModal}>
                                        Connect with uPort!
                                    </Button>
                                </Jumbotron>
                            </Col>
                        </Row> }
                </Grid>
            </div>
        );
    }
}


