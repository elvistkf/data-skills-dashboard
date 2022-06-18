import React, { Component } from 'react'
import styled from 'styled-components'
import Chart from '../components/Chart'
import Form from '../components/Form'
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner'
import responseData from '../assets/response.json';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ControlContainer = styled.div`
    min-width: 15%;
`

const DashboardContainer = styled.div`
    padding: 1em 1em 1em 1em;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    flex-grow: 2;
`

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "idle",
            country: null,
            position: null,
            region: [],
            topN: 7,
            showPercentage: true,
            data: {},
        }
        this.region = new Set();
        this.position = new Set();
        this.country = new Set();

        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.responseData = null
    }

    componentDidMount() {
        this.fetchData();
        // this.responseData = responseData.documents;
        this.setState({ status: "fetched" }, this.handleFetch)
    }

    async fetchData() {
        try {
            const response = await axios.get("https://data.mongodb-api.com/app/data-skills-api-ihkuj/endpoint/api/skills");
            this.responseData = response.data;
        } catch (e) {
            console.error(e);
            this.responseData = responseData.documents;
        } finally {
            this.setState({ status: "fetched" }, this.handleFetch)
        }
    }

    handleFetch = () => {
        this.processData()
        this.setState({ status: "fetched" })
    }

    processRegion = (country, region) => {
        if (country !== "Canada" || country === null) {
            return region;
        }
        if (region.toLowerCase().includes("remote")) {
            return "Remote";
        }
        const regionSplit = region.split(", ")
        if (regionSplit.length === 1) {
            return null;
        }
        return regionSplit[1]
    }

    processData = () => {
        let skill_set = {
            degree: {},
            major: {},
            programming: {},
            BI: {},
            cloud: {},
            DB: {}
        }

        this.region = new Set();

        const updatePositionSet = this.position.size === 0;
        const updateCountrySet = this.country.size === 0;
        
        let count = 0;
        if (!this.responseData) {
            return;
        }
        this.responseData.forEach(item => {
            const processedRegion = this.processRegion(item.country, item.location);

            if (updateCountrySet) {
                this.country.add(item.country);
            }
            if (updatePositionSet) {
                this.position.add(item.category);
            }

            if (
                (item.country !== this.state.country && this.state.country !== null) || 
                (item.category !== this.state.position && this.state.position !== null) 
            ) {
                return;
            }
            
            if (processedRegion !== null) {
                this.region.add(processedRegion);
            }

            if ((!this.state.region.includes(processedRegion)) && this.state.region.length !== 0) {
                return;
            }

            count++;
            for (let cat in skill_set) {
                if (!(cat in item)) {
                    continue;
                }
                item[cat].forEach(skill => {
                    skill_set[cat][skill] = (skill_set[cat][skill] || 0) + 1;
                })
            }
        });

        for (let cat in skill_set) {
            let tmpArray = [];
            let tmpObject = {};
            for (let skill in skill_set[cat]) {
                tmpArray.push([skill, skill_set[cat][skill]]);
            }
            tmpArray.sort((a, b) => {
                return b[1] - a[1];
            })
            tmpArray = tmpArray.slice(0, this.state.topN);
            // eslint-disable-next-line
            tmpArray.forEach(item => {
                tmpObject[item[0]] = item[1] * (this.state.showPercentage ? 100 / count : 1);
            })
            skill_set[cat] = tmpObject;
        }

        this.setState({ data: skill_set });
        console.log(count)
    }

    handleFormSubmit = (form) => {
        this.setState(form, this.processData);
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col sm="4" xl="2">
                        <ControlContainer>
                            <Form onSubmit={this.handleFormSubmit} regionOptions={Array.from(this.region)} 
                                positionOptions={Array.from(this.position)} countryOptions={Array.from(this.country)} />
                        </ControlContainer>
                    </Col>
                    <Col>
                        {
                            this.state.data.degree && this.state.status === "fetched" ? (
                                <DashboardContainer>
                                    <Chart data={this.state.data.degree} showPercentage={this.state.showPercentage} indexAxis="y" title="Degree" />
                                    <Chart data={this.state.data.major} showPercentage={this.state.showPercentage} indexAxis="y" title="Major" />
                                    <Chart data={this.state.data.programming} showPercentage={this.state.showPercentage} title="Programming Language" />
                                    <Chart data={this.state.data.BI} showPercentage={this.state.showPercentage} title="BI Software" />
                                    <Chart data={this.state.data.DB} showPercentage={this.state.showPercentage} title="Database" />
                                    <Chart data={this.state.data.cloud} showPercentage={this.state.showPercentage} title="Cloud Platform" />
                                </DashboardContainer>
                            ) :
                                <DashboardContainer>
                                    <Spinner animation="border" variant="primary" />
                                </DashboardContainer>
                        }
                    </Col>
                </Row>
            </Container >
        )
    }
}

export default Dashboard