import React from 'react'
import ReactDOM from 'react-dom'
import withValidators from './tooltipper.js'
import {Input} from 'element-react'
import MaskedInput from 'react-text-mask'

// Element component
class AInput extends React.Component {

	constructor(props){
		super(props);
		this.ref = null;
	}

	render(){
		const clearProps = Object.assign({},this.props);
		delete clearProps.mask;
		delete clearProps.input;
		delete clearProps.meta;

		const {mask,onChange,reduxformfield} = this.props;
		if (!mask){
			return <Input {...clearProps} />;
		} //

		if (reduxformfield){
			const reduxFormOnChange = onChange;
			return <MaskedInput  
					mask={mask} 
					render={(ref, props) =>{
							let inp = null;
							const onChange = (evt)=>{
								props.onChange(evt); 
								setTimeout(()=>reduxFormOnChange(inp.value),50);								
							}
							return <Input {...props} onChange={onChange} ref={(x)=>{ if (x){ ref(x.refs.input); inp =x.refs.input; } }}  />;
						}
					} 
				/>;		
		} else { // no redux forms
			return <MaskedInput  
					mask={mask} 
					render={(ref, props) =><Input {...props} onChange={onChange} ref={(x)=>{ if (x){ ref(x.refs.input); }}} />	}
				/>
		}
		
	} //
}

const EInput = withValidators(AInput);

// redux Form component
const FInput = (props) => {
	const { input, label, type, meta: { touched, error } } = props;
	const newProps = Object.assign({},props);
	delete newProps.meta;
	return <EInput {...props} {...input} reduxformfield="true" />
} //

export {EInput,FInput};