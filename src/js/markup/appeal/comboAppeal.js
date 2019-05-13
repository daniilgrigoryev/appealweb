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
import DocsLink from './appealContent/docsLink.js'
import FullAppeal from './fullAppeal.js' 
import StatusData from './appealContent/statusData.js'
import {post, get, out} from '../../services/ajax.js'
import {appealSetId} from '../../actions/common.js'
import {Button} from 'element-react'
import {messageSet} from '../../actions/common.js'
import SidePanel from './subForms/sidePanel.js'
import {baseUrl} from '../../services/api.js'

const im = (obj)=> Immutable.fromJS(obj)

const testGetFile = (sessionId, claim_id)=>{
    const params = new URLSearchParams()
    params.append('session',sessionId)
    params.append('claim_id',claim_id);
    
    const downloadDocLink = baseUrl() + 'report/fill?'+params.toString()

    const tempLink = document.createElement('a');
    tempLink.href = downloadDocLink;
    tempLink.setAttribute('download', 'test.pdf');
    tempLink.click();

    setTimeout(()=>{
      tempLink && (tempLink.remove());
    },5000);
} 

class ComboAppeal extends Component {

  constructor(props){
    super(props);
    this.reloadRow = this.reloadRow.bind(this);      
  }

  async reloadRow() {
    const {dispatch, change, initialize,id} = this.props;
    const alias = 'CLAIM_GET';
    const orphan = true;
    const claim_id = id;
    const x = await post('db/select', {alias, claim_id,orphan});
    dispatch(initialize(im(x.data)));
  }

  render(){
    const {dispatch,change,initialize,formData} = this.props;    
    const cBack = (arg_arr) => _.each(arg_arr||[],x=>dispatch(change(x.name, x.value || '')));

    try{
      const h = window.location.hash.split('?');
      if (h[1]=='new'){
        window.location.hash = h[0];
        setTimeout(()=>dispatch(initialize(im({}))),100);
      }
    } catch (exc) { 
      //debugger;
    }//

    let fullAddr = {};
    let fl = false;
    let line_adr = '';
    let claim_id;

    if (formData) {
      fl       = formData.get('zajav_lic')|| false;
      line_adr = formData.get('line_adr') || '';
      fullAddr = _.pick(formData.toJS(), [
        'cdr_address_id', 
        'dom', 
        'korpus', 
        'kvart',
        'line_adr', 
        'city_id', 
        'pindex', 
        'rayon_id', 
        'region', 
        'str', 
        'street_id']);
      claim_id = formData.get('id') || '';
      testGetFile(this.props.sid, claim_id);
    }

    return (
      <SidePanel>
  	    <BasicData    />
  	    <ClaimantData />
        <AddressData fl={fl} key={JSON.stringify(fullAddr)} cBack={cBack} fullAddr={fullAddr}>
          {line_adr}
        </AddressData>
  	    <OrganizationsData />
  	    <SummaryData  />
  	    <TopicsData   />
  	    <IshDocsData  />
        <DocsLink reloadRow={this.reloadRow} />
  	    <ArchiveData  />	    
      </SidePanel>
    ); //
  }
}

const mapStateToProps = (state,props)=>{
    let id = state.getIn(['form','appeal','values','id']);
    debugger;
    let formData = state.getIn(['form','appeal','values']);
    let sid = state.getIn(['general','user','sessionID']);
    return {id,formData,sid};
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
