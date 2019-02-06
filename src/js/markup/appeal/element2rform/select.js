import React from 'react'
import withValidators from './tooltipper.js'
import {Select} from 'element-react'
import {getSl} from '../../../services/acCacher.js'

// Element component
class ASelect extends React.Component {

	constructor(props) {
	  super(props);
	  this.state = {
	  	data: []
	  };
	}

	componentDidMount(){
		this.pushData2state();
	}

	pushData2state(){
		let {data,dataKey} = this.props;
		if (data && data.size){
			this.setState({data});
		} else if (dataKey) {
			getSl(dataKey).then((data)=>this.setState({data}));
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

const ESelect = withValidators(ASelect);

const FSelect = (props) => {
	const {input,meta} = props;
	return <ESelect {...props} {...input} {...meta} />
}  //

export {ESelect,FSelect};