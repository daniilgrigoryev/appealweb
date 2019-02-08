import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BasicData from './appealContent/basicData.js'
import ClaimantData from './appealContent/claimantData.js'
import TestElement2RF from './appealContent/testElement2rf.js'
import OrganizationsData from './appealContent/organizationsData.js'
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
    nextPage: ()=>'topicsData',  
    prevPage: ()=>'claimantData'
  },
  topicsData: {
    header: 'Темы обращения',
    form: TopicsData,
    nextPage: ()=>'ishDocsData',  
    prevPage: ()=>'organizationsData'
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
    const { onSubmit } = this.props
    const toPage = this.toPage.bind(this);

    const Page = NAVI[page];
    const {header} = Page;
    const nextPage = Page.nextPage && (()=>toPage(Page.nextPage()));
    const prevPage = Page.prevPage && (()=>toPage(Page.prevPage()));
    const props = {nextPage,prevPage,header};

    return (
      <div>
        <Page.form {...props} onSubmit={nextPage} />
      </div>
    )
  }//
}