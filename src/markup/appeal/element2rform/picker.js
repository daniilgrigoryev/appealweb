import React from 'react'
import {TimePicker,DatePicker} from 'element-react'
import MaskedInput from 'react-text-mask'

// Element component
class EPicker extends React.Component {
	render(){
		const {timepicker,datepicker,datetimepicker,onChange,reduxformfield} = this.props;
		let value = reduxformfield ? this.props.input.value : this.props.value;
        value = value || null;
        
		const customChanger = (newVal)=>{
			if (reduxformfield){
				this.props.input.onChange(newVal);
			}
		}

		const p = Object.assign({},this.props);
		delete p.onChange;

       	if (timepicker){ 
			return <TimePicker {...p} value={value} onChange={customChanger}  />;
		} else { //
			const isShowTime=!!datetimepicker;
	       	return <DatePicker {...p} isShowTime={isShowTime} value={value} onChange={customChanger} />
		}//	
	} //
}

// redux Forrm component
const FPicker = (props) => {
	const { input, label, type, meta: { touched, error } } = props;
	const newProps = Object.assign({},props);
	delete newProps.meta;
	return <EPicker {...newProps} reduxformfield="true" />
} //

export {EPicker,FPicker};
