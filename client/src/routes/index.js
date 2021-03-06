import React from 'react'
import Navigation from '../navigation'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from './home'
import Test from './test'
import styled from 'styled-components'
import ServerExample from './serverExample'

export default function Routing() {
	return (
		<BrowserRouter>
			<Screen>
				<Navigation />
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/home" component={Home} />
					<Route path="/test" component={Test} />
					<Route path="/serverExample" component={ServerExample} />
				</Switch>
			</Screen>
		</BrowserRouter>
	)
}

const Screen = styled.div`
	color: ${({ theme }) => theme.color.on.base};
	font-size: ${({ theme }) => theme.font.size.regular};
	width: 100vw;
	height: 100vh;
	background-color: ${({ theme }) => theme.color.base.normal};
	display: flex;
	flex-direction: column;
`
