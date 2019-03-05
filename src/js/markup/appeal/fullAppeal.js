import React from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {reduxForm} from 'redux-form/immutable'

import {Button, Card, Layout} from 'element-react'

import BasicData from './appealContent/basicData.js'
import ClaimantData from './appealContent/claimantData.js'
import OrganizationsData from './appealContent/organizationsData.js'
import SummaryData from './appealContent/summaryData.js'
import TopicsData from './appealContent/topicsData.js'
import IshDocsData from './appealContent/ishDocsData.js'
import ArchiveData from './appealContent/archiveData.js'

import {exportString} from '../../services/stringExporter.js'
import {push} from '../../services/api.js'


class FullAppeal extends React.Component {

   constructor(props){
		super(props);
		this.outCsv = this.outCsv.bind(this);
		this.pushCsv = this.pushCsv.bind(this);
	}

	outCsv(){
		const {content,id} = this.props;
		exportString('Обращение ' + id,JSON.stringify(content));
	}

	pushCsv(){
		const {content,id} = this.props;
		push(-1,'testAlias',content)
	}

    render() {
        const p = this.props;
        return (
            <div className='mb60'>
                <Layout.Row gutter="12">
                    <Layout.Col md="12" sm='24'>
                        <ClaimantData      {...p} />
                    </Layout.Col>

                    <Layout.Col md="6" sm='24'>
                        <BasicData         {...p} />
                        <div className='mt12'>
                            <OrganizationsData {...p} />
                        </div>

                        <div className='mt12'>
                            <SummaryData       {...p} />
                        </div>
                    </Layout.Col>

                    <Layout.Col md="6" sm='24'>
                        <TopicsData        {...p} />

                        <div className='mt12'>
                            <IshDocsData       {...p} />
                        </div>

                        <div className='mt12'>
                            <ArchiveData       {...p} />
                        </div>
                    </Layout.Col>
                </Layout.Row>

                <div className="ap-footer">
                    <Button size='small' onClick={this.outCsv}>Выгрузить CSV</Button>
					<Button size='small' onClick={this.pushCsv}>На сервер CSV</Button>
                </div>
            </div>
        );
    }//
}

const mapStateToProps = (state) => {
    const V = state.getIn(['form', 'appeal', 'values']);
    return {
        disabled: true,
        system: state.getIn(['general', 'system']),
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