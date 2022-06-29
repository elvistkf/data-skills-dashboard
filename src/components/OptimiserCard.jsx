import React from 'react';
import styled from 'styled-components';
import { mapping } from '../assets/config';

const Container = styled.div`
    margin: 0.5em 0.5em;
    border-radius: 1em;
    background-color: #fbfbfb;
    padding: 1em;
    /* width: 100%; */
`

const Title = styled.div`
    font-weight: bold;
`

function OptimiserCard(props) {
    return (
        <Container>
            <Title>{mapping[props.category]}</Title>
            {
                Object.keys(props.prob).map((skill) => {
                    return <div key={skill}>{skill}, {props.prob[skill].toFixed(2)}</div>
                })
            }
        </Container>
    )
}

export default OptimiserCard;