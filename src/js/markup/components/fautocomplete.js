import React from 'react'
import withValidators from './tooltipper.js'
import {AutoComplete} from 'element-react'
import {getAc,getAcValue} from '../../services/acCacher.js'

const noop = ()=>{}

// Element component
class AAutocomplete extends React.Component {

	constructor(props) {
	  super(props);

	  const data     = props.data  || null;
	  const value    = props.value;
	  const valueText= null;
	  this.state     = {data,value,valueText};

	  this.querySearch  = this.querySearch.bind(this);
	  this.handleSelect = this.handleSelect.bind(this);
	}

	componentDidMount(){
		const {acKey,dataKey,value} = this.props;
		const key = acKey || dataKey;
		const propValue = value;
		if (propValue){ 
			getAcValue(acKey||dataKey,propValue).then((av)=>{
				debugger;
				this.setState({value: propValue,valueText:av}); });			
		}
	}

	async querySearch(queryString, cb){
		const {filter} = this;
		const {data} = this.state;
		const {acKey,dataKey} = this.props;
		const key = acKey || dataKey;
	  	if (data){
	  		cb(filter(data,queryString));
	  	} else {
	  		let d = await getAc(key);
	  		const {value,valueText} = this.state;
	  		let data = {};
			d = d.data ? d.data : d;
			if (d && d.length){
			data  =  (d[0].property && d[0].value) 
				? d
				: d.map(x=>({property: x, value: x}));
			}
			this.setState({data,value},()=>cb(filter(data,queryString)));
	  	}
	}

	filter(data,query){
		if (!data){
			return [];
		} else if (!query){
			return data;
		}
		const upper = query.toUpperCase();
		return data.filter(x=>x.value.toUpperCase().indexOf(upper) > -1);
	}

	handleSelect(item) {
		const onChange = this.props.onChange;
		const value     = item ? item.property : null;
		const valueText = item ? item.value    : null;
		this.setState({value,valueText},()=>{
			onChange && (onChange(item.property));
			this.forceUpdate();
		});
	}

	render() {
	  const {value,valueText} = this.state;
	  return (
	 	<AutoComplete {...this.props}
	 		  onChange={noop}
	 		  onFocus={noop}
	 		  onBlur={noop}
	          value={valueText || value}
	          fetchSuggestions={this.querySearch}
	          onSelect={this.handleSelect}
	        ></AutoComplete>)
	}
} //


const EAutocomplete = withValidators(AAutocomplete);

// redux Form component
const FAutocomplete = (props) => {
	const {input,meta} = props;
	return <EAutocomplete {...props} {...input} {...meta} reduxformfield="true" />
}  //

export {EAutocomplete,FAutocomplete};