import React, {Component} from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from 'react-query'
import Button from '../../general/Button'
import { AVAILABLE_THEMES } from '../../redux-store/theme/constants'
import { getTheme, setTheme } from '../../redux-store/theme'


function getTestProfile() {
	return fetch('http://localhost:8100/profile/')
		.then((res) => res.json())
}

class ProfileInfo extends Component {
    render() {
		const name = this.props.name
		const email = this.props.email
		const accountBal = this.props.accountBal
        return (
            <section>
                <h3> <strong>Account Name: {name}</strong></h3>
                <h4>Email Id: {email}</h4>
                <h4>Account Balance: {accountBal}</h4>
            </section>
        )
    }
}

export default function Profile() {
	const info = useQuery('test', getTestProfile)
	
	if( info.data) {
		return (
			<Screen>
				<ProfileInfo name={info.data.name} email={info.data.email} accountBal={info.data.accountBal}/>
			</Screen>
		)
	}
	return (
		<Screen>
				<h1>Loading...</h1>
		</Screen>
	)
}

const Screen = styled.div`
	width: 100%;
	flex: 1 0 0;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${({ theme }) => theme.color.base.darker};
`