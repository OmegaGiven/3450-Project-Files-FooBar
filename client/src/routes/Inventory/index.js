import React from 'react'
import styled from 'styled-components'
// import { useSelector, useDispatch } from 'react-redux'
// import { getTheme } from '../../redux-store/theme'
// import reactRouterDom from 'react-router-dom'



function getInventoryInfo() {
	return fetch('http://localhost:8100/inventory/')
		.then((res) => res.json())
}

class InventoryInfo extends Component {
    render() {
		const name = this.props.name
		const qty = this.props.qty
		const price = this.props.price
        return (
            <section>
                <h3> <strong>Item: {name}</strong></h3>
                <h4>Quantity: {qty}</h4>
                <h4>Price: {price}</h4>
            </section>
        )
    }
}


export default function Inventory() {
    const inventory = useQuery('Inventory', getInventoryInfo)
    
    if( inventory.data) {
        return (
            <Screen>
                <Inventory name={inventory.data.name} qty={inventory.data.qty} price={info.data.price}/>
            </Screen>
        )
    }
    return (
        <Screen>
                <h1>Loading...</h1>
        </Screen>
    )
}


