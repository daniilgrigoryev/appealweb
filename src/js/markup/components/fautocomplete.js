import React from 'react'
import withValidators from './tooltipper.js'
import {AutoComplete} from 'primereact/autocomplete';
import {getAc,getAcValue,getAcNoCache} from '../../services/acCacher.js'

class EAutocomplete extends React.Component {

	constructor(props){
		super(props);
		this.state = {
	        dataSuggestions: null,
	        value: null,
	    	data:  null,
	    	dataKeyed : null
	    };

	    this.dataWhere = null;

	    this.change=this.change.bind(this);
	    this.select=this.select.bind(this);
	    this.getDatas=this.getDatas.bind(this);
	    this.suggestData=this.suggestData.bind(this);

	}

	componentDidUpdate(prevData) { 
	    const {value} = this.props;
	    if (value != prevData.value && (value=='' || value ==null)){ 
	      this.setState({data: null, dataKeyed:null, value: ""});
	    }
	  }

	componentDidMount(){
		const {acKey,dataKey,value,dataWhere} = this.props;
		//value && getAcValue(acKey||dataKey,value).then((value)=>this.setState({value})); // prop value was passed
		if (value){ 
			const key = acKey || dataKey;
			const hasWhere = !_.isEmpty(dataWhere);
			if (!hasWhere){
				getAcValue(key,value).then((value)=>{this.setState({value});});			
			} else {
				this.dataWhere = dataWhere;
				getAcNoCache(key,JSON.stringify(dataWhere)).then((result)=>{
					const rows = result.data;
					let findVal;
					if (rows && !rows.error) { 
						findVal = _.find(rows, x => x.property && x.property == value);
					}
					const val = findVal ? findVal.value : 0; 
					this.setState({value : val});
				});
			}
		}
	}

	componentDidUpdate(prevData) { 
		const {dataWhere} = this.props;
		const prevDW = prevData.dataWhere;
		const dataWhereChanged = dataWhere && prevDW && !_.isEqual(dataWhere,prevDW);
		if (dataWhereChanged){
			this.setState({data: null, dataKeyed:null, dataSuggestions: null, value: ""});
		}		
	}

	async suggestData(event) {
		const value = event.query.toLowerCase();
		if (_.size(this.state.data)){ // ac has data
	   		return this.filter(value);	
	   	} // else - loading needs...
	   	const d = await this.getDatas();
		return this.filter(value,d.data,d.dataKeyed)
	}

	async getDatas(){
		let d = null;
		
	   	{ // search list source
			const {data,acKey,dataKey,datagetter,dataWhere,datapromise} = this.props;
			if (datagetter){
		   		d = datagetter();
		   	} else if (datapromise){
				d = await datapromise();
			} else if (data){
		   		d = data;
		   	} else {
		   		const hasWhere = !_.isEmpty(dataWhere);
		   		const key = acKey || dataKey;
	  			d = hasWhere
			  		? await getAcNoCache(key,JSON.stringify(dataWhere))
			  		: await getAc(key); // докинуть дополнительные параметры (из пропсов)  
		  	}
	  		d = d.data ? d.data : d;
		}
		
		let dataKeyed = d;
		let dataLabels = d;
		if (d && d.length){
			if (d[0].property && d[0].value){
				dataLabels = d.map(x=>x.value);
			} else {
				dataKeyed = null; //d.map(x=>({property: x, value: x}));
			}
		}
		return {data:dataLabels,dataKeyed};
	}

	filter(queryLow,data,dataKeyed){
		const d = this.state.data || data;
		if (!d || d.error){
			return [];
		}
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
		const {onChange,onSelect,name} = this.props;
		const cb = !onChange ? null : ()=>{
			const {value} = event;
			const key     = this.getKey(value);
			onChange(key); 
			onSelect && (onSelect({value,key,name}));
		};
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