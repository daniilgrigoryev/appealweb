import React from 'react'
import withValidators from './tooltipper.js'
import {AutoComplete} from 'element-react'
import {getAc,getAcValue} from '../../services/acCacher.js'

// Element component
class AAutocomplete extends React.Component {

	constructor(props) {
	  super(props);

	  const data     = props.data  || null;
	  const value    = null;
	  this.state     = {data,value};

	  this.querySearch  = this.querySearch.bind(this);
	  this.handleSelect = this.handleSelect.bind(this);
	}

	componentDidMount(){
		const {acKey,dataKey,value} = this.props;
		if (value){ 
			getAcValue(acKey||dataKey,value).then((value)=>this.setState({value}));
		}
	}

	querySearch(queryString, cb){
		const {filter} = this;
		const {data} = this.state;
		const {acKey,dataKey} = this.props;
		const key = acKey || dataKey;
	  	if (data){
	  		cb(filter(data,queryString));
	  	} else {
	  		getAc(key).then((d)=>{
	  			const value = this.state.value || null;
	  			let data = {};
				d = d.data ? d.data : d;
				if (d && d.length){
					data  = d.map(x=>((x.property && x.value) ? x : {property: x, value: x}));
				}
				this.setState({data,value},()=>cb(filter(data,queryString)));
	  		});
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
		const value = item ? item.value : null;
		this.setState({value} || {value:''},()=>{
			onChange && (onChange(item.property));
		});
	}

	render() {
	  return (
	 	<AutoComplete {...this.props}
	 		  onChange={()=>{}}
	          value={this.state.value}
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