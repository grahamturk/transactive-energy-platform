import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Row, Col } from 'react-bootstrap';

const CONVERSION_FACTORS = {
    LAPTOP: 70.0,
    HOME: 1228.0,
    LIGHTBULB: 60.0,
};

export default class ConsumptionReference extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedReference: 'LAPTOP',
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    getOptions() {
        return [
            { value: 'LAPTOP', label: 'Laptops' },
            { value: 'HOME', label: 'Homes' },
            { value: 'LIGHTBULB', label: 'Lightbulbs' },
        ];
    }

    handleSelect(val) {
        this.setState({
          selectedReference: val,
        });
    }

    render() {
        const options = this.getOptions();
        console.log(this.props.currentConsumption);
        const convertedValue = Math.floor(this.props.currentConsumption / CONVERSION_FACTORS[this.state.selectedReference]);
        const imgString = '/img/' + this.state.selectedReference + '.png';
        return (
            <Row>
                <Col className="aligned-col" md={1}>
                    <h4> = {convertedValue}</h4>
                </Col>
                <Col className = "aligned-col" md={3}>
                    <Select
                        name="selected-reference"
                        options={options}
                        onChange={this.handleSelect.bind(this)}
                        value={this.state.selectedReference}
                        simpleValue
                        clearable
                    />
                </Col>
                <Col md={4}>
                    <img src={imgString} alt=''/>
                </Col>
            </Row>
        );
    }
}

ConsumptionReference.propTypes = {
    currentConsumption: PropTypes.number,
};
