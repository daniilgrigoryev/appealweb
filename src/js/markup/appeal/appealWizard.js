import React, { Component } from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Field, reduxForm} from 'redux-form/immutable'

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
    nextPage: (isMadi)=> isMadi ? 'summaryData' : 'topicsData',  
    prevPage: ()=>'claimantData'      //   ^       ^
  },                                  //   |       |
  summaryData:{                       //   |       |
    form: SummaryData,                // <--       |         
    nextPage: ()=>'topicsData',       //   мади    | не мади
    prevPage: ()=>'organizationsData' // <--       |  
  },                                  //   |       |
  topicsData: {                       //   |       |
    form: TopicsData,                 //   |       |
    nextPage: ()=>'ishDocsData',      //   V       V
    prevPage: (isMadi)=> isMadi ? 'summaryData': 'organizationsData'
  },
  ishDocsData:{
    form: IshDocsData,
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
    const { page } = this.state
    const toPage = this.toPage.bind(this);

    const Page = NAVI[page];

    const slidePage  = function(toggler){ // ! NO ARROW FUNCTION, CONTEXT DEPENDED
      return ()=>{
        const {form,dispatch,change} = a.props;
        const data = JSON.stringify(Object.assign({},form.values));
        
        const {alias} = Page;
        const jsonMode = true;
        
        if (!alias){
          return toggler(this); 
        }

        post('rest/push',{alias,data,jsonMode}).then(x=>{
            const ID = x.data.rows[0][0].value; // the first column value of single row expected
            dispatch(change('ID',ID)); //  !CASE SENSITIVE
            toggler(this);
        }).catch(x=>{
            debugger;
            a.forceUpdate();
        });     
      }
    }
    
    const nextPage = Page.nextPage && slidePage(function(){ toPage(Page.nextPage(this)); });
    const prevPage = Page.prevPage && slidePage(function(){ toPage(Page.prevPage(this)); });
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