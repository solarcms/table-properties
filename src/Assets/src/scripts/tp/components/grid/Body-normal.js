import React, { Component, PropTypes }  from "react"
import Form from "../form/page_add_edit/Form"
import $ from "jquery"
import floatThead from "floatthead"




export default class Body extends Component {

    setRowEdit(editID, focusIndex) {
        if (this.props.formType == 'inline')
            this.props.setRowEdit(editID, focusIndex)
    }

    handleDeleteItem(id) {

        if (!confirm('Delete this record?')) {
            return;
        }
        else
            this.props.handleDeleteItem(id)


    }

    callWindowEdit(id) {
        this.props.callWindowEdit(id)
    }

    changeValues(e) {

        this.props.inlineChangeValues(e)
    }

    componentDidMount() {

    }

    componentWillUnmount() {


    }


    saveInlineForm(id) {

        this.props.saveInlineForm(id)
    }

    componentWillUpdate(nextProps){
        if(nextProps.bodyData.length >= 1) {


            $("#tp-table").floatThead( );

        }
    }

    render() {
        const { bodyData, bodyHeader, table, formType, editID, formData, formControls, focusIndex,
            handleDeleteItem, saveInlineForm, showInlineForm, removeInlineForm} = this.props;



        const gridHeader = bodyHeader.map((grid, index) => {

            return <th key={index} tooltip={grid.title} className="sorting">{grid.title}</th>
        })


        const gridData = bodyData.map((data, index) =>
            <tr key={data.id}>
                <td style={{width: '30px', textAlign: 'center'}} onClick={this.setRowEdit.bind(this, data.id, 0)}>
                    {index + 1}
                </td>


                {Object.keys(data).map((columnKey, columnIndex) => {
                    let cellformControl = [];


                    if (formControls.length >= 1)
                        formControls.map((formControl)=> {
                            if (formControl.column == columnKey)
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
                <td style={{width: '87px', padding: '3px'}}>

                    {formType == 'inline' ?
                        editID == data.id ?
                            <span>
                    <a className="btn btn-sm btn-success"
                       onClick={this.saveInlineForm.bind(this, data.id)}>
                        <i className="fa fa-check"></i>
                    </a>
                                &nbsp;
                                <a className="btn btn-sm btn-danger" onClick={this.setRowEdit.bind(this, 0, 0)}>
                                    <i className="fa fa-times"></i>
                                </a>
                    </span>

                            :
                            <span>
                    <a className="btn btn-sm" onClick={this.setRowEdit.bind(this, data.id, 0)}>
                        <i className="fa fa-pencil"></i>
                    </a>
                                &nbsp;
                                <a className="btn btn-sm" onClick={this.handleDeleteItem.bind(this, data.id)}>
                                    <i className="fa fa-trash"></i>
                                </a>
                    </span>
                        : formType == 'window' ?
                        <span>
                    <a className="btn btn-sm" href="javascript:void(0)"
                       onClick={this.callWindowEdit.bind(this, data.id)}>
                        <i className="fa fa-pencil"></i>
                    </a>
                            &nbsp;
                            <a className="btn btn-sm" onClick={this.handleDeleteItem.bind(this, data.id)}>
                                <i className="fa fa-trash"></i>
                            </a>
                    </span>
                        :
                        <span>
                    <a className="btn btn-sm" href={`#edit/${data.id}`}>
                        <i className="fa fa-pencil"></i>
                    </a>
                            &nbsp;
                            <a className="btn btn-sm" onClick={this.handleDeleteItem.bind(this, data.id)}>
                                <i className="fa fa-trash"></i>
                            </a>
                    </span>}
                </td>
            </tr>
        )
        const TextCell = ({rowIndex, data, col, ...props}) => (
            <Cell {...props}>
                {data.getObjectAt(rowIndex)[col]}
            </Cell>
        );

        const inlineAddForm = <tr  >
            <td style={{width: '30px'}}>

            </td>
            {formControls.map((column, columnIndex) => {
                let cellFormControl = [];
                cellFormControl.push(column)
                if (column.column !== 'id')
                    return <td key={columnIndex}>

                        <Form formControls={cellFormControl}
                              formData={formData}
                              formType={formType}
                              formValue={column.value}
                              focusIndex={focusIndex}
                              gridIndex={columnIndex}

                              changeHandler={this.changeValues.bind(this)}
                        />


                    </td>
            })}
            <td style={{width: '87px', padding: '3px'}}>

                            <span>
                                <a className="btn btn-sm btn-success" onClick={this.saveInlineForm.bind(this)}>
                                    <i className="fa fa-check"></i>
                                </a>
                                &nbsp;

                                <a className="btn btn-sm btn-danger" onClick={removeInlineForm}>
                                    <i className="fa fa-times"></i>
                                </a>
                            </span>


            </td>
        </tr>
        return (<div id="gridBody" className="m-a-sm ">
            <div className="white with-3d-shadow">



                <table id="tp-table" className="table table-bordered table-striped table-hover " width="100%">
                    <thead>
                    <tr>
                        <th style={{width: '25px'}}><b>№</b></th>
                        {gridHeader}
                        <th style={{textAlign: 'center'}}><i className="fa fa-ellipsis-h"></i></th>
                    </tr>
                    </thead>
                    <tbody>
                    { showInlineForm === true ? inlineAddForm : null}
                    { gridData }

                    </tbody>
                </table>


            </div>
        </div>)
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


