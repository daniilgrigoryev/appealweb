import React from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Loading} from 'element-react'

import {get, post, del, put} from '../../services/ajax.js'

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default class AppealTable extends React.Component {

    constructor(props) {
        super(props);

        this.offsetTop = 0;
        this.state = {
            table: null,
            tableHeight: 0,
            first: 0,
            rows: 50,
            page: 0,
            pageCount: 0,
            selected: []
        };

        this.onPage = this.onPage.bind(this);
        this.getSelected = this.getSelected.bind(this);
    }

    componentDidMount() {
        const {registerGetSelected} = this.props;
        const {rows, first, page, pageCount} = this.state;
        this.onPage({rows, first, page, pageCount});
        if (registerGetSelected) {
            registerGetSelected(this.getSelected);
        }

        this.setTableHeight();
        window.addEventListener('resize', this.setTableHeight.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setTableHeight.bind(this));
    }

    setTableHeight() {
        this.setState({tableHeight : window.innerHeight - this.offsetTop - 88 - this.props.hdelta + "px"});
    }

    toSuitableVal(table) {
        return table.rows.map(x => _.zipObject(this.state.table.columns.map(y => y.label), x.map(y => y.value)))
    }

    getSelected() {
        const {selected} = this.state;
        return [...selected];
    }

    async onPage(event) {
        const {desc, sid, where} = this.props;
        const JSON_W = JSON.stringify(where);
        const par = Object.assign({}, desc, event, {sid, JSON_W})
        const x = await post('rest/select', par);
        const {data} = x;
        if (!data.rows){

        } else {                
            const s = Object.assign({}, this.state, {table: data}, event, where);
            this.setState(s);
        }
    }

    render() {
        const S = this.state;
        const TABLE = S.table;
        const FIRST = S.first;
        const ROWS = S.rows;
        const END = ROWS + FIRST;

        if (!TABLE) {
            return (<div className='mt60 mb120'><Loading loading={true} text='Поиск данных...'/></div>);
        }//

        const {actionCol, selectable, mapping, hdelta} = this.props;

        let getField = (f) => f;
        if (mapping) {
            getField = (f) =>mapping[f];
        }

        const VAL = this.toSuitableVal(TABLE);
        const head = "Записи с " + (FIRST + 1) + " до " + (END > TABLE.size ? TABLE.size : END) + " из " + TABLE.size + " записей";
        let dynamicColumns = TABLE.columns.filter(col => getField(col.label)).map(col => <Column key={col.label}
                                                                                                 field={col.label}
                                                                                                 header={getField(col.label)}
                                                                                                 style={{width: col.width}}/>); //

        if (selectable) {
            dynamicColumns.unshift(<Column key="Sel" selectionMode="multiple"
                                           style={{width: '30px', textAlign: 'center', padding: '0px 3px 0px 3px'}}/>); //
        }
        if (actionCol) {
            const {style, body} = actionCol;
            dynamicColumns.push(<Column body={body} style={style}/>);
        } //

        return (
            <DataTable selectionMode="multiple"
                       metaKeySelection={false}
                       scrollable={true}
                       paginator={true}
                       rows={ROWS}
                       emptyMessage='Нет записей в таблице'
                       first={FIRST}
                       lazy={true}
                       totalRecords={+TABLE.size}
                       scrollHeight={this.state.tableHeight}
                       value={VAL}
                       onPage={this.onPage}
                       header={head}
                       rowsPerPageOptions={[10, 25, 50, 100, 200, 300]}
                       selection={S.selected}
                       onSelectionChange={e => this.setState({selected: e.value})}>
                {dynamicColumns}
            </DataTable>
        ); //
    }

}