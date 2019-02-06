import React from 'react'
import {Switch} from 'element-react'
import transform from './elm2rf.js'

// Element component
class ESwitch extends React.Component {
	render(){
		return  <Switch {...this.props} />
	} //
}

// redux Forrm component
const FSwitch = (props) => {
	const {input,meta} = props;
	return <ESwitch {...props} {...input} {...meta} />
}  //

export {ESwitch,FSwitch};