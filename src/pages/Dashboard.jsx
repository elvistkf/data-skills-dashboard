import React, { Component } from 'react'
import styled from 'styled-components'
import Form from '../components/Form'
import axios from "axios";
import responseData from '../assets/response.json';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from '../components/Card';
import BarChart from '../components/BarChart';
import Loading from '../components/Loading';


const ControlContainer = styled.div`
    /* min-width: 15%; */
`

const DashboardContainer = styled.div`
    /* border: 1px solid red; */
`

const ChartContainer = styled.div`
    padding: 1em 1em 1em 1em;
    margin: 0em;
    width: 100%;
    height: 100%;
    /* display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap; */
    display: grid;
    min-width: 0;
    grid-template-columns: repeat(3, 33%);

    @media screen and (max-width: 1200px) {
        grid-template-columns: repeat(2, 50%);
    }

    @media screen and (max-width: 768px) {
        grid-template-columns: repeat(1, 100%);
    }
`

const CardContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    margin: 0em;
    margin-top: 0.5em;
    padding: 1em 1em 1em 1em;
    @media screen and (max-width: 768px){
        /* font-size: small; */
        padding: 0;
    }
`

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "idle",
            country: null,
            position: null,
            region: [],
            topN: 6,
            showPercentage: true,
            data: {},
        }
        this.region = new Set();
        this.position = new Set();
        this.country = new Set();
        this.count = 0;
        this.mostInDemand = "";

        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.responseData = null
    }

    componentDidMount() {
        this.fetchData();
        // this.responseData = responseData.documents;
        // this.setState({ status: "fetched" }, this.handleFetch)
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

    formatRegion = (country, region) => {
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

        this.count = 0;
        if (!this.responseData) {
            return;
        }
        this.responseData.forEach(item => {
            const formattedRegion = this.formatRegion(item.country, item.location);

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

            if (formattedRegion !== null) {
                this.region.add(formattedRegion);
            }

            if ((!this.state.region.includes(formattedRegion)) && this.state.region.length !== 0) {
                return;
            }

            this.count++;
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
                tmpObject[item[0]] = item[1] * (this.state.showPercentage ? 100 / this.count : 1);
            })
            skill_set[cat] = tmpObject;
        }

        let tmpArray = [];
        for (let cat in skill_set) {
            if (cat === "degree" || cat === "major") {
                continue
            }
            for (let skill in skill_set[cat]) {
                tmpArray.push([skill, skill_set[cat][skill]])
            }
            tmpArray.sort((a, b) => {
                return b[1] - a[1];
            })
            tmpArray = tmpArray.slice(0, 3);
        }
        this.mostInDemand = tmpArray.map(item => item[0]).join(", ")

        this.setState({ data: skill_set });
    }

    handleFormSubmit = (form) => {
        this.setState(form, this.processData);
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col lg="3" xl="2">
                        <ControlContainer>
                            <Form onSubmit={this.handleFormSubmit} regionOptions={Array.from(this.region)}
                                positionOptions={Array.from(this.position)} countryOptions={Array.from(this.country)} />
                        </ControlContainer>
                    </Col>
                    <Col>
                        {
                            this.state.data.degree && this.state.status === "fetched" ? (
                                <DashboardContainer>
                                    <CardContainer>
                                        <Card title={"Number of Jobs"} value={this.count} />
                                        <Card title={"Most In-Demand Skills"} value={this.mostInDemand} />
                                        <Card title={"Region with Most Jobs"} />
                                    </CardContainer>
                                    <ChartContainer>
                                        <BarChart data={this.state.data.degree} showPercentage={this.state.showPercentage} indexAxis="y" title="Degree" />
                                        <BarChart data={this.state.data.major} showPercentage={this.state.showPercentage} indexAxis="y" title="Major" />
                                        <BarChart data={this.state.data.programming} showPercentage={this.state.showPercentage} title="Programming Language" />
                                        <BarChart data={this.state.data.BI} showPercentage={this.state.showPercentage} title="BI Software" />
                                        <BarChart data={this.state.data.DB} showPercentage={this.state.showPercentage} title="Database" />
                                        <BarChart data={this.state.data.cloud} showPercentage={this.state.showPercentage} title="Cloud Platform" />
                                        {/* <LineChart></LineChart> */}
                                    </ChartContainer>
                                </DashboardContainer>

                            ) :
                                <Loading />
                        }
                    </Col>
                </Row>
            </Container >
        )
    }
}

export default Dashboard