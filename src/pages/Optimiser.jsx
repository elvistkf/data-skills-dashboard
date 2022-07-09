import React, { Component } from 'react'
import { Alert } from 'react-bootstrap';
import styled from 'styled-components';
import OptimiserCard from '../components/OptimiserCard';
import OptimiserFilter from '../components/OptimiserFilter';
import { sortObjectCount, validateFilter } from '../utils';

const BackgroundContainer = styled.div`
	margin: 0em 1em;
	display: grid;
    grid-template-columns: 15% 85%;

	@media screen and (max-width: 1200px) {
        display: grid;
        margin: 0em 0.5em;
        grid-template-columns: 20% 80%;
    }

    @media screen and (max-width: 800px){
        display: block;
    }
`

const CanvasContainer = styled.div`
	margin: 1em;
`

const CardContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 25%);
`

export default class Optimiser extends Component {
	constructor(props) {
		super(props);
		this.responseData = props.data;
		this.state = {
			status: "processing",
			targetPosition: null,
			currentSkills: { "programming": [], "BI": [], "DB": [], "cloud": [] }
		}
		this.positionOptions = new Set();
		this.skillCount = {
			"programming": {},
			"BI": {},
			"DB": {},
			"cloud": {}
		};
		this.skillSet = {
			"programming": new Set(),
			"BI": new Set(),
			"DB": new Set(),
			"cloud": new Set()
		};
		this.jobCount = 0;
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	componentDidMount() {
		if (this.responseData) {
			this.processData();
		}
	}

	processData() {
		this.extractPositions();
		this.extractSkills();
		this.calculateConditionalProbabilities()
		this.setState({ status: "processed" })
	}

	extractPositions() {
		let positions = new Set();

		this.responseData.forEach((item) => {
			positions.add(item.category)
		})

		this.positionOptions = positions;
	}

	extractSkills() {
		let skillCount = {
			"programming": {},
			"BI": {},
			"DB": {},
			"cloud": {}
		};
		let skillSet = {
			"programming": new Set(),
			"BI": new Set(),
			"DB": new Set(),
			"cloud": new Set()
		};
		let jobCount = 0;

		this.responseData.forEach((item) => {
			if (item.category !== this.state.targetPosition && this.state.targetPosition !== null) {
				return;
			}
			jobCount++;
			for (let cat in skillCount) {
				if (!(cat in item)) {
					continue;
				}
				item[cat].forEach(skill => {
					skillCount[cat][skill] = (skillCount[cat][skill] || 0) + 1;
					skillSet[cat].add(skill);
				})
			}
		})

		for (let cat in skillCount) {
			sortObjectCount(skillCount[cat]);
		}

		this.skillCount = skillCount;
		this.skillSet = skillSet;
		this.jobCount = jobCount;
	}

	filterDocuments(strongFilter, weakFilter = {}, returnCount = true) {
		let result = returnCount ? 0 : [];
		if (this.state.targetPosition !== null) {
			strongFilter["category"] = this.state.targetPosition;
		}

		this.responseData.forEach((doc) => {
			if (validateFilter(doc, strongFilter, weakFilter)) {
				if (returnCount) {
					result++;
				}
				else {
					result.push(doc);
				}
			}
		})
		return result;
	}

	/**
	 * calculate P(targetSkill | currentSkills) for targetSkill in targetCategory - P(B | A)
	 */
	calculateConditionalProbabilities() {
		let result = {};
		for (let targetCategory in this.skillCount) {
			result[targetCategory] = {};
			for (let targetSkill in this.skillCount[targetCategory]) {
				if (validateFilter(this.state.currentSkills, { [targetCategory]: targetSkill }, {})) {
					continue;
				}
				const NA = this.filterDocuments({}, this.state.currentSkills);
				const NAB = this.filterDocuments({ [targetCategory]: targetSkill }, this.state.currentSkills);
				result[targetCategory][targetSkill] = NAB / NA;
			}
			result[targetCategory] = sortObjectCount(result[targetCategory], 6)
		}
		this.setState({ prob: result })
	}

	handleFormSubmit(form) {
		this.setState(form, this.processData);
	}

	render() {
		return (
			<BackgroundContainer>
				<OptimiserFilter positionOptions={Array.from(this.positionOptions)} onSubmit={this.handleFormSubmit} skillSet={this.skillSet} currentSkills={this.state.currentSkills} />
				<CanvasContainer>
					{this.props.showAlert && <Alert variant="primary" dismissible onClose={() => this.props.setAlert(false)}>
						<Alert.Heading>Welcome to Data Skills Learning Optimiser!</Alert.Heading>
						<p>
							This optimiser is designed to optimise your learning path towards being a Data Analyst or Data Scientist.
							Find out what skills to learn next.
						</p>
						<hr/>
						<p>
							Note that this is still in development. The algorithms and UI are not finalized yet and may result in unexpected problems.
						</p>
					</Alert>}
					<CardContainer>
						{
							this.state.prob &&
							Object.keys(this.state.prob).map((cat) => {
								return (
									<OptimiserCard prob={this.state.prob[cat]} category={cat} />
								)
							})
						}
					</CardContainer>
				</CanvasContainer>
			</BackgroundContainer>
		)
	}
}
