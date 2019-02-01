import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BasicData from './appealContent/basicData.js'
import ClaimantData from './appealContent/claimantData.js'
import TestElement2RF from './appealContent/testElement2rf.js'
import OrganizationsData from './appealContent/organizationsData.js'

const NAVI = {
  testElements: {
    header: 'тест',
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
    nextPage: ()=>'organizationData',  
    prevPage: ()=>'basicData'
  },
  organizationData: {
    header: '',
    form: OrganizationData,
    nextPage: ()=>'organizationData',  
    prevPage: ()=>'claimantData'
  }
}

export default class AppealWizard extends Component {
  
  constructor(props) {
    super(props)
    this.state = { page: props.page || 'testElements' }
  }

  toPage(newPage){
    this.setState({page: newPage});
  }

  render() {
    const a = this;
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