import React, { PureComponent,Component } from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {reset} from 'redux-form';
import {Card,Button, Layout} from 'element-react'
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
import {baseUrl} from '../../services/api.js'
import {appealSetId} from '../../actions/common.js'
import {messageSet} from '../../actions/common.js'
import SidePanel from './sidePanel.js'
import {getRights} from  '../../services/rights.js'

const im = (obj)=> Immutable.fromJS(obj)

class ComboAppeal extends PureComponent {

  constructor(props){
    super(props);
    this.reloadRow = this.reloadRow.bind(this);      
    this.hashHolder = null;
  }

  async reloadRow() {
    const {dispatch, change, initialize,id} = this.props;
    const alias = 'CLAIM_GET';
    const orphan = true;
    const claim_id = id;
    const x = await post('db/select', {alias, claim_id,orphan});
    dispatch(initialize(im(x.data)));
    setTimeout(()=>(this.hashHold && this.hashHold()),500);
  }

  render(){
    const {dispatch,change,initialize,formData} = this.props;    
    try{
      const h = window.location.hash.split('?');
      if (h[1]=='new'){
        window.location.hash = h[0];
        window.lolkek= 'newPg';
        setTimeout(()=>dispatch(initialize(im({}))),100);
      }
    } catch (exc) {
      //debugger;
    }//

    let addrH = <form>
                  <hr className="txt-hr my6"/>
                  <h4 className='ap-h4'>Адрес</h4>
                 </form>

    //
    const cBack = (arg_arr) => _.each(arg_arr||[],x=>dispatch(change(x.name, x.value || '')));
    
    let fullAddr = {};
    let fl = false;
    let line_adr = '';
    let claim_id;
    let files = [];

    if (formData) {
      fl       = formData.get('zajav_lic')|| false;
      line_adr = formData.get('line_adr') || '';
      files = formData.get('files') || [];
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
      //debugger;
      //testGetFile(this.props.sid, claim_id);
    }

    const right = 'general_super';

    let CONTENT = (<div style={{fontFamily:'monospace',width: '800px'}}>
───────────────────────────────────────────────────────────────
───────────────████████────────────────────────────────────────
──────────────███▄███████──────────────────────────────────────
──────────────███████████──────────────────────────────────────
──────────────███████████──────────────────────────────────────
──────────────██████───────────────────────────────────────────
──────────────█████████────────────────────────────────────────
────█───────███████────────────────────────────────────────────
────██────████████████───────────── Недостаточно прав ─────────
────███──██████████──█────────── для просмотра обращения───────
────███████████████────────────────────────────────────────────
────███████████████────────────────────────────────────────────
─────█████████████─────────────────────────────────────────────
──────███████████──────────────────────────────────────────────
────────████████───────────────────────────────────────────────
─────────███──██───────────────────────────────────────────────
─────────██────█───────────────────────────────────────────────
─────────█─────█───────────────────────────────────────────────
─────────██────██──────────────────────────────────────────────
───────────────────────────────────────────────────────────────
      </div>); //

    const [head,tail] = right.split('_');
    if (head=='office'){
      if (tail=='clerk'){
         CONTENT = (<React.Fragment>
            <BasicData disabled={true}/>
            <ClaimantData disabled={true}/>
             {addrH}
            <AddressData key={JSON.stringify(fullAddr)} cBack={cBack} fullAddr={fullAddr} disabled={true} />
            <OrganizationsData disabled={true}/>
            <SummaryData disabled={true}/>
          </React.Fragment>); //
      } else if (tail=='response') {
        CONTENT = ( <TopicsData responseMode={true} />); //
      } else if (tail=='chief') {
        CONTENT = (<React.Fragment>
            <BasicData />
            <ClaimantData />
            {addrH}
            <AddressData key={JSON.stringify(fullAddr)} cBack={cBack} fullAddr={fullAddr}  />
            <OrganizationsData />
            <SummaryData />
          </React.Fragment>); //
      }
    } else if (head=='department'){
      if (tail=='admin'){
         CONTENT = (<React.Fragment>
              <BasicData disabled={true}/>
              <ClaimantData disabled={true}/>
              {addrH}
              <AddressData key={JSON.stringify(fullAddr)} cBack={cBack} fullAddr={fullAddr} disabled={true} />
              <OrganizationsData disabled={true}/>
              <SummaryData disabled={true}/>
              <TopicsData adminMode={true} />
            </React.Fragment>); //
      } else if (tail=='clerk'){
         CONTENT = (<React.Fragment>
              <TopicsData />
              <IshDocsData reloadRow={this.reloadRow} />
              <DocsLink reloadRow={this.reloadRow} />
             </React.Fragment>); //
      } else if (tail=='verifier'){
         CONTENT = (<React.Fragment>
              <TopicsData disabled={true} />
              <IshDocsData reloadRow={this.reloadRow} disabled={true} />
              <DocsLink reloadRow={this.reloadRow} disabled={true} />
             </React.Fragment>); //
      } else if (tail=='chief'){
         CONTENT = (<React.Fragment>
              <TopicsData />
              <IshDocsData reloadRow={this.reloadRow} />
              <DocsLink reloadRow={this.reloadRow} />
             </React.Fragment>); //
      }
    } else if (head=='archive'){
      if (tail=='clerk'){
        CONTENT = <ArchiveData/>
      } else if (tail=='chief'){
        CONTENT = (<React.Fragment>
                      <BasicData disabled={true}/>
                      <ClaimantData disabled={true}/>
                      <TopicsData disabled={true} />
                      <IshDocsData reloadRow={this.reloadRow} disabled={true} />
                      <DocsLink reloadRow={this.reloadRow} disabled={true} />
                      <ArchiveData/>
                   </React.Fragment>); //
      }
    } else if (head=='general'){
      if (tail=='observer'){
          CONTENT = (<React.Fragment>
            <BasicData disabled={true}/>
            <ClaimantData disabled={true}/>
            {addrH}
            <AddressData key={JSON.stringify(fullAddr)} cBack={cBack} fullAddr={fullAddr} disabled={true} />
            <OrganizationsData disabled={true}/>
            <SummaryData disabled={true}/>
            <TopicsData disabled={true}/>
            <IshDocsData reloadRow={this.reloadRow} disabled={true} />
            <DocsLink reloadRow={this.reloadRow} disabled={true}/>
            <PlusDocs disabled={true} />
            <ArchiveData disabled={true}/>
          </React.Fragment>); //
      } else if (tail=='super') {
        CONTENT = (<React.Fragment>
            <BasicData/>
            <ClaimantData/>
            {addrH}
            <AddressData key={JSON.stringify(fullAddr)} cBack={cBack} fullAddr={fullAddr} />
            <OrganizationsData/>
            <SummaryData/>
            <TopicsData/>
            <IshDocsData reloadRow={this.reloadRow} />
            <DocsLink reloadRow={this.reloadRow}/>
            <PlusDocs  />
            <ArchiveData/>
          </React.Fragment>); //
      }
    }

    return (
      <SidePanel hashHolder={(cb)=>(this.hashHold=cb)}>
                <Card className="ap-sticky-card box-card" bodyStyle={{ padding: 0 }} header={
                    <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main'>
                        <h1 className='ap-h1 flex-parent flex-parent--center-cross'>
                            Входящее обращение
                        </h1>
                    </div>
                }>
                {CONTENT}
                </Card>
            </SidePanel>
    ); //
  }
}

const mapStateToProps = (state,props)=>{
    let id = state.getIn(['form','appeal','values','id']);
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
