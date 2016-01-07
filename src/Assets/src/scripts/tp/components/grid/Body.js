import React, { Component, PropTypes }  from 'react';

import Form from '../form/page_add_edit/Form'


export default class Body extends Component {
    setRowEdit(editID, focusIndex) {
        if(this.props.formType == 'inline')
            this.props.setRowEdit(editID, focusIndex)
    }
    handleDeleteItem(id) {

        if (!confirm('Delete this record?'))
        { return; }
        else
            this.props.handleDeleteItem(id)


    }
    changeValues(e) {

        this.props.inlineChangeValues(e)
    }
    saveInlineForm(id) {

        this.props.saveInlineForm(id)
    }

    render() {
        const { bodyData, bodyHeader, table, formType, editID, formData, formControls, focusIndex,
            handleDeleteItem, saveInlineForm, showInlineForm, removeInlineForm} = this.props;

        const gridHeader = bodyHeader.map((grid, index) => {

            return <th key={index} tooltip={grid.title}>{grid.title}</th>
        })


        const gridData = bodyData.map((data, index) =>
            <tr key={data.id} >
                <td style={{width: '30px'}} onClick={this.setRowEdit.bind(this, data.id, 0)}>
                    {index + 1}
                </td>
                {Object.keys(data).map((columnKey, columnIndex) => {
                    let cellformControl = [];

                    if(formControls.length >=1)
                    formControls.map((formControl)=>{
                        if(formControl.column == columnKey)
                            cellformControl.push(formControl)
                    })

                    if (columnKey !== 'id')
                        return <td key={columnKey} onClick={this.setRowEdit.bind(this, data.id, columnIndex)}>
                            {formType == 'inline' && editID == data.id ?
                                <Form formControls={cellformControl}
                                      formData={formData}
                                      formType={formType}
                                      formValue={data[columnKey]}
                                      focusIndex={focusIndex}
                                      gridIndex={columnIndex}

                                changeHandler={this.changeValues.bind(this)}
                                />
                                :
                                <span>
                                {data[columnKey]}
                                </span>
                            }

                        </td>
                })}
                <td style={{width: '90px'}} >
                    {formType == 'inline' ?
                        formType == 'inline' && editID == data.id
                        ? <span>
                                <button className="btn btn-sm btn-success" onClick={this.saveInlineForm.bind(this, data.id)}>
                                    <i className="fa fa-check"></i>
                                </button>
                                &nbsp;
                                &nbsp;
                                <button className="btn btn-sm btn-danger" onClick={this.setRowEdit.bind(this, 0, 0)}>
                                    <i className="fa fa-times"></i>
                                </button>
                            </span>
                    :
                        <span>
                                <button className="btn btn-sm" onClick={this.setRowEdit.bind(this, data.id, 0)}>
                                    <i className="fa fa-pencil"></i>
                                </button>
                            &nbsp;
                            &nbsp;
                            <button className="btn btn-sm" onClick={this.handleDeleteItem.bind(this, data.id)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </span>

                    :  <span>
                                <a className="btn btn-sm" href={`#edit/${data.id}`}>
                                    <i className="fa fa-pencil"></i>
                                </a>
                        &nbsp;
                        &nbsp;
                        <button className="btn btn-sm" onClick={this.handleDeleteItem.bind(this, data.id)}>
                            <i className="fa fa-trash"></i>
                        </button>
                        </span>


                    }

                </td>
            </tr>
        )
        const inlineAddForm = <tr  >
                <td style={{width: '30px'}}>

                </td>
                {formControls.map((column, columnIndex) => {
                    let cellFormControl = [];
                    cellFormControl.push(column)
                    if (column.column !== 'id')
                        return <td key={columnIndex} >

                                <Form formControls={cellFormControl}
                                      formData={formData}
                                      hideLabel="true"
                                      formValue={column.value}
                                      focusIndex={focusIndex}
                                      gridIndex={columnIndex}

                                      changeHandler={this.changeValues.bind(this)}
                                />


                        </td>
                })}
                <td style={{width: '90px'}} >

                            <span>
                                <button className="btn btn-sm btn-success" onClick={this.saveInlineForm.bind(this)}>
                                    <i className="fa fa-check"></i>
                                </button>
                            &nbsp;
                            &nbsp;
                            <button className="btn btn-sm btn-danger" onClick={removeInlineForm}>
                                <i className="fa fa-times"></i>
                            </button>
                            </span>




                </td>
            </tr>
        return (

                <div >
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <div>
                            <table className="table table-bordered table-striped solar-grid"
                                   selectable={table.selectable}
                                   multiSelectable={table.multiSelectable}
                                   onRowSelection={this._onRowSelection}>
                                <thead
                                    enableSelectAll={table.enableSelectAll}
                                    displaySelectAll={table.displaySelectAll}
                                    displayRowCheckbox={table.displayRowCheckbox}
                                    adjustForCheckbox={false}
                                >
                                <tr>
                                    <th tooltip='Number - Дугаар' style={{width: '25px'}}><b>№</b></th>
                                    {gridHeader}
                                    <th tooltip='Засах, Устгах - Edit, Delete'><i className="fa fa-ellipsis-h"></i></th>
                                </tr>
                                </thead>
                                <tbody>
                                { showInlineForm === true ? inlineAddForm : null}
                                { gridData }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

        )
    }
}
Body.defaultProps = {
    table: {
        fixedHeader: false,
        stripedRows: true,
        showRowHover: true,
        selectable: true,
        multiSelectable: false,
        enableSelectAll: false,
        deselectOnClickaway: true,
        displayRowCheckbox: false,
        displaySelectAll: false
    },
    formControls: []
};

Body.propTypes = {
    table: PropTypes.object.isRequired,
    bodyHeader: PropTypes.array.isRequired,
    bodyData: PropTypes.array.isRequired,
};