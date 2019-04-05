import React from 'react'
import withValidators from './tooltipper.js'
import {AutoComplete} from 'primereact/autocomplete';
import {getAc,getAcValue} from '../../services/acCacher.js'

class EAutocomplete extends React.Component {

	constructor(props){
		super(props);
		this.state = {
	        dataSuggestions: null,
	        value: null,
	    	data:  null,
	    	dataKeyed : null
	    };

	    this.change=this.change.bind(this);
	    this.select=this.select.bind(this);
	    this.suggestData=this.suggestData.bind(this);
	}

	componentDidMount(){
		const {acKey,dataKey,value} = this.props;
		value && getAcValue(acKey||dataKey,value).then((value)=>this.setState({value})); // prop value was passed
	}

	async suggestData(event) {
		const value = event.query.toLowerCase();
		if (_.size(this.state.data)){ // ac has data
	   		return this.filter(value);	
	   	} // else - loading needs...

	   	let d = null;
		{ // search list source
			const {data,acKey,dataKey,datagetter} = this.props;
			if (datagetter){
		   		d = datagetter();
		   	} else if (data){
		   		d = data;
		   	} else {
		   		d = await getAc(acKey || dataKey);
		  	}
	  		d = d.data ? d.data : d;
		}
		
		let dataKeyed = d;
	  	let data = d;
		if (d && d.length){
			if (d[0].property && d[0].value){
				data = d.map(x=>x.value);
			} else {
				dataKeyed = null; //d.map(x=>({property: x, value: x}));
			}
		}
		this.filter(value,data,dataKeyed)
	}

	filter(queryLow,data,dataKeyed){
		const d = this.state.data || data;
		const dataSuggestions = d.filter((row)=>row.toLowerCase().indexOf(queryLow)>-1);
		const dState = {dataSuggestions};
		if (data && data.length){
			dState.data = data;
			(dataKeyed && dataKeyed.length) && (dState.dataKeyed = dataKeyed); 
		}
		this.setState(dState);
	}

	getKey(value){
		const {data,dataKeyed} = this.state;
		
		if (!data){
			return null;
		} else if (!dataKeyed){
			return value;
		}

		let K;
		for (let key in dataKeyed){
			if ((K=dataKeyed[key]).value==value){
				return K.property;
			}
		}
		return null;
	}

	change(event,cb=null){
		const {value} = event;
		this.setState({value},cb);

		if(value=='' || value=='[отсутствует]'){
			const {onChange} = this.props;
			onChange && (onChange(null));
		}
	}

	select(event){
		const {onChange} = this.props;
		const cb = !onChange ? null : ()=>onChange(this.getKey(event.value));
		this.change(event,cb);		
	}

	render() {
		const {value,dataSuggestions} = this.state;
	    return <AutoComplete value={value} suggestions={dataSuggestions} onChange={this.change} onSelect={this.select} onClick={this.click} completeMethod={this.suggestData} dropdown={true} />
	} //
}

//const EAutocomplete = withValidators(AAutocomplete);

// redux Form component
const FAutocomplete = React.memo(function FAutocomplete(props){
	const {input,meta} = props;
	return <EAutocomplete {...props} {...input} {...meta} reduxformfield="true" />
})  //

export {EAutocomplete,FAutocomplete};