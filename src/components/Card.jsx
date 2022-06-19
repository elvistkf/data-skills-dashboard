import React from 'react'
import styled from 'styled-components'

const BackgroundContainer = styled.div`
    border-radius: 0.45em;
    background-color: rgba(2, 110, 203, 0.798);
    flex-basis: 32%;
    min-width: max-content;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0.5em;
    color: white;

    /* font-size: large; */
    
    @media screen and (max-width: 1440px){
        flex-basis: 31.9%;
    }
`

const Title = styled.div`
    font-weight: bold;
`

function Card(props) {
    return (
        <BackgroundContainer>
            <Title>{props.title}</Title>
            <div>{props.value}</div>
        </BackgroundContainer>
    )
}

export default Card