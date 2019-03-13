import * as _ from 'lodash'
import React from 'react'
import {post, get} from '../../services/ajax.js'
import {Input, Switch, InputNumber, DatePicker, Button, Card, Layout} from 'element-react'

export default class DiapSPI extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newRow: {},
            rows: []
        };

        this.onInput = this.onInput.bind(this);
        this.pushNewRow = this.pushNewRow.bind(this);
    }

    onInput(field, value) {
        const {newRow} = this.state;
        const newValue = Object.assign({}, newRow, {[field]: value})
        this.setState({newRow: newValue});
    }

    pushNewRow() {
        const {newRow, rows} = this.state;
        this.setState({
            newRow: {},
            rows: [...rows, newRow]
        });
    }

    render() {
        const {rows, newRow} = this.state;
        const chg = (field) => (value) => this.onInput(field, value);

        const EDITOR = (
            <tr>
                <td>
                    <Input className='w180 mr24' value={newRow.index} onChange={chg('index')}/>
                </td>
                <td>
                    <DatePicker className='mr24' value={newRow.date} onChange={chg('date')}/>
                </td>
                <td>
                    <InputNumber className='mr24' value={newRow.diap_start} onChange={chg('diap_start')}/>
                </td>
                <td>
                    <InputNumber className='mr24' value={newRow.diap_end} onChange={chg('diap_end')}/>
                </td>
                <td className='ap-input-caption'></td>
                <td colSpan='2' className='flex-parent'>
                    <Button size="small" icon="plus" onClick={this.pushNewRow}
                            className="flex-parent mb18">
                        Добавить
                    </Button>
                    <Button size="small" icon="upload2"
                            className="flex-parent mb18">
                        Загрузить
                    </Button>
                </td>
            </tr>
        );

        const ROWS = rows.map((rw, index) => (
            <tr key={index}>
                <td>
                    <Input value={rw.index} disabled={true}/>
                </td>
                <td>
                    <DatePicker value={rw.date} isDisabled={true}/>
                </td>
                <td>
                    <Input defaultValue={rw.diap_start} disabled={true}/>
                </td>
                <td>
                    <Input defaultValue={rw.diap_end} disabled={true}/>
                </td>
                <td className='ap-input-caption align-l'>
                    Осталось {rw.estimate}
                </td>
                <td colSpan='2'>
                    <Switch className='mt12' value={rw.visible}/>
                </td>
            </tr>
        ));

        return (
            <Layout.Row gutter="20">
                <Layout.Col span="24">
                    <Card className="box-card mb60" header={
                        <h3 className='ap-h3'>
                            Настройки / Диапазоны ШПИ
                        </h3>
                    }>
                        <table>
                            <thead>
                            <tr>
                                <td className='ap-table-header'>Индекс предприятия связи</td>
                                <td className='ap-table-header'>Дата</td>
                                <td className='ap-table-header'>Начало диапазона</td>
                                <td className='ap-table-header'>Конец диапазона</td>
                                <td className='ap-table-header'>Состояние</td>
                                <td></td>
                                <td></td>
                            </tr>
                            </thead>
                            <tbody>
                            {EDITOR}
                            {ROWS}
                            </tbody>
                        </table>
                    </Card>

                    <div className="ap-footer">
                        <Button>Сохранить</Button>
                    </div>
                </Layout.Col>
            </Layout.Row>
        );
    }
};
