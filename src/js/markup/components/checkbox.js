import React from 'react'
import {Checkbox} from 'element-react'

// Element component
class ECheckbox extends React.Component {
	render(){
		const {value,checked} = this.props;
		let nextChecked = false;
		if (typeof value == 'string'){
			const str = value=='true' || value=='false'; 
			nextChecked =  str ? ('true'==value) : (!!value);
		} else {
			nextChecked = typeof value == 'boolean' ? value : checked;
		}
		return  <Checkbox {...this.props} checked={nextChecked} />
	} //
}

const FCheckbox = (props) => {
	const {input,meta} = props;
	return <ECheckbox {...props} {...input} {...meta} />
}  //

export {ECheckbox,FCheckbox};