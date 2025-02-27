import React from 'react'
import withValidators from './tooltipper.js'
import {Select} from 'element-react'
import {getSl} from '../../services/acCacher.js'
import {EAutocomplete,FAutocomplete} from './fautocomplete.js'

// Element component
class ASelect extends React.Component {

	constructor(props) {
	  super(props);
	  const data = []//[{property:props.value, value:'Ждите...'}]
	  this.state = {data};
	}

	componentDidMount(){
		this.pushData2state();
	}

	setData(arg){
		let d = arg;
		if (arg && arg.data){
			d = arg.data;
		}
		let data = [];
		if (d && d.length){
			data  = d.map(x=>((x.property && x.value) ? x : {property: x, value: x}));
		} 
		this.setState({data});
	}

	pushData2state(){ 
		let {data,dataKey,datagetter} = this.props;
		if (datagetter){
			datagetter().then((data)=>this.setData(data));
		} else if (data && data.length){
			this.setData(data);
		} else if (dataKey) {
			getSl(dataKey).then((data)=>this.setData(data));
		}
	}

	render() {
		const ROWS =  (this.state.data || []).map(el => (<Select.Option key={el.property} label={el.value} value={el.property} />));
	 	return (
		    <Select {...this.props}>
		      {ROWS}
		    </Select>
		)
	} //
}

const ESelect_old = withValidators(ASelect);

const FSelect_old = (props) => {
	const {input,meta} = props;
	return <ESelect {...props} {...input} {...meta} />
}  //

const ESelect = EAutocomplete;
const FSelect = FAutocomplete;

export {ESelect,FSelect};