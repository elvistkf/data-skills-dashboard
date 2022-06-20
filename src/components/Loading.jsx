import React from 'react'
import Spinner from 'react-bootstrap/Spinner'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    height: 50vh;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

function Loading() {
    return (
        <Container>
            <Spinner animation="border" variant="primary" />
            <div>Fetching Data</div>
        </Container>
    )
}

export default Loading