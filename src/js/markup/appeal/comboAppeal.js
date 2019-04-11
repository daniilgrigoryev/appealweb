import React, { Component } from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {reset} from 'redux-form';
import {Field, reduxForm} from 'redux-form/immutable'
import Immutable from 'immutable'
import BasicData from './appealContent/basicData.js'
import ClaimantData from './appealContent/claimantData.js'
import AddressData from './appealContent/addressData.js'
import TestElement2RF from './appealContent/testElement2rf.js' 
import OrganizationsData from './appealContent/organizationsData.js'
import SummaryData from './appealContent/summaryData.js'
import TopicsData from './appealContent/topicsData.js'
import IshDocsData from './appealContent/ishDocsData.js'
import PlusDocs from './appealContent/plusDocs.js'
import ArchiveData from './appealContent/archiveData.js'
import FullAppeal from './fullAppeal.js' 
import StatusData from './appealContent/statusData.js'
import {post} from '../../services/ajax.js'
import {appealSetId} from '../../actions/common.js'
import {Button} from 'element-react'
import {messageSet} from '../../actions/common.js'
import SidePanel from './subForms/sidePanel.js'

const im = (obj)=> Immutable.fromJS(obj)

class ComboAppeal extends Component {

  render(){
    const {dispatch,change,initialize,formData} = this.props;

    const cBack = (kvart, cdr, lineAddr) => {
        kvart && dispatch(change('kvart', kvart));
        cdr && dispatch(change('cdr_address_id', cdr));
        lineAddr && dispatch(change('line_adr', lineAddr));
    }
    
    try{
      const h = window.location.hash.split('?');
      if (h[1]=='new'){
        window.location.hash = h[0];
        setTimeout(()=>dispatch(initialize(im({}))),100);
      }
    } catch (exc) { 
      //debugger;
    }//

    const fl = _.get(formData, ['values','zajav_lic']);
    const cdr = _.get(formData, ['values', 'cdr_address_id']);
    const kvart = _.get(formData, ['values', 'kvart'])
    const line_adr = _.get(formData,['values','line_adr'],'');

    return (
      <SidePanel>
	    <BasicData    />
	    <ClaimantData />
      <AddressData fl={fl} key={cdr} cdr={cdr} kvart={kvart} cBack={cBack}>
          {line_adr + (kvart ? (' кв.' + kvart):'')}
      </AddressData>
	    <OrganizationsData />
	    <SummaryData  />
	    <TopicsData   />
	    <IshDocsData  />
	    <ArchiveData  />
      </SidePanel>
    ); //
  }
}

const mapStateToProps = (state,props)=>{
    debugger;
    let formData = state.getIn(['form','appeal']);
    formData && (formData = formData.toJS());
    return {formData};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
        enableReinitialize: true
        //validate
    })
)(ComboAppeal)
