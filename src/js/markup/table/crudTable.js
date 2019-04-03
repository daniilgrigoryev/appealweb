import * as _ from 'lodash'
import React from 'react'
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button, Card, Layout} from 'element-react'
import CrudRow from './crudRow.js'

const C = {
    DATE: (field) => (rowData, column) => {
        const d = rowData[column.field];
        return d ? d.toString() : '';
    },
    BOOL: (field) => (rowData, column) => {
        return rowData[column.field] ? '+' : '';
    },
    RADIO: (field) => (rowData, column) => {
        const d = rowData[column.field];
        return _.chain(field.radio)
            .filter(x => x.property == d)
            .map(x => x.value)
            .first()
            .value();
    }
}

const T = {
    D: C.DATE,
    T: C.DATE,
    DT: C.DATE,
    C: C.BOOL,
    SR: C.RADIO,
    NR: C.RADIO
}

const callIfExists = (func, ...args) => {
    return !func ? null : func.apply(null, Array.from(args));
}

export default class CrudTable extends React.Component {

    constructor(props) {
        super(props);

        let {rows, fields} = props;
        if (!_.size(fields)) {
            throw 'CrudTable: no data found'
        }
        rows = rows || [];

        this.state = {rows};

        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.select = this.select.bind(this);
        this.add = this.add.bind(this);
    }

    save(row) {
        const newRow = row || this.state.row;
        let rows = [...this.state.rows];

        debugger;

        if (this.newrow) {
            rows.push(newRow);
        } else {
            rows[this.findSelectedIndex()] = newRow;
        }

        this.setState({rows: rows, selectedRow: null, row: null, displayCrud: false});
    }

    delete() {
        let index = this.findSelectedIndex();
        this.setState({
            rows: this.state.rows.filter((val, i) => i !== index),
            selectedRow: null,
            row: null,
            displayCrud: false
        });
    }

    findSelectedIndex() {
        const {rows, selectedRow} = this.state;
        return rows.indexOf(selectedRow);
    }

    updateProperty(field, value) {
        let row = this.state.row;
        row[field.field] = value;
        this.setState({row});
    }

    select(e) {
        this.newrow = false;
        this.setState({
            displayCrud: true,
            row: Object.assign({}, e.data)
        });
    }

    add() {
        const {fields} = this.props;
        const newRow = {};

        fields.forEach(x => {
            let newVal = (x.type == 's') ? '' : null;
            newRow[x.field] = newVal;
        });

        this.newrow = true;
        this.setState({
            row: Object.assign({}, newRow),  // new row - has no id field
            displayCrud: true
        });
    }

    hideRow() {
        this.setState({displayCrud: false});
    }

    saveCrud(newRow) {
        setTimeout(() => {
            this.save(newRow);
        }, 100);
    }

    removeCrud() {
        setTimeout(() => {
            this.delete();
        }, 100);
    }

    render() {
        const {displayCrud, selectedRow, row, rows} = this.state;
        const {fields, editor, columns, title} = this.props;

        const removeCrud = this.removeCrud.bind(this);
        const hideRow = this.hideRow.bind(this);
        const saveCrud = this.saveCrud.bind(this);
        const updateProperty = this.updateProperty.bind(this);

        let CONTENT = null;
        if (displayCrud) {
            const rowFields = fields.filter(x => !x.noEdit);
            const Editor = editor;
            const EDITOR = !editor ? null : <Editor row={row}/>; //
            CONTENT = (
                <CrudRow fields={rowFields} row={row} saveCrud={saveCrud} hideRow={hideRow} removeCrud={removeCrud}
                         editor={EDITOR} columns={columns}/>); //
        } else {
            const tableFields = fields.filter(x => !x.noTable);
            CONTENT = (<DataTable
                value={this.state.rows}
                onRowSelect={this.select}
                header=''
                emptyMessage='Нет записей в таблице'
                selectionMode="single"
                selection={selectedRow}
                onSelectionChange={e => this.setState({selectedRow: e.value})}
            >
                {tableFields.map((f, i) => (<Column key={i} field={f.field} header={f.header} sortable={!!f.sortable}
                                                    body={callIfExists(T[f.type], f)}/>))}
            </DataTable>);
        }

        return (
            <Layout.Row gutter="20">
                <Layout.Col span="24">
                    <Card className="box-card mb60" bodyStyle={{padding: '0'}} header={
                        <div className='flex-parent flex-parent--center-cross'>
                            <h3 className='ap-h3'>Справочники / {title}</h3>
                            <Button type="primary" icon="plus"
                                    size='mini' className='ml12'
                                    onClick={this.add}/>
                        </div>
                    }>
                        {CONTENT}
                    </Card>
                </Layout.Col>
            </Layout.Row>
        )
    }
}