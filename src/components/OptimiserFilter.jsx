import React, { Component } from 'react'
import Select from 'react-select'
import styled from 'styled-components';
import { FaFilter } from 'react-icons/fa';
import './form.css';
import "../common.css";
import { mapping } from '../assets/config';

const FormContainer = styled.form`
    
`

const FilterToggle = styled.div`
    margin: 1em 1.5em 0em 1.5em;
    width: auto;
    display: block;

    @media screen and (min-width: 800px){
        display: none;
    }

`

const FormTitle = styled.div`
    margin-bottom: 5px;
`

const FieldContainer = styled.div`
    margin: 1em 1.5em 0em 1.5em;
    display: ${(props) => props.showFilter ? "block" : "none"};

    @media screen and (min-width: 800px){
        display: block;
        margin: 1em 0 0 0;
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

export default class OptimiserFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFilter: false,
            targetPosition: null,
            ...props.currentSkills
        };

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeFinal = this.handleChangeFinal.bind(this);
    }

    componentDidMount() {
    }

    handleSelectChange(value, action) {
        const name = action.name;
        let val = null;
        if (name === "targetPosition") {
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
        this.props.onSubmit({
            targetPosition: this.state.targetPosition,
            currentSkills: {
                programming: this.state.programming,
                BI: this.state.BI,
                DB: this.state.DB,
                cloud: this.state.cloud
            }
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ showFilter: false })
        this.props.onSubmit(this.state)
    }

    render() {
        const positionOptions = this.props.positionOptions.map((item) => {
            return { label: item, value: item }
        })

        // const countryOptions = {}

        return (
            <FormContainer onSubmit={this.handleSubmit}>
                <FilterToggle className='button noselect' onClick={() => this.setState(prevState => ({ showFilter: !prevState.showFilter }))}>
                    <FaFilter /><span>&nbsp;&nbsp;</span>
                    Filter
                </FilterToggle>

                <FieldContainer showFilter={this.state.showFilter}>
                    <FormField>
                        <FormTitle>
                            Target Position:
                        </FormTitle>
                        <Select name="targetPosition" options={positionOptions} isClearable={true} isSearchable={false} onChange={this.handleSelectChange} />
                    </FormField>

                    <hr/>
                    {
                        Object.keys(this.props.skillSet).map((cat, index) => {
                            const skillOptions = Array.from(this.props.skillSet[cat]).map((item) => {
                                return { label: item, value: item }
                            })
                            return (
                                <FormField key={index}>
                                    <FormTitle>
                                        {mapping[cat]}
                                    </FormTitle>
                                    <Select name={cat} options={skillOptions} isSearchable={false} value={this.state[cat].map((item) => { return { label: item, value: item } })} onChange={this.handleSelectChange} isMulti={true} />
                                </FormField>
                            )
                        })
                    }

                    {/* <FormField>
                        <FormTitle>
                            Show Top <span className="underline">&nbsp;{this.state.topN}&nbsp;</span> Items:
                        </FormTitle>
                        <input name="topN" type="range" min="3" max="10" defaultValue={6} className="rangeSlider" onChange={this.handleSliderChange} />
                    </FormField> */}

                    {/* <FormField>
                        <ToggleContainer>
                            <div>Show Percentage:</div>
                            <label className="switch">
                                <input name="showPercentage" type="checkbox" defaultChecked={true} onChange={this.handleSliderChange} />
                                <span className="toggleSlider round" />
                            </label>
                        </ToggleContainer>
                    </FormField> */}

                    {/* <FormField>
                        <input type="submit" value="Search" className="button" />
                    </FormField> */}
                </FieldContainer>

            </FormContainer >
        )
    }
}
