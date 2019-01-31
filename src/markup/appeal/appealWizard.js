import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BasicData from './appealContent/basicData.js'
import ClaimantData from './appealContent/claimantData.js'

class AppealWizard extends Component {
  constructor(props) {
    super(props)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.state = {
      page: 1
    }
  }
  nextPage() {
    this.setState({ page: this.state.page + 1 })
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 })
  }

  render() {
    const { onSubmit } = this.props
    const { page } = this.state
    const a = this;


    const onClick = ()=>{
      const aa = a;
      debugger;
    }
    return (
      <div onClick={onClick}>
        {page === 1 && <BasicData onSubmit={this.nextPage} />}
        {page === 2 && (
          <ClaimantData
            previousPage={this.previousPage}
            onSubmit={onSubmit}
          />
        )}
      </div>
    )
  }
}

export default AppealWizard


/*

{page === 2 && (
          <WizardFormSecondPage
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
          />
        )}


*/