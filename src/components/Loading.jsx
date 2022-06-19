import React from 'react'
import Spinner from 'react-bootstrap/Spinner'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    height: 50vh;
    justify-content: center;
    align-items: center;
`

function Loading() {
    return (
        <Container>
            <Spinner animation="border" variant="primary" />
        </Container>
    )
}

export default Loading