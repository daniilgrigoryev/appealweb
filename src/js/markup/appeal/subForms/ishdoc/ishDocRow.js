import React from 'react'
import * as _ from 'lodash'
import {Button, Dropdown} from 'element-react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../../components/finput.js'
import {EPicker, FPicker} from '../../../components/picker.js'
import {ECheckbox, FCheckbox} from '../../../components/checkbox.js'
import {FAutocomplete} from '../../../components/fautocomplete.js'
import {getAc} from '../../../../services/acCacher.js'
import FabulaDialog from '../fabulaDialog.js'
import mapping from '../../mapping.js'
import {post} from '../../../../services/ajax.js'
import {getSessionId, getSystem} from '../../../../selectors/common.js'
import Immutable from 'immutable'

const M = mapping.ishDocList;

const data2str = (data) =>{
    if (data){
        return (data instanceof Date) ? data.toISOString() : data; 
    }
    return '';
} 

const stopPg = (cb, id) => (evt) => {
    evt.stopPropagation();
    cb(id);
    return false;
}

const themesLoad = (claim_id)=>post("db/select",{alias : 'CLAIM_THEMES_BY_ID', listValueField : 'value', claim_id});

const IshDocRow = (props) => {
    const {ind, field, value, onRemove, onInfo, onExpand, checkExpand, onFabula, fabData, disabled, claim_id, collapse,fTypes} = props;

    const id = value.get('id');
    const related_topic = value.get('related_topic');
    const expanded = checkExpand(ind);
    const onRmv = stopPg(onRemove, ind);
    const onInf = stopPg(onInfo, id);
    const onXpd = () => onExpand(ind);
    const commandFabula = (type, el) => onFabula(type, fabData,related_topic,id);

    const linkingThemes = props.categories;

    const P = value;

    const hasTopic = !_.isEmpty(related_topic);
    let DOC_MAKER = null;
    if (!disabled){
        if (hasTopic){
            DOC_MAKER = (<Dropdown onCommand={commandFabula} menu={
                            (<Dropdown.Menu>
                                {fTypes.map(x => <Dropdown.Item command={x.property}>{x.value}</Dropdown.Item>)}
                            </Dropdown.Menu>)}>
                            <Button size="small">Создать по шаблону<i className="el-icon-arrow-down el-icon--right"></i></Button>
                        </Dropdown>);
        } else { //
            DOC_MAKER = (<span>Конструктор шаблонов доступен после связывания документа с темой</span>);
        }
    } //

    if (!expanded) {
        const collapsed = (
            <React.Fragment key={id} >
                <tr>
                    <td>
                        <span className='ap-table-list-number mr12'>{ind + 1}</span>
                    </td>
                    <td>{P.get(M.DOC_TARGET.name)}</td>
                    <td>{P.get(M.ISH_NUM.name)}</td>
                    <td>{data2str(P.get(M.ISH_DATE.name))}</td>
                    <td>{P.get(M.PODPISAL.name)}</td>
                    <td>{P.get(M.STATUS.name)}</td>
                    <td className='pr12 align-r'>
                        {disabled ? null :
                            <Button type="text" onClick={onXpd}>
                                <i className="el-icon-edit color-green"/>
                            </Button>}

                        {disabled ? null :
                            <Button size="small" type="text" onClick={onRmv}>
                                <i className="el-icon-close color-red-dark"/>
                            </Button>}
                    </td>
                </tr>

                <tr>
                    <td colSpan='7'>
                        <hr className='txt-hr my6'/>
                    </td>
                </tr>
            </React.Fragment>
        );
        return [collapsed];
    } //

    const tGetter = ()=>themesLoad(claim_id);

    const editable = (
        <React.Fragment key={id + 'e1'} >
            <tr>
                <td colSpan='7'>
                    <div className='px12 py12 my6 ml-neg12 bg-white border round border--gray-light shadow-darken10'>
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <span className='ap-table-list-number mr12'>{ind + 1}</span>
                                </td>
                                <td>
                                    <span className='inline-block mr12'>
                                        <p className='ap-table__header'>{M.DOC_TARGET.label}</p>
                                        <Field disabled={disabled} component={FInput} name={field + M.DOC_TARGET.name} value={P[M.DOC_TARGET.name]}/>
                                     </span>
                                </td>
                                <td>
                                    <span className='inline-block mr12'>
                                        <p className='ap-table__header'>{M.ISH_NUM.label}</p>
                                        <Field disabled={disabled} component={FInput} name={field + M.ISH_NUM.name} value={P[M.ISH_NUM.name]}/>
                                     </span>
                                </td>
                                <td>
                                    <span className='inline-block mr12'>
                                        <p className='ap-table__header'>{M.ISH_DATE.label}</p>
                                        <Field disabled={disabled} component={FPicker} name={field + M.ISH_DATE.name} value={P[M.ISH_DATE.name]} datepicker='+'/>
                                    </span>
                                </td>
                                <td colSpan='3'>
                                    <span className='inline-block mr12'>
                                        <p className='ap-table__header'>{M.PODPISAL.label}</p>
                                        <Field disabled={disabled} component={FInput} name={field + M.PODPISAL.name} value={P[M.PODPISAL.name]}/>
                                    </span>
                                </td>
                            </tr>
                            <tr key={id + 'e2'}>
                                <td colSpan='6'>
                                    <h4 className='ap-h4'>{M.DETAIL_INF.label}</h4>
                                    <table className='wmax600'>
                                        <tbody>
                                        <tr>
                                            <td className='ap-input-caption'>{M.REL_TOPIC.label}</td>
                                            <td>
                                                <Field disabled={disabled} component={FAutocomplete} name={field + M.REL_TOPIC.name}   value={P[M.REL_TOPIC.name]} datapromise={tGetter}/>
                                            </td>
                                            <td className='ap-input-caption'>{M.CRYPTO_SIGN.label}</td>
                                            <td><Field disabled={disabled} component={FCheckbox} name={field + M.CRYPTO_SIGN.name}  value={P[M.CRYPTO_SIGN.name]}/></td>
                                        </tr>
                                        <tr>
                                            <td className='ap-input-caption'>{M.DOC_VID.label}</td>
                                            <td><Field disabled={disabled} component={FAutocomplete} name={field + M.DOC_VID.name}  value={P[M.DOC_VID.name]} dataKey={M.DOC_VID.key}/></td>
                                            <td className='ap-input-caption'>{M.DELIV_TYPE.label}</td>
                                            <td><Field disabled={disabled} component={FAutocomplete} name={field + M.DELIV_TYPE.name}   value={P[M.DELIV_TYPE.name]} dataKey={M.DELIV_TYPE.key}/></td>
                                        </tr>
                                        <tr>
                                            <td className='ap-input-caption'>{M.SHEETS_COUNT.label}</td>
                                            <td><Field disabled={disabled} component={FInput} name={field + M.SHEETS_COUNT.name}    value={P[M.SHEETS_COUNT.name]}/></td>
                                            <td className='ap-input-caption'>{M.EDO_NUM.label}</td>
                                            <td><Field disabled={disabled} component={FInput} name={field + M.EDO_NUM.name} value={P[M.EDO_NUM.name]}/></td>
                                        </tr>

                                        <tr>
                                            <td className='ap-input-caption'>{M.COMMENT.label}</td>
                                            <td colSpan='3'><Field disabled={disabled} component={FInput} name={field + M.COMMENT.name} value={P[M.COMMENT.name]} type="textarea"/></td>
                                        </tr>
                                        </tbody>
                                    </table>

                                    <hr className='txt-hr my18'/>

                                    <div className='flex-parent flex-parent--center-cross'>
                                        <h4 className="ap-h4 mr18 mb0">{'' && M.FAB_DOC.label}</h4>
                                        {DOC_MAKER}
                                    </div>

                                    <hr className='txt-hr my18'/>
                                    <h4 className="ap-h4">{M.FORMED_DOCS.label}</h4>

                                    <table>
                                        <tbody>
                                        <tr className='flex-parent flex-parent--center-cross'>
                                            <td>
                                                <span className='ap-table-list-number mr12'>{ind + 1}</span>
                                            </td>
                                            <td className='ap-table__header'>наименование документа</td>
                                            <td>
                                                <Button size="small" type="text">
                                                    <i className="el-icon-close color-red-dark ml18"/>
                                                </Button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <hr className='txt-hr my18'/>
                        <div className='flex-parent flex-parent--space-between-main flex-parent--center-cross'>
                            <Button type="text" size="small" onClick={collapse}>
                                <span className='color-blue'>Свернуть</span>
                            </Button>
                            <div>
                                {disabled ? null :
                                    <Button type="text" onClick={onRmv}>
                                        <i className="el-icon-delete color-red-dark"/>
                                    </Button>}
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td colSpan='7'>
                    <hr className='txt-hr my18'/>
                </td>
            </tr>
        </React.Fragment>);
    return editable;
} //

export default IshDocRow