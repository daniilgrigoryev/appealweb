import React, { Component } from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {reset} from 'redux-form';
import {Field, reduxForm} from 'redux-form/immutable'
import Immutable from 'immutable'
import BasicData from './appealContent/basicData.js'
import ClaimantData from './appealContent/claimantData.js'
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
import {post} from '../../services/ajax.js'
import {appealSetId} from '../../actions/common.js'
import {Button} from 'element-react'
import {messageSet} from '../../actions/common.js'
import SidePanel from './subForms/sidePanel.js'

const im = (obj)=> Immutable.fromJS(obj)

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
    const {dispatch,change,initialize} = this.props;
    
    try{
      const h = window.location.hash.split('?');
      if (h[1]=='new'){
        window.location.hash = h[0];
        setTimeout(()=>dispatch(initialize(im({}))),100);
      }
    } catch (exc) { 
      //debugger;
    }//

    return (
      <SidePanel>
  	    <BasicData    />
  	    <ClaimantData />
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
    return {id};
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