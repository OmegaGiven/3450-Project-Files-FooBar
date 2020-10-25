import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

export default function Navigation() {
	const history = useHistory()
	return (
		<Navbar>
			<NavElement onClick={() => history.replace('/home')}>Home</NavElement>
			<NavElement onClick={() => history.replace('/test')}>Test</NavElement>
			<NavElement onClick={() => history.replace('/profilePrototype')}>Profile</NavElement>
			<NavElement onClick={() => history.replace('/Order')}>Order</NavElement>
			<NavElement onClick={() => history.replace('/serverExample')}>
				Server Example
			</NavElement>
			<NavElement onClick={() => history.replace('/register')}>Register</NavElement>
			<NavElement onClick={() => history.replace('/login')}>Login</NavElement>
			<NavElement onClick={() => history.replace('/profile')}>Profile (Editable)</NavElement>
			<NavElement onClick={() => history.replace('/Inventory')}>Inventory</NavElement>
		</Navbar>
	)
}

const Navbar = styled.nav`
	position: sticky;
	top: 0;
	left: 0;
	right: 0;
	display: flex;
	flex-direction: row;
	flex: 0 0 auto;

	background-color: ${({ theme }) => theme.color.base.lighter};
`

const NavElement = styled.div`
	color: ${({ theme }) => theme.color.on.base};
	padding: 8px;
	margin-right: ${({ theme }) => theme.spacing.veryLarge};

	&:hover {
		background-color: ${({ theme }) => theme.color.base.normal};
		cursor: pointer;
	}
`
