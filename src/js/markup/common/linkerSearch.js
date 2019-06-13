import * as _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {Button, Input, Radio} from 'element-react'
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import AppealTable from '../table/table.js'
import {post} from '../../services/ajax.js'
import {getSessionId} from '../../selectors/common.js'
import {messageSet} from '../../actions/common.js'


const M = {
        POST_NUMBER:       {name: 'npost',              label: '№ постановления'},
        NUM:               {name: 'number',             label: '№ обращения/письма'},
        FIO_ORG:           {name: 'fio',                label: 'ФИО/Организация'},
        SEARCH_DIR:        {name: 'search_dir',         label: 'Направление'},
        SEARCH_DIR_IN:     {name: 'IN',                 label: 'Входящие'},
        SEARCH_DIR_OUT:    {name: 'OUT',                label: 'Исходящие'},
        SEARCH_DOC:        {name: 'search_doc',         label: 'По документам'},
        SEARCH_DOC_CLAIM:  {name: 'CLAIM',              label: 'Жалобы'},
        SEARCH_DOC_LETTER: {name: 'LETTER',             label: 'Письма'}
};

class LinkerSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            npost: null,
            fio: null,
            number: null,

            searchDirection : M.SEARCH_DIR_IN.name,
            searchDocs: M.SEARCH_DOC_CLAIM.name,

            rows: [],
            selected: []
        }

        this.getSelected = null;

        this.onInput = this.onInput.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.linkTemplate = this.linkTemplate.bind(this);
        this.performLink = this.performLink.bind(this);
    }

    getSearchDesc() {
        const  {npost, fio, number, searchDirection, searchDocs} = this.state;
        return {npost, fio, number, searchDirection, searchDocs};
    }

    async onSearch() {
        const searchDesc = this.getSearchDesc();
        const alias = 'SEARCH_LINK_TABLE';
        const selected = await post('db/select',{alias, ...searchDesc});
        this.setState({rows: selected.data});
    }

    onInput(field,value) {
        this.setState({[field]:value});
    }

    async performLink(ENTITY_TYPE_ID,ID){ 
        const {root_id,root_doc,root_dir,dispatch,reloadRow} = this.props;
        const commonLink = {root_id,root_doc,root_dir};
        
        let link = {root_id,root_doc,root_dir,ENTITY_TYPE_ID,ID};
        link = _.mapKeys(link,(value,key)=>key.toUpperCase());
        const alias = 'CREATE_LINK_TABLE';
        try{
            await post('db/select',{alias, ...link});
            messageSet('Документы связаны','success');
            if (reloadRow){
                reloadRow();
            }
        } catch(exc){
            messageSet(exc,'error');
        }
    }

    linkTemplate(rowData, column) {
        const {ENTITY_TYPE_ID,ID} = rowData;
        return <div>
            <Button size="small" icon="share" onClick={()=>this.performLink(ENTITY_TYPE_ID,ID)} className="flex-parent mb18"
                title='Добавить связь между основным и выбранным документами'>Связать</Button>   
        </div>;
    } //

    render() {
        const S = this.state;
        const {searchDesc,searchDirection,searchDocs,rows} = this.state;
        const {dialogClose,root_id,root_doc,root_dir} = this.props;

        const searchEmpty = _.isEmpty(searchDesc);

        let TABLE = null;
        if (!_.isEmpty(rows)) {
            const size = _.size(rows);
            const overflow = size > 100;
            const msg = !overflow ? (' ('+size+'шт) ') : ' (показаны не все записи, уточните запрос)';
            const head = 'Доступные для связывания документы' + msg;
            
            /*<Column selectionMode="multiple" style={{width:'32px'}}/>*/  
            TABLE = (<DataTable
                       scrollable={true}
                       emptyMessage='Нет записей в таблице'
                       //totalRecords={size}
                       scrollHeight='400px'
                       value={rows}
                       //header={head}
                       //selection={S.selected}
                       //onSelectionChange={e => this.setState({selected: e.value})} 
                       >
                <Column body={this.linkTemplate} style={{width:'200px'}}/>        
                <Column key='NUM'               field='NUM'               header='Номер' />
                <Column key='REGISTRATION_DATE' field='REGISTRATION_DATE' header='Дата регистрации' />       
            </DataTable>);
        } else if (_.isEmpty(rows) && _.isEmpty(searchEmpty)){ //
            TABLE = (<div className='mt18 py36'><h4 className='txt-h4 align-center color-darken10'>Условие для поиска не задано</h4></div>);
        } else { //
            TABLE = (<div className='mt18 py36'><h4 className='txt-h4 align-center color-darken10'>Не найдено записей по условию</h4></div>);
        } //

        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td className="ap-input-caption">{M.POST_NUMBER.label}</td>
                        <td><Input id={M.POST_NUMBER.name} value={S[M.POST_NUMBER.name]} onChange={(v)=>this.onInput('npost',v)}/></td>
                    </tr>
                    <tr>
                        <td className="ap-input-caption">{M.NUM.label}</td>
                        <td><Input id={M.NUM.name} value={S[M.NUM.name]} onChange={(v)=>this.onInput('number',v)}/></td>
                    </tr>
                    {false && (<tr>
                        <td className="ap-input-caption">{M.FIO_ORG.label}</td>
                        <td><Input id={M.FIO_ORG.name} value={S[M.FIO_ORG.name]} onChange={(v)=>this.onInput('fio',v)}/></td>
                    </tr>)}
                    <tr>
                        <td className="ap-input-caption">{M.SEARCH_DIR.label}</td>
                        <td><Radio value={M.SEARCH_DIR_IN.name}  checked={searchDirection === M.SEARCH_DIR_IN.name}  onChange={()=>this.onInput('searchDirection',M.SEARCH_DIR_IN.name)}>{M.SEARCH_DIR_IN.label}</Radio></td>
                        <td><Radio value={M.SEARCH_DIR_OUT.name} checked={searchDirection === M.SEARCH_DIR_OUT.name} onChange={()=>this.onInput('searchDirection',M.SEARCH_DIR_OUT.name)}>{M.SEARCH_DIR_OUT.label}</Radio></td>
                    </tr>
                    <tr>
                        <td className="ap-input-caption">Поиск по</td>
                        <td><Radio value={M.SEARCH_DOC_CLAIM.name}  checked={searchDocs === M.SEARCH_DOC_CLAIM.name}  onChange={()=>this.onInput('searchDocs',M.SEARCH_DOC_CLAIM.name)}>{M.SEARCH_DOC_CLAIM.label}</Radio></td>
                        <td><Radio value={M.SEARCH_DOC_LETTER.name} checked={searchDocs === M.SEARCH_DOC_LETTER.name} onChange={()=>this.onInput('searchDocs',M.SEARCH_DOC_LETTER.name)}>{M.SEARCH_DOC_LETTER.label}</Radio></td>
                    </tr>
                    
                    <tr>
                        <td></td>
                        <td colSpan='4'>
                            <div className='flex-parent flex-parent--center-cross mt24'>
                                <Button size="small" type='primary' icon="search" onClick={this.onSearch}
                                        className="flex-parent mb18"
                                        title='Добавить тему'>Поиск</Button>

                                {false && (<Button size="small" icon="share" onClick={this.performLink} 
                                        className="flex-parent mb18"
                                        title='Добавить связь между основным и выбранным документами'>Связать</Button>)}      

                                <Button size="small" icon="share" onClick={dialogClose} 
                                        className="flex-parent mb18"
                                        title='Добавить связь между основным и выбранным документами'>Закрыть</Button>                
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>

                {TABLE}

            </div>
        ); //
    }
}; //

const state2props = (state) => {
    return {sid: getSessionId(state)};
}

export default connect(state2props)(LinkerSearch)