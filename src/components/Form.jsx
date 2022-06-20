import React, { Component } from 'react'
import Select from 'react-select'
import styled from 'styled-components';
import { FaFilter } from 'react-icons/fa';
import './form.css';

const FormContainer = styled.form`
    
`

const FilterToggle = styled.div`
    margin-top: 1em;
    display: block;

    @media screen and (min-width: 800px){
        display: none;
    }

`

const FormTitle = styled.div`
    margin-bottom: 5px;
`

const FieldContainer = styled.div`
    margin-top: 1em;
    display: ${(props) => props.showFilter ? "block" : "none"};

    @media screen and (min-width: 800px){
        display: block;
    }
`

const FormField = styled.label`
    margin-bottom: 1em;
    display: block;
`

const ToggleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            country: null,
            position: null,
            region: [],
            topN: 6,
            showPercentage: "on",
            showFilter: false
        };

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSelectChange(value, action) {
        const name = action.name;
        let val = null;
        if (name !== "region") {
            val = value === null ? null : value.label;
        }
        else {
            val = value.map(item => item.label)
        }
        
        this.setState({ [name]: val }, this.handleChangeFinal)
    }

    handleSliderChange(event) {
        const target = event.target;
        const name = target.name;
        const val = target.type === "range" ? target.value : target.checked;

        this.setState({ [name]: val }, this.handleChangeFinal)
    }

    handleChangeFinal(event) {
        this.props.onSubmit(this.state)
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ showFilter: false })
        this.props.onSubmit(this.state)
    }

    render() {
        const regionOptions = this.props.regionOptions.map(item => {
            return { label: item, value: item };
        })

        const positionOptions = this.props.positionOptions.map(item => {
            return { label: item, value: item };
        })

        const countryOptions = this.props.countryOptions.map(item => {
            return { label: item, value: item };
        })
        
        return (
            <FormContainer onSubmit={this.handleSubmit}>
                <FilterToggle className='button noselect' onClick={() => this.setState({ showFilter: !this.state.showFilter })}>
                    <FaFilter /><span>&nbsp;&nbsp;</span>
                    Filter
                </FilterToggle>

                <FieldContainer showFilter={this.state.showFilter}>
                    <FormField>
                        <FormTitle>
                            Country:
                        </FormTitle>
                        <Select name="country" options={countryOptions} isClearable={true} isSearchable={false} onChange={this.handleSelectChange} />
                    </FormField>

                    <FormField>
                        <FormTitle>
                            Region:
                        </FormTitle>
                        <Select name="region" options={regionOptions} isSearchable={false} onChange={this.handleSelectChange} isMulti={true} />
                    </FormField>

                    <FormField>
                        <FormTitle>
                            Position:
                        </FormTitle>
                        <Select name="position" options={positionOptions} isClearable={true} isSearchable={false} onChange={this.handleSelectChange} />
                    </FormField>

                    <FormField>
                        <FormTitle>
                            Show Top <span className="underline">&nbsp;{this.state.topN}&nbsp;</span> Items:
                        </FormTitle>
                        <input name="topN" type="range" min="3" max="10" defaultValue={6} className="rangeSlider" onChange={this.handleSliderChange} />
                    </FormField>

                    <FormField>
                        <ToggleContainer>
                            <div>Show Percentage:</div>
                            <label className="switch">
                                <input name="showPercentage" type="checkbox" defaultChecked={true} onChange={this.handleSliderChange} />
                                <span className="toggleSlider round" />
                            </label>
                        </ToggleContainer>
                    </FormField>

                    {/* <FormField>
                        <input type="submit" value="Search" className="button" />
                    </FormField> */}
                </FieldContainer>

            </FormContainer >
        )
    }
}
