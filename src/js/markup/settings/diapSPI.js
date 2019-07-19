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
            <div className="row">
                <div className="column">
                    <div className="label">Индекс предприятия связи</div>
                    <div className="value">
                        <Input value={newRow.index} onChange={chg('index')}/>
                    </div>
                </div>
                <div className="column w130">
                    <div className="label">Дата</div>
                    <div className="value">
                        <DatePicker value={newRow.date} onChange={chg('date')}/>
                    </div>
                </div>
                <div className="column w130">
                    <div className="label">Начало диапазона</div>
                    <div className="value">
                        <InputNumber value={newRow.diap_start} onChange={chg('diap_start')}/>
                    </div>
                </div>
                <div className="column w130">
                    <div className="label">Конец диапазона</div>
                    <div className="value">
                        <InputNumber value={newRow.diap_end} onChange={chg('diap_end')}/>
                    </div>
                </div>
                <div className="column w130" style={{'height':'64px'}}>
                    <div className="label">Состояние</div>
                </div>
                <div className="column w130" style={{'height':'64px'}}>
                    <div className="label">Осталось</div>
                </div>
                <div className="column">
                    <div className="value" style={{'margin-top': '33px'}}>
                        <Button style={{'border': '1px solid #eaebec','width':'25px','height': '25px'}} 
                                className="py0 px0 round-full bg-white" 
                                size="small" type="text" 
                                onClick={()=>this.removePost(i)}>
                            <i className="ico upload w12"/>
                        </Button>

                        <Button className="py0" size="small" type="text" onClick={this.pushNewRow}>
                            <i className="ico round plus"/>
                        </Button>
                    </div>
                </div>

            </div>
        );

        const ROWS = rows.map((rw, index) => (
            <div className="row" key={index}>
                <div className="column">
                    <div className="value">
                        <Input value={rw.index} disabled={true}/>
                    </div>
                </div>
                <div className="column w130">
                    <div className="value">
                        <DatePicker value={rw.date} isDisabled={true}/>
                    </div>
                </div>
                <div className="column w130">
                    <div className="value">
                        <Input defaultValue={rw.diap_start} disabled={true}/>
                    </div>
                </div>
                <div className="column w130">
                    <div className="value">
                        <Input defaultValue={rw.diap_end} disabled={true}/>
                    </div>
                </div>
                <div className="column w130">
                    <div className="value">
                        {rw.estimate
                            ? <span>{rw.estimate}</span>
                            : <span className="txt-middle color-gray-light">[не заполнено]</span>
                        }
                    </div>
                </div>
                <div className="column w130">
                    <div className="value">
                        <Switch className="ml18" value={rw.visible}/>
                    </div>
                </div>
            </div>
        ));

        return (
            <React.Fragment>
                <Card className="box-card sectionCard" header={
                    <div className="headline">
                        <h3>Настройки / Диапазоны ШПИ</h3>
                    </div>
                }>
                    <div className="flex-table">{EDITOR}</div>
                    <div className="flex-table">{ROWS}</div>
                </Card>

                <div className="ap-footer">
                    <Button size="small">Сохранить</Button>
                </div>
            </React.Fragment>
        );
    }
};
