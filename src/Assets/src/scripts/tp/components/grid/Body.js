import React, { Component, PropTypes }  from "react"
import Form from "../form/page_add_edit/Form"
import $ from "jquery"

import {fixRowHeigth} from './fixed/HeaderColumn'


export default class Body extends Component {


    resizeHandler(){

        setTimeout(
            () => { fixRowHeigth(this.props.gridId) },
            100
        );


    }

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

        const {gridId } = this.props

        $(".virtual_scroll").scroll(function () {
            $("#"+gridId+"-wrapper")
                .scrollLeft($(".virtual_scroll").scrollLeft());
            $("#"+gridId+"-wrapper0")
                .scrollLeft($(".virtual_scroll").scrollLeft());
        });

        document.querySelector("#"+gridId+"-header").parentElement.addEventListener("scroll", function () {
            document.querySelector("#"+gridId+"-header").style.transform = "translateY(" + this.scrollTop + "px)";
        });

        fixRowHeigth(this.props.gridId)



    }

    componentWillMount() {
        window.addEventListener('resize', this.resizeHandler.bind(this));
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler);
    }

    saveInlineForm(id) {

        this.props.saveInlineForm(id)
    }

    componentDidUpdate() {
        fixRowHeigth(this.props.gridId)

    }

    selectRow(row){
        this.props.selectRow(row)
    }


    render() {
        const { bodyData, bodyHeader, formType, editID, formData, formControls, focusIndex,
            handleDeleteItem, saveInlineForm, showInlineForm, removeInlineForm, gridId} = this.props;

        let comboGridSelection = false;

        if (gridId.indexOf("combo-grid-") !=-1) {
            comboGridSelection = true;
        }

        const gridHeader = bodyHeader.map((grid, index) => {

            if (grid.fixed && grid.fixed === true) {

            } else
                return <th key={index} tooltip={grid.title} className="sorting">{grid.title}</th>

        })

        const gridHeaderLeft = bodyHeader.map((grid, index) => {

            if (grid.fixed && grid.fixed === true)
                return <th key={index} tooltip={grid.title} className="sorting">{grid.title} </th>
        })

        const gridFixedLeft = bodyData.map((data, index) => {
            let fixedColumns = bodyHeader.map((grid, columnIndex) => {

                let cellformControl = [];


                if (formControls.length >= 1)
                    formControls.map((formControl)=> {
                        if (formControl.column == grid.column)
                            cellformControl.push(formControl)
                    })

                if (grid.fixed && grid.fixed === true) {

                    return <td key={columnIndex} onClick={this.setRowEdit.bind(this, data.id, columnIndex)}>
                        {formType == 'inline' && editID == data.id ?
                            <Form formControls={cellformControl}
                                  formData={formData}
                                  formType={formType}
                                  gridId={gridId}
                                  formValue={data[grid.column]}
                                  focusIndex={focusIndex}
                                  gridIndex={columnIndex}

                                  changeHandler={this.changeValues.bind(this)}
                            />
                            :
                            <span>
                                        {data[grid.column]}
                                        </span>
                        }

                    </td>
                }


            })
            const rowClickAction =  comboGridSelection === true ? this.selectRow.bind(this, data) : this.setRowEdit.bind(this, data.id, 0)
            return <tr key={data.id}>

                    <td onClick={rowClickAction}>
                        {index + 1}
                    </td>

                {fixedColumns}
            </tr>
        })

        const gridFixedRight = bodyData.map((data, index) =>
            <tr key={data.id}>
                <td >

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

        const gridData = bodyData.map((data, index) =>
            <tr key={data.id}>

                {bodyHeader.map((grid, columnIndex) => {
                    let cellformControl = [];


                    if (formControls.length >= 1)
                        formControls.map((formControl)=> {
                            if (formControl.column == grid.column)
                                cellformControl.push(formControl)
                        })

                    if (grid.fixed && grid.fixed === true) {

                    } else {
                        const rowClickAction =  comboGridSelection === true ? this.selectRow.bind(this, data) : this.setRowEdit.bind(this, data.id, columnIndex)
                        return <td key={columnIndex} onClick={rowClickAction}>
                            {formType == 'inline' && editID == data.id ?
                                <Form formControls={cellformControl}
                                      formData={formData}
                                      formType={formType}
                                      gridId={gridId}
                                      formValue={data[grid.column]}
                                      focusIndex={focusIndex}
                                      gridIndex={columnIndex}

                                      changeHandler={this.changeValues.bind(this)}
                                />
                                :
                                <span>
                                        {data[grid.column]}
                                        </span>
                            }

                        </td>
                    }


                })}

            </tr>
        )

        const inlineAddFormLeft = <tr>
            <th></th>
            {bodyHeader.map((grid, columnIndex) => {
                let cellformControl = [];


                if (formControls.length >= 1)
                    formControls.map((formControl)=> {
                        if (formControl.column == grid.column)
                            cellformControl.push(formControl)
                    })

                if (grid.fixed && grid.fixed === true) {


                    return <td key={columnIndex} >

                        <Form formControls={cellformControl}
                              formData={formData}
                              formType={formType}
                              gridId={gridId}
                              formValue={formControls[columnIndex].value}
                              focusIndex={focusIndex}
                              gridIndex={columnIndex}

                              changeHandler={this.changeValues.bind(this)}
                        />


                    </td>
                }


            })}
        </tr>


        const inlineAddForm = <tr  >

            {bodyHeader.map((grid, columnIndex) => {
                let cellformControl = [];


                if (formControls.length >= 1)
                    formControls.map((formControl)=> {
                        if (formControl.column == grid.column)
                            cellformControl.push(formControl)
                    })

                if (grid.fixed && grid.fixed === true) {

                } else {

                    if(formControls[columnIndex])
                    return <td key={columnIndex} >

                            <Form formControls={cellformControl}
                                  formData={formData}
                                  formType={formType}
                                  gridId={gridId}
                                  formValue={formControls[columnIndex].value}
                                  focusIndex={focusIndex}
                                  gridIndex={columnIndex}

                                  changeHandler={this.changeValues.bind(this)}
                            />


                    </td>
                }


            })}

        </tr>
        const inlineAddFormRight = <tr  >
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
        return (<div className="m-a-sm white with-3d-shadow">

            <div id="gridBody">

                <div id={`${gridId}-header`} className="table_header">
                    <table id={`${gridId}-left0`} className="table table-striped table-bordered table-hover tp-table-left0">
                        <thead>
                        <tr>
                        </tr>
                        </thead>

                    </table>
                    <div id={`${gridId}-wrapper0`} className="tp-table-wrapper0">
                        <table id={`${gridId}0`} className="table table-striped table-bordered table-hover tp-table0" width="100%">
                            <thead>
                            <tr className="solar-grid-header">


                            </tr>
                            </thead>

                        </table>
                    </div>
                    <table id={`${gridId}-rigth0`} className="table table-striped table-bordered table-hover tp-table-rigth0">
                        <thead>
                        <tr>
                            <th className="solar-grid-actions"><i className="fa fa-ellipsis-h"></i></th>
                        </tr>
                        </thead>
                    </table>
                </div>

                <table id={`${gridId}-left`} className="table table-striped table-bordered table-hover tp-table-left">
                    <thead>
                    <tr>
                        <th className="solar-grid-index sorting"><b>№</b></th>
                        {gridHeaderLeft}
                    </tr>
                    </thead>
                    <tbody>
                    { showInlineForm === true ? inlineAddFormLeft : null}
                    { gridFixedLeft }

                    </tbody>
                </table>
                <div id={`${gridId}-wrapper`} className="tp-table-wrapper">
                    <table id={`${gridId}`} className="table table-striped table-bordered table-hover tp-table" width="100%">
                        <thead>
                        <tr className="solar-grid-header">

                            {gridHeader}

                        </tr>
                        </thead>
                        <tbody>
                        { showInlineForm === true ? inlineAddForm : null}
                        { gridData }

                        </tbody>
                    </table>
                </div>
                <table id={`${gridId}-rigth`} className="table table-striped table-bordered table-hover tp-table-rigth">
                    <thead>
                    <tr>
                        <th className="solar-grid-actions"><i className="fa fa-ellipsis-h"></i></th>
                    </tr>
                    </thead>
                    <tbody>
                    { showInlineForm === true ? inlineAddFormRight : null}
                    { gridFixedRight }

                    </tbody>
                </table>


            </div>
            <div className="virtual_scroll">
                <div className="virtual_table">
                </div>
            </div>
        </div>)
    }
}
Body.defaultProps = {
    formControls: []
};

Body.propTypes = {
    bodyHeader: PropTypes.array.isRequired,
    bodyData: PropTypes.array.isRequired,
};


