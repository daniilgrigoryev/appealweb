import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form/immutable'

import {Button} from 'element-react'

import BasicData from './appealContent/basicData.js'
import ClaimantData from './appealContent/claimantData.js'
import OrganizationsData from './appealContent/organizationsData.js'
import SummaryData from './appealContent/summaryData.js'
import TopicsData from './appealContent/topicsData.js'
import IshDocsData from './appealContent/ishDocsData.js'
import ArchiveData from './appealContent/archiveData.js'

import {exportString} from '../../services/stringExporter.js'

const styleWrap = {
	display: 'flex',
    flexWrap: 'wrap'
}

class FullAppeal extends React.Component {

	constructor(props){
		super(props);
		this.outCsv = this.outCsv.bind(this);
	}

	outCsv(){
		const {content,id} = this.props;
		;
		exportString('Обращение ' + id,JSON.stringify(content));
	}

	render(){
		const p = this.props;
		return (
			<div style={styleWrap}>
				<BasicData         {...p} />
				<ClaimantData      {...p} />
				<OrganizationsData {...p} />
				<SummaryData       {...p} />
				<TopicsData        {...p} />
				<IshDocsData       {...p} />
				<ArchiveData       {...p} />

				<Button onClick={this.outCsv}>Выгрузить CSV</Button>
			</div>);
	} //
}


const mapStateToProps = (state)=>{
	const V = state.getIn(['form','appeal','values']);
	return {
		disabled: true,
		system: state.getIn(['general','system']),
	  	content: V ? V.toJS() : {}
	};
}

export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'appeal', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true // <------ unregister fields on unmount
  })
)(FullAppeal)