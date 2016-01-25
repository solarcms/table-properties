import React, { Component, PropTypes }  from 'react';

export default class ComboBox extends Component {


    render() {
        const { datas, comboClass, changeHandler, selected, style, label } = this.props;

        const labletext = label ?
            <label >{label} &nbsp;</label>
            :
            null
        return (
            <div className="form-group">
                {labletext}
                <select className={comboClass} onChange={changeHandler} value={selected} style={style}>
                    {datas.map((data, index)=>{
                        return <option value={data.value} key={index}>{data.text}</option>
                    })}
                </select>
            </div>

        )
    }
}
