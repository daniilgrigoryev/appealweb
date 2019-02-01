import React from 'react'
import {Input} from 'element-react'
import MaskedInput from 'react-text-mask'

// Element component
class EInput extends React.Component {
	render(){
		const {mask,onChange,reduxformfield} = this.props;
		if (!mask){
			return <Input {...this.props} />;
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

// redux Form component
const FInput = (props) => {
	const { input, label, type, meta: { touched, error } } = props;
	const newProps = Object.assign({},props);
	delete newProps.meta;
	return <EInput {...props} {...input} reduxformfield="true" />
} //

export {EInput,FInput};