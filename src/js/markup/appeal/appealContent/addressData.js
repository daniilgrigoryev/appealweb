import React, { useState } from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {EInput} from '../../components/finput.js'
import {EAutocomplete} from '../../components/fautocomplete.js'
import {Card, Layout, Button} from 'element-react'
import Immutable from 'immutable'
import {getAc,getAcValue,getAcNoCache} from '../../../services/acCacher.js'
import {post} from '../../../services/ajax.js'

import mapping from './mapping.js'

const im = (obj)=> Immutable.fromJS(obj)

const headerTitle = 'Адрес';
const M = mapping.claimantData;


class AddressData extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isStr : true,
            fullAddr: {}
        }

        this.changeMode = this.changeMode.bind(this);
        this.save = this.save.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onListChange = this.onListChange.bind(this);
    }

    componentDidMount() {
        const {cdr} = this.props;
        if (cdr) {
            this.selectByCdr(cdr);
        }
    }

    selectByCdr(cdr) {
        if (cdr) {
            const {sid, cBack, kvart} = this.props;
            const orphan = true;
            const alias = "GET_ADDRESS";
            post('db/select',{alias,cdr,sid,orphan}).then(x=>{
                if (x.data && !x.data.error) {
                    let temp = x.data;
                    let fullAddr = Object.assign({},temp,{kvart});
                    this.setState({fullAddr});
                    cBack(null, fullAddr['cdr_address_id'], fullAddr['line_adr']);
                }
            });
        }
    }

    changeMode() {
        const isS = !this.state.isStr;
        this.setState({isStr : isS});
    }

    save() {
        const {cdr, sid, cBack} = this.props;
        const alias = "ADDR_PUSH";
        const orphan = true;
        const FULL = this.state.fullAddr;
        let data = {
            country_code_i: null,
            street : FULL.street,
            street_name_i : null,
            npunkt : FULL.npunkt,
            npunkt_tip_kod_i : null,
            npunkt_name_i : null,
            rayon : FULL.rayon,
            rayon_name_i : null,
            region : FULL.region,
            region_kod_i : null,
            dom : FULL.dom,
            korpus : FULL.korpus,
            str : FULL.str,
            pindex : FULL.pindex,
            okato_i: null,
        }
        data = JSON.stringify(data);
        post('db/push',{alias,cdr,sid,orphan,data}).then(x=>{
            if (x.data && !x.data.error) {  
                this.selectByCdr(x.data);
            }
        });
        
        FULL[M.KVART.name] && cBack(FULL[M.KVART.name]);
        
        const isS = !this.state.isStr;
        this.setState({isStr : isS});
    }

    onListChange(val,field) {
        let newState = Object.assign({},this.state);
        if (field==M.REGION.name){
            newState.fullAddr[M.RAYON.name] = "";
            newState.fullAddr[M.NPUNKT.name] = "";
            newState.fullAddr[M.STREET.name] = "";
        }
        if (field==M.RAYON.name) {
            newState.fullAddr[M.NPUNKT.name] = "";
            newState.fullAddr[M.STREET.name] = "";
        }
        if (field==M.NPUNKT.name) {
            newState.fullAddr[M.STREET.name] = "";
        }
        newState.fullAddr[field] = val;
        this.setState(newState);
    }

    onFieldChange(field,value){
        let newState = Object.assign({},this.state);
        newState.fullAddr[field] = value;
        this.setState({newState});
    }

    render() {
        const {fl,children} = this.props;
        const S = this.state;
        const F = S.fullAddr;
        const isFL = +fl!= 2

        const KVART = isFL
                ? ([
                    <td key='kvFl1' className='ap-input-caption'>{M.KVART.label}</td>,
                    <td key='kvFl2'><EInput value={F[M.KVART.name]} onChange={(v)=>this.onFieldChange([M.KVART.name],v)} /></td>
                ])
                : ([
                    <td key='kvUl1' className='ap-input-caption'>{M.OFFICE.label}</td>,
                    <td key='kvUl2'><EInput value={F[M.OFFICE.name]} onChange={(v)=>this.onFieldChange([M.OFFICE.name],v)} /></td>
                ]);
    //
        const ADDRESS = this.state.isStr
                ? ([<tr>
                        <td className='ap-input-caption'>{M.ADDRESS.label}</td>
                        <td>{children}</td>
                        <td><Button size="small" icon="plus" type="success" plain={true}
                                className="flex-parent mb18"
                                title='Раскрыть' onClick={this.changeMode}>Редактировать</Button></td>
                    </tr>
                ])// 
                :   ([
                    <React.Fragment><tr>
                        <td className='ap-input-caption'>{M.REGION.label}</td>
                        <td colSpan='3'><EAutocomplete value={F[M.REGION.name]} onChange={(val)=>this.onListChange(val,M.REGION.name)} dataKey={M.REGION.key} /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.RAYON.label}</td>
                        <td colSpan='3'><EAutocomplete value={F[M.RAYON.name]} onChange={(val)=>this.onListChange(val,M.RAYON.name)} dataWhere={_.pick(F, [M.REGION.name])} dataKey={M.RAYON.key} /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.NPUNKT.label}</td>
                        <td colSpan='3'><EAutocomplete value={F[M.NPUNKT.name]} onChange={(val)=>this.onListChange(val,M.NPUNKT.name)} dataWhere={_.pick(F, [M.REGION.name, M.RAYON.name])} dataKey={M.NPUNKT.key}  /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.STREET.label}</td>
                        <td colSpan='3'><EAutocomplete value={F[M.STREET.name]} onChange={(val)=>this.onListChange(val,M.STREET.name)} dataWhere={_.pick(F, [M.REGION.name,M.RAYON.name,M.NPUNKT.name])} dataKey={M.STREET.key}  /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.DOM.label}</td>
                        <td><EInput value={F[M.DOM.name]} onChange={(v)=>this.onFieldChange([M.DOM.name],v)}/></td>
                        <td className='ap-input-caption'>{M.KORPUS.label}</td>
                        <td><EInput value={F[M.KORPUS.name]} onChange={(v)=>this.onFieldChange([M.KORPUS.name],v)} /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.STR.label}</td>
                        <td><EInput value={F[M.STR.name]} onChange={(v)=>this.onFieldChange([M.STR.name],v)} /></td>
                        {KVART}
                                     
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.PINDEX.label}</td>
                        <td colSpan='3'><EInput value={F[M.PINDEX.name]} onChange={(v)=>this.onFieldChange([M.PINDEX.name],v)} /></td>
                    </tr>

                    {false && <React.Fragment><tr>
                        <td className='ap-input-caption'>{M.MESTO.label}</td>
                        <td colSpan='3'><EInput value={F[M.MESTO.name]} onChange={(v)=>this.onFieldChange([M.MESTO.name],v)} /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.KM.label}</td>
                        <td><EInput value={F[M.KM.name]} onChange={(v)=>this.onFieldChange([M.KM.name],v)} /></td>
                        <td className='ap-input-caption'>{M.MGO.label}</td>
                        <td><EInput value={F[M.MGO.name]} onChange={(v)=>this.onFieldChange([M.MGO.name],v)} /></td>
                        <td className='ap-input-caption'>{M.MGT.label}</td>
                        <td><EInput value={F[M.MGT.name]} onChange={(v)=>this.onFieldChange([M.MGT.name],v)} /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.DOP_SVED.label}</td>
                        <td colSpan='3'><EInput value={F[M.DOP_SVED.name]} onChange={(v)=>this.onFieldChange([M.DOP_SVED.name],v)} /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.SHIR.label}</td>
                        <td><EInput value={F[M.SHIR.name]} onChange={(v)=>this.onFieldChange([M.SHIR.name],v)} /></td>
                        <td className='ap-input-caption'>{M.DOLG.label}</td>
                        <td><EInput value={F[M.DOLG.name]} onChange={(v)=>this.onFieldChange([M.DOLG.name],v)} /></td>
                    </tr></React.Fragment>}
                    <tr>
                        <td><Button size="small" icon="plus" type="success" plain={true}
                                className="flex-parent mb18"
                                title='Применить' onClick={this.save}>Применить</Button></td>
                    </tr></React.Fragment>
                ])
        //

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
    }
} //

const mapStateToProps = (state) => { 
    let sid = state.getIn(['general','user','sessionID']);
    return {sid}
}

export default connect(mapStateToProps)(AddressData)


