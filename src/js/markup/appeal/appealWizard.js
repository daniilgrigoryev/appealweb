import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BasicData from './appealContent/basicData.js'
import ClaimantData from './appealContent/claimantData.js'
import TestElement2RF from './appealContent/testElement2rf.js'
import OrganizationsData from './appealContent/organizationsData.js'
import SummaryData from './appealContent/summaryData.js'
import TopicsData from './appealContent/topicsData.js'
import IshDocsData from './appealContent/ishDocsData.js'
import ArchiveData from './appealContent/archiveData.js'

import FullAppeal from './fullAppeal.js'

const NAVI = {
  testElements: {
    form: TestElement2RF,
    nextPage: ()=>'basicData'
  },
  basicData : {
    form: BasicData,
    nextPage: ()=>'claimantData'  
  },
  claimantData: {
    form: ClaimantData,
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
    nextPage: ()=>'fullAppeal',  
    prevPage: ()=>'ishDocsData'
  },
  fullAppeal: {
    form: FullAppeal,
    nextPage: ()=>'fullAppeal',  
    prevPage: ()=>'archiveData'
  }
}

export default class AppealWizard extends Component {

  constructor(props) {
    super(props)
    this.state = { page: props.page /* || 'fullAppeal'*/ ||'basicData' }
  }

  toPage(page){
    this.setState({page});
  }

  render(){
    const { page } = this.state
    const toPage = this.toPage.bind(this);

    const Page = NAVI[page];
    const nextPage = Page.nextPage && (function(){ toPage(Page.nextPage(this)); });
    const prevPage = Page.prevPage && (function(){ toPage(Page.prevPage(this)); });
    const props = {nextPage,prevPage};

    return (
      <div>
        <Page.form {...props} />
      </div>
    )
  }//
}