import React from 'react'
import {Radio} from 'element-react'

// Element component
class ERadio extends React.Component {

  constructor(props) {
    super(props);
    const {options,value} = this.props; 
    this.state = {value};
  }

  componentDidMount(){
    const {options,value} = this.props; 
    if (''==value){
      this.setState({value: options[0].property});
    }
  }

  onChange(value) {
    const onChange = this.props.onChange;
    this.setState({value},()=>{
      if (onChange){
        onChange(value);
      }
    });
  }

  render() {
    const {options,disabled} = this.props;
    const RADIOS = options.map(x=><Radio key={x.value} 
                                      value={x.property} 
                                      checked={this.state.value == x.property} 
                                      onChange={this.onChange.bind(this)} 
                                      disabled={disabled}>{x.value}</Radio>);
//
    return (<div>{RADIOS}</div>)
  }//
}

const FRadio = (props) => {
  const {input,meta} = props;
  return <ERadio {...props} {...input} {...meta} reduxformfield="true" />
}  //
//

const getOptions = (...args)=>{
  const len = args.length;
  if (!len || len%2==1){
    throw 'Illegal options args';
  }
  const ret = [];
  for (let i=0;i<len;i+=2){
    ret.push({property:args[i],value:args[i+1]});
  }
  return ret;
}

export {ERadio,FRadio,getOptions};