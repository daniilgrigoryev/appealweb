import React from 'react'
import {AutoComplete} from 'element-react'
import getAc from '../../../services/acCacher.js'

export default class Fautocomplete extends React.Component {

constructor(props) {
  super(props);

  const data = props.data  || null;
  let text   = '';
  let val    = '';

  if (data && data.length){
  	const found = data.filter(x=>x.text===searchText || x.val===searchValue)[0];
	if (found){
		text = found.text;
		val  = found.text;
	}
  }

  this.state = {data,text,val};
}

querySearch(queryString, cb) {
	const {data} = this.state;
	const key = this.props.acKey;
  	if (data){
  		cb(data);
  	} else {
  		const getCallback = (data)=>{
  			this.setState({data},()=>{
  				cb(data);
  			});
  		}
  		getAc(getCallback,key)
  	}
}

handleSelect(item) {
	debugger;

}

render() {
  return (
 	<AutoComplete
          {...this.props}
          value={this.state.value1}
          fetchSuggestions={this.querySearch.bind(this)}
          onSelect={this.handleSelect.bind(this)}
        ></AutoComplete>)
    }
}