import React, { Component } from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Field, reduxForm} from 'redux-form/immutable'
import Immutable from 'immutable'

import BasicData from './appealContent/basicData.js'
import ClaimantData from './appealContent/claimantData.js'
import TestElement2RF from './appealContent/testElement2rf.js' 
import OrganizationsData from './appealContent/organizationsData.js'
import SummaryData from './appealContent/summaryData.js'
import TopicsData from './appealContent/topicsData.js'
import IshDocsData from './appealContent/ishDocsData.js'
import ArchiveData from './appealContent/archiveData.js'
import FullAppeal from './fullAppeal.js' 
import {post} from '../../services/ajax.js'
import {appealSetId} from '../../actions/common.js'

const im = (obj)=> Immutable.fromJS(obj)

const NAVI = {
  testElements: {
    form: TestElement2RF,
    nextPage: ()=>'basicData'
  },
  basicData : {
    form: BasicData,
    alias: 'CLAIM_PUSH',
    nextPage: ()=>'claimantData'  
  },
  claimantData: {
    form: ClaimantData,
    alias: 'CLAIM_PUSH',
    nextPage: ()=>'organizationsData',  
    prevPage: ()=>'basicData'
  },
  organizationsData: {
    form: OrganizationsData,
    alias: 'CLAIM_2_ORG_PUSH',
    nextPage: (isMadi)=> isMadi ? 'summaryData' : 'topicsData',  
    prevPage: ()=>'claimantData'      //   ^       ^
  },                                  //   |       |
  summaryData:{                       //   |       |
    form: SummaryData,                // <--       |         
    alias: 'CLAIM_3_APNS_PUSH',       //           |
    nextPage: ()=>'topicsData',       //   мади    | не мади
    prevPage: ()=>'organizationsData' // <--       |  
  },                                  //   |       |
  topicsData: {                       //   |       |
    form: TopicsData,                 //   |       |
    alias: 'CLAIM_4_CATS_PUSH',       //   |       |
    nextPage: ()=>'ishDocsData',      //   V       V
    prevPage: (isMadi)=> isMadi ? 'summaryData': 'organizationsData'
  },
  ishDocsData:{
    form: IshDocsData,
    alias: 'CLAIM_5_ISHDOC_PUSH',
    nextPage: ()=>'archiveData',  
    prevPage: ()=>'topicsData'
  },
  archiveData: {
    form: ArchiveData,
    alias: 'CLAIM_PUSH',
    nextPage: ()=>'fullAppeal',  
    prevPage: ()=>'ishDocsData'
  },
  fullAppeal: {
    form: FullAppeal,
    nextPage: ()=>'fullAppeal',  
    prevPage: ()=>'archiveData'
  }
};

class AppealWizard extends Component {

  constructor(props) {
    super(props);
    this.state = { page: props.page || 'basicData' ||'basicData' }
  }

  toPage(page){
    this.setState({page});
  }

  render(){
    const a = this;
    const {page} = this.state
    const toPage = this.toPage.bind(this);
    const Page = NAVI[page];

    const slidePage  = function(toggler){
      return function(){ // ! NO ARROW FUNCTION, CONTEXT DEPENDED
        const {form,dispatch,change} = a.props;
        const data = JSON.stringify(Object.assign({},form.values));
        
        const {alias} = Page;
        const jsonMode = true;
        
        if (!alias){
          return toggler(this); 
        }

        post('rest/push',{alias,data,jsonMode}).then(x=>{
            const F = form;
            const V = F ? F.values : {};

            const json = x.data.rows[0][0].value; // the first column value of single row expected
            // debugger;
            try{
              const R = JSON.parse(json); // ret holder

              // ! CASE SENSITIVE changers
              if (R.claim_id){ /// upsert claim  
                 dispatch(change('id',R.claim_id));
              } else if (R.org_c || R.org_r){ // upsert organizations
                 const c_ids = R.org_c || [];
                 const r_ids = R.org_r || [];

                 const c = _.map(V.organizations_control,(x,i)=>(x.id=c_ids[i],x));
                 const r = _.map(V.organizations_from,(x,i)=>(x.id=r_ids[i],x));

                 dispatch(change('organizations_control',im(c)));
                 dispatch(change('organizations_from',im(r)  ));
              } else if (R.apn_ids){ // upsert apns
                const a_ids = R.apn_ids || [];
                const a = _.map(V.apn_list, (x, i)=>(x.id = a_ids[i],x));

                //dispatch(change('questions',q));
                dispatch(change('apn_list',im(a)));
              } else if(R.theme_ids){ // upsert themes
                const t_ids = R.theme_ids  || []; 
                const t = _.map(V.topics_data, (x, i)=>(x.id = t_ids[i],x));

                dispatch(change('topics_data',im(t)));
              } else if (R.ishdoc_ids){ // upsert ishdocs
                const d_ids = R.ishdoc_ids || [];
                const d = _.map(V.ish_docs_data, (x, i)=>(x.id = d_ids[i],x));

                dispatch(change('ish_docs_data',im(d)));
              }
            } catch (exc){
              console.error(exc);
            }
            toggler(this);
        }).catch(x=>{
            //debugger;
            a.forceUpdate();
        });     
      }
    }
    
    const nextPage = Page.nextPage && slidePage((a)=>toPage(Page.nextPage(a)));
    const prevPage = Page.prevPage && slidePage((a)=>toPage(Page.prevPage(a)));
    const props = {nextPage,prevPage};

    return (
      <div>
        <Page.form {...props} />
      </div>
    );
  }
}

const mapStateToProps = (state,props)=>{
    let form = state.getIn(['form','appeal']);
    form && (form = form.toJS());
    return {form};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true // <------ unregister fields on unmount
        //validate
    })
)(AppealWizard)