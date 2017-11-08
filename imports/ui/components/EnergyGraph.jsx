import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Select from 'react-select';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';

export default class EnergyGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedState: '',
            energyData: [],
            hasEnergyData: false,
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    getStates() {
        return [
            { value: 'CA', label: 'California' },
            { value: 'FL', label: 'Florida' },
            { value: 'NY', label: 'New York' },
            { value: 'TX', label: 'Texas' },
        ];
    }

    handleSelect(val) {
        this.setState({
            selectedState: val,
        });
    }

    handleClick() {
        console.log(this.state.selectedState);
        const self = this;
        Meteor.call('fetchEnergyData', this.state.selectedState, (error, result) => {
            if (error) {
                console.log('inside error in client');
                alert(error.error);
                self.setState({
                    hasEnergyData: false,
                    energyData: [],
                });
            } else {
                console.log('inside return client');
                console.log(result);
                self.setState({
                    hasEnergyData: true,
                    energyData: result,
                });
            }
        });
    }


    render() {
        const options = this.getStates();
        let graphComponent = '';
        if (this.state.hasEnergyData) {

            console.log('energyData');
            console.log(this.state.energyData);
            const endata = [];
            for (let pair of this.state.energyData) {
                endata.push({
                    year: pair[0],
                    consumption: pair[1],
                });
            }

            endata.reverse();

            graphComponent = (
                <LineChart layout='horizontal'
                           width={600}
                           height={300}
                           data={endata}>
                    <XAxis dataKey="year" name="year"/>
                    <YAxis name="thousand Mcf"/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Legend/>
                    <Line type="monotone" dataKey="consumption" stroke="#8884d8" activeDot={{r: 8}}/>
                </LineChart>
            );
        }

        return (
            <div>
                <Select
                    name="selected-state"
                    options={options}
                    onChange={this.handleSelect.bind(this)}
                    value={this.state.selectedState}
                    simpleValue
                    clearable
                    autofocus
                />
                <button disabled={!this.state.selectedState} onClick={this.handleClick}>
                    Get Energy Data!
                </button>
                { graphComponent }
            </div>
        );
    }
}