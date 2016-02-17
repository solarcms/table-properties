import React, { Component, PropTypes }  from "react"
import Form from "../form/Form"
import $ from "jquery"


import Immutable from 'immutable';


export default class Body extends Component {


    resizeHandler() {


        setTimeout(
            () => {
                fixRowHeigth(this.props.gridId)
            },
           50
        );


    }

    setRowEdit(editID, focusIndex) {
        if (this.props.formType == 'inline')
            this.props.setRowEdit(editID, focusIndex)
    }

    handleDeleteItem(id) {
        if(this.props.permission.d == true){
            if (!confirm('Delete this record?')) {
                return;
            }
            else
                this.props.handleDeleteItem(id)
        }



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
            $(".tp-table-wrapper")
                .scrollLeft($(".virtual_scroll").scrollLeft());

        });

        //document.querySelector("#" + gridId + "-header").parentElement.addEventListener("scroll", function () {
        //    document.querySelector("#" + gridId + "-header").style.transform = "translateY(" + this.scrollTop + "px)";
        //});



        fixRowHeigth(this.props.gridId)
        //this.resizeHandler()



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

    selectRow(row) {
        this.props.selectRow(row)
    }


    render() {
        const {
            bodyData,
            bodyHeader,
            formType,
            editID,
            formData,
            formControls,
            focusIndex,
            handleDeleteItem,
            saveInlineForm,
            showInlineForm,
            removeInlineForm,
            gridId,
            permission,
            ifUpdateDisabledCanEditColumns,
            defaultLocale
            } = this.props;





        let comboGridSelection = false;

        if (gridId.indexOf("combo-grid-") != -1) {
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


                if (formControls.size >= 1)
                    formControls.map((formControl)=> {
                        if (formControl.column == grid.column)
                            cellformControl.push(formControl)
                    })

                if (grid.fixed && grid.fixed === true && grid) {

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
            const rowClickAction = comboGridSelection === true ? this.selectRow.bind(this, data) : this.setRowEdit.bind(this, data.id, 0)
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
                                {permission.u == true || ifUpdateDisabledCanEditColumns.length >=1 ?
                                <a className="btn btn-sm btn-success"
                                   onClick={this.saveInlineForm.bind(this, data.id)}>
                                    <i className="material-icons">&#xE2C3;</i>
                                </a> : null }
                                &nbsp;
                                {permission.d == true ?
                                <a className="btn btn-sm btn-danger" onClick={this.setRowEdit.bind(this, 0, 0)}>
                                    <i className="material-icons">&#xE5CD;</i>
                                </a>
                                    : null}
                    </span>

                            :
                            <span>
                                {permission.u == true || ifUpdateDisabledCanEditColumns.length >=1 ?
                                <a className="btn btn-sm" onClick={this.setRowEdit.bind(this, data.id, 0)}>
                                    <i className="material-icons">&#xE254;</i>
                                </a> : null }
                                &nbsp;
                                {permission.d == true ?
                                <a className="btn btn-sm" onClick={this.handleDeleteItem.bind(this, data.id)}>
                                    <i className="material-icons">&#xE872;</i>
                                </a>
                                    : null }
                    </span>
                        : formType == 'window' ?
                        <span>
                           {permission.u == true || ifUpdateDisabledCanEditColumns.length >=1 ?
                            <a className="btn btn-sm" href="javascript:void(0)"
                               onClick={this.callWindowEdit.bind(this, data.id)}>
                                <i className="material-icons">&#xE254;</i>
                            </a> : null }
                            &nbsp;
                            {permission.d == true ?
                            <a className="btn btn-sm" onClick={this.handleDeleteItem.bind(this, data.id)}>
                                <i className="material-icons">&#xE872;</i>
                            </a>
                                : null }
                    </span>
                        :
                        <span>
                            {permission.u == true || ifUpdateDisabledCanEditColumns.length >=1 ?
                            <a className="btn btn-sm" href={`#edit/${data.id}`}>
                                <i className="material-icons">&#xE254;</i>
                            </a> : null } &nbsp;
                            {permission.d == true ?
                                <a className="btn btn-sm" onClick={this.handleDeleteItem.bind(this, data.id)}>

                                    <i className="material-icons">&#xE872;</i>

                                </a> : null }
                    </span>}
                </td>
            </tr>
        )

        const gridData = bodyData.map((data, index) =>
            <tr key={index}>

                {bodyHeader.map((grid, columnIndex) => {
                    let cellformControl = [];


                    if (formControls.size >= 1)
                        formControls.map((formControl)=> {
                            if (formControl.get('column') == grid.column)
                                cellformControl.push(formControl)
                        })

                    if (grid.fixed && grid.fixed === true) {

                    } else {
                        const rowClickAction = comboGridSelection === true ? this.selectRow.bind(this, data) : this.setRowEdit.bind(this, data.id, columnIndex)
                        if(grid.type !== '--internal-link'){
                            let show_value = null;


                            if(grid.translate && grid.translate === true){
                                let json_translations =  JSON.parse(data[grid.column]);
                                json_translations.map(json_translation =>{
                                    if(json_translation.locale == defaultLocale)
                                        show_value = json_translation.value
                                })

                            } else
                                show_value =data[grid.column];

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
                                        {grid.change_value ?
                                            data[grid.column] == '1'
                                            ? grid.change_value[0]
                                                :

                                                grid.change_value[1]

                                        : show_value
                                        }

                                            </span>
                                }

                            </td>
                        } else {
                            return <td key={columnIndex} onClick={rowClickAction}>

                                    <a href={`${grid.link}${data[grid.column]}`} target="_blank">

                                        <span dangerouslySetInnerHTML={{__html: grid.icon}} />

                                        </a>


                            </td>
                        }

                    }


                })}

            </tr>
        )

        const inlineAddFormLeft = formType == 'inline' ? <tr>
            <th></th>
            {bodyHeader.map((grid, columnIndex) => {
                let cellformControl = [];


                if (formControls.size >= 1)
                    formControls.map((formControl)=> {
                        if (formControl.column == grid.column)
                            cellformControl.push(formControl)
                    })

                if (grid.fixed && grid.fixed === true) {


                    return <td key={columnIndex}>

                        <Form formControls={cellformControl}
                              formData={formData}
                              formType={formType}
                              gridId={gridId}
                              formValue={formControls.getIn([columnIndex, 'value'])}
                              focusIndex={focusIndex}
                              gridIndex={columnIndex}
                              permission={permission}

                              changeHandler={this.changeValues.bind(this)}
                        />


                    </td>
                }


            })}
        </tr> : null


        const inlineAddForm = formType == 'inline' ? <tr  >

            {bodyHeader.map((grid, columnIndex) => {
                let cellformControl = [];


                if (formControls.size >= 1)
                    formControls.map((formControl)=> {
                        if (formControl.get('column') == grid.column)
                            cellformControl.push(formControl)
                    })

                if (grid.fixed && grid.fixed === true) {

                } else {

                    if (formControls.getIn([columnIndex])){

                        const cellformControls = Immutable.fromJS(cellformControl);
                        return <td key={columnIndex} className="inline_form_td">

                            <Form formControls={cellformControls}
                                  formData={formData}
                                  formType={formType}
                                  gridId={gridId}
                                  formValue={formControls.getIn([columnIndex, 'value'])}
                                  focusIndex={focusIndex}
                                  gridIndex={columnIndex}
                                  permission={permission}

                                  changeHandler={this.changeValues.bind(this)}
                            />


                        </td>
                    }

                }


            })}

        </tr> : null
        const inlineAddFormRight = formType == 'inline' ? <tr  >
            <td style={{width: '87px'}}>

                            <span>
                                <a className="btn btn-sm btn-success" onClick={this.saveInlineForm.bind(this)}>
                                    <i className="material-icons">&#xE2C3;</i>
                                </a>
                                &nbsp;

                                <a className="btn btn-sm btn-danger" onClick={removeInlineForm}>
                                    <i className="material-icons">&#xE5CD;</i>
                                </a>
                            </span>
            </td>
        </tr> : null
        return (<div className="white">

            <div id="fixed_header" className="">

            </div>

            <div id="gridBody" className="handsontable">



                <table id={`${gridId}-left`} className="tp-table-left">
                    <thead>
                    <tr>
                        <th className="solar-grid-index"><b>№</b></th>
                        {gridHeaderLeft}
                    </tr>
                    </thead>
                    <tbody>
                    { showInlineForm === true && this.props.permission.c === true ? inlineAddFormLeft : null}
                    { gridFixedLeft }

                    </tbody>
                </table>
                <div id={`${gridId}-wrapper`} className="tp-table-wrapper">
                    <table id={`${gridId}`} className="tp-table"
                           width="100%">
                        <thead>
                        <tr className="solar-grid-header">

                            {gridHeader}

                        </tr>
                        </thead>
                        <tbody>
                        { showInlineForm === true && this.props.permission.c === true ? inlineAddForm : null}
                        { gridData }

                        </tbody>
                    </table>
                </div>
                <table id={`${gridId}-rigth`} className="tp-table-rigth">
                    <thead>
                    <tr>
                        <th className="solar-grid-actions"><i className="material-icons">&#xE5D3;</i></th>
                    </tr>
                    </thead>
                    <tbody>
                    { showInlineForm === true && this.props.permission.c === true ? inlineAddFormRight : null}
                    { gridFixedRight }

                    </tbody>
                </table>


            </div>
            <div className="virtual_scroll">
                <div className="virtual_table" id="virtual_table">
                </div>
            </div>
        </div>)
    }
}
Body.defaultProps = {

};

Body.propTypes = {
    bodyHeader: PropTypes.array.isRequired,
    bodyData: PropTypes.array.isRequired,
};


