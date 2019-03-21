import React from 'react'
import withValidators from './tooltipper.js'
import {TimePicker,DatePicker} from 'element-react'
import MaskedInput from 'react-text-mask'

// Element component
const ofs =  new Date().getTimezoneOffset()*60*1000;

class APicker extends React.Component {
	render(){ 
		const {timepicker,datepicker,datetimepicker,onChange,reduxformfield} = this.props;
		let value = reduxformfield ? this.props.input.value : this.props.value;
        value = value || null;

        if (typeof value=='string'){
        	value = new Date(Date.parse(value) + ofs)
			//value = new Date(Date.parse('2019-03-13T00:00:00.000Z') + ofs)
        }

		const customChanger = (newVal)=>{
			let changer = null;
			if (reduxformfield){
				this.props.input.onChange(newVal);
			} else if (changer=this.props.onChange){ 
				changer(newVal);
			} else if (changer=this.props.onValidate){ ;
				changer(newVal);
			}
		}

		const p = Object.assign({},this.props);
		delete p.onChange;

       	if (timepicker){ 
			return <TimePicker {...p} value={value} onChange={customChanger}  />;
		} else { //
			const isShowTime=!!datetimepicker;
	       	return <DatePicker {...p} isShowTime={isShowTime} value={value} onChange={customChanger} />
		} //	
	} //
}

const EPicker = withValidators(APicker,{forceValidate: true});

// redux Forrm component
const FPicker = (props) => {
	const { input, label, type, meta: { touched, error } } = props;
	const newProps = Object.assign({},props);
	//delete newProps.meta;
	return <EPicker {...newProps} reduxformfield="true" />
} //

export {EPicker,FPicker};
