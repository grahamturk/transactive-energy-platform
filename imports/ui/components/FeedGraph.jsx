import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Select from 'react-select';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Label } from 'recharts';
import { Grid, Row, Col, Button } from 'react-bootstrap';

export default class FeedGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFeed: '',
            feedData: [],
            hasFeedData: false,
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    getFeeds() {
        return [
            { value: 'counter', label: 'Counter' },
            { value: 'welcome-feed', label: 'Welcome' },
        ];
    }

    handleSelect(val) {
        this.setState({
            selectedFeed: val,
        });
    }

    handleClick() {
        //console.log(this.state.selectedFeed);
        const self = this;
        Meteor.call('fetchFeedData', this.state.selectedFeed, (error, result) => {
            if (error) {
                alert(error.error);
                self.setState({
                    hasFeedData: false,
                    feedData: [],
                });
            } else {
                //console.log(result);
                self.setState({
                    hasFeedData: true,
                    feedData: result,
                });
            }
        });
    }


    render() {
        const options = this.getFeeds();
        let graphComponent = '';
        if (this.state.hasFeedData) {

            //console.log('feedData:');
            //console.log(this.state.feedData);
            let endata = [];
            console.log('raw feed data');
            console.log(this.state.feedData);
            let elemNum = this.state.feedData.length;
            for (let elem of this.state.feedData) {
                endata.push({
                    timestamp: elem.created_at,
                    value: parseInt(elem.value),
                });
                elemNum -= 1;
            }

            endata.reverse();

            const endata2 = [
                {
                    timestamp: 1,
                    value: 10,
                },
                {
                    timestamp: 2,
                    value: 25,
                },
                {
                    timestamp: 3,
                    value: 20,
                },
            ];

            graphComponent = (
                <LineChart layout='horizontal'
                           width={600}
                           height={300}
                           data={endata}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis tick={false} dataKey="timestamp">
                        <Label value="Time" offset={0} position="insideBottom" />
                    </XAxis>
                    <YAxis>
                        <Label value="kWh" offset={0} position="insideLeft" />
                    </YAxis>
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{r: 5}}/>
                </LineChart>
            );
        }

        return (
            <Grid>
                <Row>
                    <Col md={12}>
                        <p>
                            Please select a feed to view its data stream:
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Select
                            name="selected-state"
                            options={options}
                            onChange={this.handleSelect.bind(this)}
                            value={this.state.selectedFeed}
                            simpleValue
                            clearable
                            autoFocus
                        />
                    </Col>
                    <Col md={4}>
                        <Button bsStyle="primary" disabled={!this.state.selectedFeed} onClick={this.handleClick}>
                            Get Feed Data!
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        { graphComponent }
                    </Col>
                </Row>
            </Grid>
        );
    }
}