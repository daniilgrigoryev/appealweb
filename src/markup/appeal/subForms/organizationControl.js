import React from 'react'

// Element component
class EOrganizationControl extends React.Component {

  constructor(props) {
    super(props);
    const {options,defValue} = this.props;
    this.state = {
      value: defValue || options[0].property
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
    const {options} = this.props;
    const OrganizationControlS = options.map(x=><OrganizationControl key={x.value} value={x.property} checked={this.state.value === x.property} onChange={this.onChange.bind(this)}>{x.value}</OrganizationControl>);
//
    return (
      <div>
        {OrganizationControlS}
      </div>
    )
  }//
}

const FOrganizationControl = (props) => {
  const {input,meta} = props;
  return <EOrganizationControl {...props} {...input} {...meta} reduxformfield="true" />
}  //
//


export {EOrganizationControl,FOrganizationControl};