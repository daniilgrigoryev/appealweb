import React from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../components/finput.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import {Button, Card, Layout} from 'element-react'
import mapping from '../mapping.js'

const M = mapping.ishLinksScan;

const getRow = (id, npost, desc, docId, content) => {
    return {
        id: id || null,
        desc: desc || '',
        docId: docId || null,
        content: content || null
    }
};

const scannedDocs = (props) => {
    const {fields, disabled} = props
    const add = () => fields.push(getRow());
    const rmv = (ind) => () => fields.remove(ind);
    const inf = (ind) => () => fields.remove(ind); // ! replace me
    const ROWS = fields.map((x, i) => (
        <tr key={i}>
            <td className="align-r pr6 w24">
              <span className='ap-table-list-number'>
                 {i + 1}
             </span>
            </td>
            <td>
                <span className='inline-block mr12 w-full pr6'>
                <Field component={FInput} name={x + M.ID.name} value={x[M.ID.name]}
                       disabled={disabled}/>
                </span>
            </td>
            <td>
                <span className='inline-block w-full'>
                <Field component={FInput} name={x + M.DESC.name} value={x[M.DESC.name]}
                       disabled={disabled}/>
                </span>

                {/*  {disabled ? null :
                    <Button type="text" onClick={inf(i)}>
                        <i className="el-icon-information color-blue"/>
                    </Button>
                }*/}

                {disabled ? null :
                    <Button size="small" className="absolute mt-neg2" type="text" onClick={rmv(i)}>
                        <i className="el-icon-close color-red-dark ml6"/>
                    </Button>
                }
            </td>
        </tr>));

    return (
        <React.Fragment>
            {!fields.length ?
                <p className='mt-neg18 mb18 txt-em color-gray'>Нет сканированных документов</p>
                :
                <Layout.Row gutter="0">
                    <Layout.Col xs="24" md="12" lg="10">
                        <table className='mb18 w-full'>
                            <thead>
                            <tr>
                                <th className='ap-table__header'></th>
                                <th className='ap-table__header'>{M.ID.label}</th>
                                <th className='ap-table__header'>{M.DESC.label}</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {ROWS}
                            </tbody>
                        </table>
                    </Layout.Col>
                </Layout.Row>
            }

            <div className='flex-parent flex-parent--center-cross'>
                {disabled ? null :
                    <Button size="small" icon="upload2" onClick={add} type="success" plain={true}
                            className="flex-parent mb18 mr12"
                            title='Добавить постановление'>Загрузить</Button>
                }

                {disabled ? null :
                    <Button size="small" icon="picture" onClick={add} type="success" plain={true}
                            className="flex-parent mb18"
                            title='Добавить постановление'>Сканировать</Button>
                }
            </div>
        </React.Fragment>);
};

class IshLinkScan extends React.Component {
    render() {
        const {disabled} = this.props;
        return (
            <div>
                <hr className='txt-hr my18'/>
                <h4 className='ap-h4'>{M.SCAN_DOC.label}</h4>

                <FieldArray name={M.SCAN_DOC.name} component={scannedDocs} disabled={disabled}/>
            </div>
        )
    }
}

export default reduxForm({
    form: 'outgoing', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(IshLinkScan)