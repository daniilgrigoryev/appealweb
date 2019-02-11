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

const NAVI = {
  testElements: {
    header: 'Ejs 2 reduxF test',
    form: TestElement2RF,
    nextPage: ()=>'basicData'
  },
  basicData : {
    header: 'Основные сведения',
    form: BasicData,
    nextPage: ()=>'claimantData'  
  },
  claimantData: {
    header: 'Сведения о заявителе',
    form: ClaimantData,
    nextPage: ()=>'organizationsData',  
    prevPage: ()=>'basicData'
  },
  organizationsData: {
    header: 'Организации',
    form: OrganizationsData,
    nextPage: (isMadi)=> isMadi ? 'summaryData' : 'topicsData',  
    prevPage: ()=>'claimantData'      //   ^       ^
  },                                  //   |       |
  summaryData:{                       //   |       |
    header: 'Краткое содержание',     //   |       |
    form: SummaryData,                // <--       |         
    nextPage: ()=>'topicsData',       //   мади    | не мади
    prevPage: ()=>'organizationsData' // <--       |  
  },                                  //   |       |
  topicsData: {                       //   |       |
    header: 'Темы обращения',         //   |       |
    form: TopicsData,                 //   |       |
    nextPage: ()=>'ishDocsData',      //   V       V
    prevPage: (isMadi)=> isMadi ? 'summaryData': 'organizationsData'
  },
  ishDocsData:{
    header: 'Исходящие документы',
    form: IshDocsData,
    nextPage: ()=>'archiveData',  
    prevPage: ()=>'topicsData'
  },
  archiveData: {
    header: 'Архивная информация',
    form: ArchiveData,
    nextPage: ()=>'basicData',  
    prevPage: ()=>'ishDocsData'
  }
}

export default class AppealWizard extends Component {

  constructor(props) {
    super(props)
    this.state = { page: props.page || 'basicData' ||'testElements' }
  }

  toPage(page){
    this.setState({page});
  }

  render() {
    const { page } = this.state
    const toPage = this.toPage.bind(this);

    const Page = NAVI[page];
    const {header} = Page;
    const nextPage = Page.nextPage && (function(){ toPage(Page.nextPage(this)); });
    const prevPage = Page.prevPage && (function(){ toPage(Page.prevPage(this)); });
    const props = {nextPage,prevPage,header};

    return (
      <div>
        <Page.form {...props} />
      </div>
    )
  }//
}