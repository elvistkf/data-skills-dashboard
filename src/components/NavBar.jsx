import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { AiOutlineBarChart, AiOutlineLineChart } from "react-icons/ai";
import { Link, useLocation } from 'react-router-dom'
import "../common.css"
import "./NavBar.css"

const BackgroundContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 54px;
    border-bottom: 1px solid #cccccc;
    padding: 0em 0.75em;

    @media screen and (max-width: 800px) {
        height: auto;
        display: block;
    }
`

const NavLinkContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: left;

    @media screen and (max-width: 800px) {
        display: ${props => props.showMenu ? "flex" : "none"};

        margin-top: 54px;
        flex-direction: column;
        align-items: stretch;
        width: 100%;
    }
`

const NavLink = styled(Link)`
    margin-left: 0.25em;
    margin-right: 0.25em;
    padding: 0.5em 0.75em 0.5em 0.75em;
    border-radius: 0.5em;
    display: flex;
    align-items: center;
    color: black;
    background-color: ${(props) => props.active ? "#e2e2e2" : "#f1f1f1"};
    transition: background-color 0.5s; 

    &:hover {
        background-color: #e2e2e2;
        color: black;
    }

    @media screen and (max-width: 800px) {
        margin-bottom: 5px;
    }
`

const NavLinkText = styled.div`
    margin-left: 0.25em;
`

const NavToggleBtn = styled.div`
    cursor: pointer; 
    display: none;
    border-radius: 6px;
    padding: 0.45em 0.5em 0.45em 0.5em;
    transition: background-color, 0.5s;

    &:hover {
        background-color: #e2e2e2;
    }

    @media screen and (max-width: 800px) {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        margin-top: 8px;
        margin-left: 1em;
    }
`

const NavToggleBtnElement = styled.div`
    background-color: #0d0d0d;
    width: 18px;
    height: 1px;
    margin: 5px 0;
    transition: 0.2s;

    &:first-child {
        -webkit-transform: ${props => props.showMenu ? "rotate(-45deg) translate(-4px, 4.5px)" : "none"};
        transform: ${props => props.showMenu ? "rotate(-45deg) translate(-4px, 4.5px)" : "none"};
    }

    &:nth-child(2) {
        opacity: ${props => props.showMenu ? "0" : "100"};
    }

    &:last-child {
        -webkit-transform: ${props => props.showMenu ? "rotate(45deg) translate(-4px, -4px)" : "none"};
        transform: ${props => props.showMenu ? "rotate(45deg) translate(-4px, -4px)" : "none"};
    }
`

function NavBar() {
    const [activeLink, setActiveLink] = useState("");
    const [toggle, setToggle] = useState(false);
    const currentLocation = useLocation().pathname;

    useEffect(() => {
        switch (currentLocation) {
            case "/optimiser":
                setActiveLink("Optimiser")
                break;
            default:
                setActiveLink("Dashboard")
                break;
        }
    }, [currentLocation])


    const handleNavLinkClick = (e) => {
        setActiveLink(e.target.innerText)
        setToggle(false)
    }

    const handleToggle = () => {
        setToggle(!toggle)
    }

    return (
        <BackgroundContainer>
            <NavToggleBtn id="menuToggle" className="noselect" onClick={handleToggle}>
                {
                    Array.from(Array(3)).map((item, index) => {
                        return (<NavToggleBtnElement showMenu={toggle ? 1 : 0} key={index}/>)
                    })
                }
            </NavToggleBtn>
            <NavLinkContainer showMenu={toggle ? 1 : 0}>
                <NavLink to="/" onClick={handleNavLinkClick} active={activeLink === "Dashboard" ? 1 : 0}>
                    <AiOutlineBarChart />
                    <NavLinkText>Dashboard</NavLinkText>
                </NavLink>
                <NavLink to="/optimiser" onClick={handleNavLinkClick} active={activeLink === "Optimiser" ? 1 : 0}>
                    <AiOutlineLineChart />
                    <NavLinkText>Optimiser</NavLinkText>
                </NavLink>
            </NavLinkContainer>
            
        </BackgroundContainer>
    )
}

export default NavBar