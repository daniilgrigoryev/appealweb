import React, { Component } from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {reset} from 'redux-form';
import {Card,Button} from 'element-react'
import {Field, reduxForm} from 'redux-form/immutable'
import Immutable from 'immutable'
import BasicData from './subForms/basicData.js'
import ClaimantData from './subForms/claimantData.js'
import AddressData from '../common/addressData.js' 
import OrganizationsData from './subForms/organizationsData.js'
import SummaryData from './subForms/summaryData.js'
import TopicsData from './subForms/theme/topicsData.js'
import IshDocsData from './subForms/ishdoc/ishDocsData.js'
import PlusDocs from './subForms/plusDocs.js'
import ArchiveData from './subForms/archiveData.js'
import DocsLink from './subForms/docsLink.js'
import StatusData from './subForms/statusData.js'
import {post} from '../../services/ajax.js'
import {appealSetId} from '../../actions/common.js'
import {messageSet} from '../../actions/common.js'
import SidePanel from './sidePanel.js'

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
    }

    return (
      <SidePanel>
                <Card className="ap-sticky-card box-card" bodyStyle={{ padding: 0 }} header={
                    <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main'>
                        <h1 className='ap-h1 flex-parent flex-parent--center-cross'>
                            Новое входящее обращение
                        </h1>
                    </div>
                }>
                    <BasicData/>
                    <ClaimantData/>
                    <AddressData fl={fl} key={JSON.stringify(fullAddr)} cBack={cBack} fullAddr={fullAddr}>
                        {line_adr}
                    </AddressData>
                    <OrganizationsData/>
                    <SummaryData/>
                    <TopicsData/>
                    <IshDocsData/>
                    <DocsLink reloadRow={this.reloadRow}/>
                    <ArchiveData/>
                </Card>
            </SidePanel>
    ); //
  }
}

const mapStateToProps = (state,props)=>{
    let id = state.getIn(['form','appeal','values','id']);
    let formData = state.getIn(['form','appeal','values']);
    return {id,formData};
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
