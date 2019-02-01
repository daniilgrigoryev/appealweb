import React from 'react'
import {AutoComplete} from 'element-react'
import {getAc} from '../../../services/acCacher.js'

// Element component
class EAutocomplete extends React.Component {

	constructor(props) {
	  super(props);

	  const data = props.data  || null;
	  const {value,property} = props.item || {};
	  this.state = {data,value,property};

	  this.querySearch  = this.querySearch.bind(this);
	  this.handleSelect = this.handleSelect.bind(this);
	}

	querySearch(queryString, cb) {
		const {filter} = this;
		const {data} = this.state;
		const key = this.props.acKey;
	  	if (data){
	  		cb(filter(data,queryString));
	  	} else {
	  		const getCallback = (data)=>{
	  			this.setState({data},()=>{
	  				cb(filter(data,queryString));
	  			});
	  		}
	  		getAc(getCallback,key)
	  	}
	}

	filter(data,query){
		if (!data){
			return [];
		} else if (!query){
			return data;
		}
		const upper = query.toUpperCase();
		return data.filter(x=>x.value.toUpperCase().indexOf(upper)==0);
	}

	handleSelect(item) {
		const onChange = this.props.onChange;
		this.setState(item || {value:'',property:''},()=>{
			onChange && (onChange(item.property));
		});
	}

	render() {
	  return (
	 	<AutoComplete {...this.props}
	          value={this.state.value}
	          fetchSuggestions={this.querySearch}
	          onSelect={this.handleSelect}
	        ></AutoComplete>)
	    }
} //


// redux Form component
const FAutocomplete = (props) => {
	const {input,meta} = props;
	return <EAutocomplete {...props} {...input} {...meta} />
}  //

export {EAutocomplete,FAutocomplete};