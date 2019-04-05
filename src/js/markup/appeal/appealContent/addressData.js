import React, { useState } from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../components/finput.js'
import {EAutocomplete, FAutocomplete} from '../../components/fautocomplete.js'
import {Card, Layout, Button} from 'element-react'
import Immutable from 'immutable'
import {getAc,getAcValue,getAcNoCache} from '../../../services/acCacher.js'

import mapping from './mapping.js'

const im = (obj)=> Immutable.fromJS(obj)

const headerTitle = 'Адрес';
const M = mapping.claimantData;


const AddressData = props => {
    const {fl,formData} = props;
    const [isStr, setIsStr] = useState(true);
    const [strData, setStrData] = useState('');

    const addrData = _.pick(formData, [M.REGION.name, M.RAYON.name, M.NPUNKT.name, M.STREET.name]);
    const formDataStr = JSON.stringify(Object.assign({}, addrData));
    
    const isFL = +fl!= 2

    const KVART = isFL
            ? ([
                <td key='kvFl1' className='ap-input-caption'>{M.KVART.label}</td>,
                <td key='kvFl2'><Field name={M.KVART.name} component={FInput}/></td>
            ])
            : ([
                <td key='kvUl1' className='ap-input-caption'>{M.OFFICE.label}</td>,
                <td key='kvUl2'><Field name={M.OFFICE.name} component={FInput}/></td>
            ]);
//
    const ADDRESS = isStr
            ? ([<tr>
                    <td className='ap-input-caption'>{M.ADDRESS.label}</td>
                    <td><Field name={M.ADDRESS.name} component={FInput} value={strData}/></td>
                    <td><Button size="small" icon="plus" type="success" plain={true}
                            className="flex-parent mb18"
                            title='Раскрыть' onClick={()=>setIsStr(false)}>Раскрыть</Button></td>
                </tr>
            ]) 
            :   ([
                <React.Fragment><tr>
                    <td className='ap-input-caption'>{M.REGION.label}</td>
                    <td colSpan='3'><Field name={M.REGION.name} component={FAutocomplete} dataWhere={formDataStr} dataKey={M.REGION.key} onSelect={onSelect} /></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>{M.RAYON.label}</td>
                    <td colSpan='3'><Field name={M.RAYON.name} component={FAutocomplete}  dataWhere={formDataStr} dataKey={M.RAYON.key} onSelect={onSelect} /></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>{M.NPUNKT.label}</td>
                    <td colSpan='3'><Field name={M.NPUNKT.name} component={FAutocomplete} dataWhere={formDataStr} dataKey={M.NPUNKT.key} onSelect={onSelect} /></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>{M.STREET.label}</td>
                    <td colSpan='3'><Field name={M.STREET.name} component={FAutocomplete} dataWhere={formDataStr} dataKey={M.STREET.key} onSelect={onSelect} /></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>{M.DOM.label}</td>
                    <td><Field name={M.DOM.name} component={FInput}/></td>
                    <td className='ap-input-caption'>{M.KORPUS.label}</td>
                    <td><Field name={M.KORPUS.name} component={FInput}/></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>{M.STR.label}</td>
                    <td><Field name={M.STR.name} component={FInput}/></td>
                    {KVART}
                                 
                </tr>
                <tr>
                    <td className='ap-input-caption'>{M.PINDEX.label}</td>
                    <td colSpan='3'><Field name={M.PINDEX.name} component={FInput}/></td>
                </tr>

                {false && <React.Fragment><tr>
                    <td className='ap-input-caption'>{M.MESTO.label}</td>
                    <td colSpan='3'><Field name={M.MESTO.name} component={FInput}/></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>{M.KM.label}</td>
                    <td><Field name={M.KM.name} component={FInput}/></td>
                    <td className='ap-input-caption'>{M.MGO.label}</td>
                    <td><Field name={M.MGO.name} component={FInput}/></td>
                    <td className='ap-input-caption'>{M.MGT.label}</td>
                    <td><Field name={M.MGT.name} component={FInput}/></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>{M.DOP_SVED.label}</td>
                    <td colSpan='3'><Field name={M.DOP_SVED.name} component={FInput}/></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>{M.SHIR.label}</td>
                    <td><Field name={M.SHIR.name} component={FInput}/></td>
                    <td className='ap-input-caption'>{M.DOLG.label}</td>
                    <td><Field name={M.DOLG.name} component={FInput}/></td>
                </tr></React.Fragment>}
                <tr>
                    <td><Button size="small" icon="plus" type="success" plain={true}
                            className="flex-parent mb18"
                            title='Сохранить' onClick={()=>setIsStr(true)}>Сохранить</Button></td>
                </tr></React.Fragment>
            ])

    //

    const onSelect = (newPropertyVal,fieldName)=>{
        const {dispatch,change} = props;
        if (fieldName==M.REGION.name){
            dispatch(change(M.RAYON.name, ""));
            dispatch(change(M.NPUNKT.name, ""));
            dispatch(change(M.STREET.name, ""));
        }
        if (fieldName==M.RAYON.name) {
            dispatch(change(M.NPUNKT.name, ""));
            dispatch(change(M.STREET.name, ""));
        }
        if (fieldName==M.NPUNKT.name) {
            dispatch(change(M.STREET.name, ""));
        }
    }


    return (
            <Layout.Row gutter="20">
                <Layout.Col span="24">
                    <Card className="box-card" header={
                        <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main'>
                            <h3 className='ap-h3 flex-parent flex-parent--center-cross'>
                                {headerTitle}
                            </h3>
                        </div>
                        }>
                        <form>
                            <table>
                                <tbody>
                                    {ADDRESS}
                                </tbody>
                            </table>
                        </form>
                    </Card>
                </Layout.Col>
            </Layout.Row>
    )
}; //



const mapStateToProps = (state) => { 
    let formData = state.getIn(['form', 'cur_formData', 'values']);
    formData && (formData = formData.toJS());
    return {formData};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'cur_formData', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true // <------ unregister fields on unmount
        //validate
    })
)(AddressData)


