import React, { Component, PropTypes }  from "react"
import Form from "../form/page_add_edit/Form"
import $ from "jquery"


export default class Body extends Component {

    fixRowHeigth() {
        console.log('resizing')
        let aRowHeights = [];
        // Loop through the tables
        $("#gridBody").find("table").each(function (indx, table) {
            // Loop through the rows of current table
            $(table).find("tr").css("height", "").each(function (i, tr) {
                // If there is already a row height defined
                if (aRowHeights[i])
                // Replace value with height of current row if current row is higher.
                    aRowHeights[i] = Math.max(aRowHeights[i], $(tr).height());
                else
                // Else set it to the height of the current row
                    aRowHeights[i] = $(tr).height();
            });
        });
        // Loop through the tables in this "gridBody separately again
        $("#gridBody").find("table").each(function (i, table) {
            // Set the height of each row to the stored greatest height.
            $(table).find("tr").each(function (i, tr) {
                $(tr).css("height", aRowHeights[i]);
            });
        });

        let leftTableWidth = $("#tp-table-left > thead").width();

        /////////////// fixed table header

        $("#tp-table-left").css("width", leftTableWidth)

        $("#tp-table-wrapper").css('width', $("#tp-table-wrapper").parent().width() - 110 - leftTableWidth);
        $("#tp-table-wrapper0").css('width', $("#tp-table-wrapper").width());
        $(".wrapper1").css('width', $(".wrapper1").parent().width() - 110 - leftTableWidth);
        $(".wrapper1").css('margin-left', leftTableWidth);


        $("#tp-table-left0").css("width", leftTableWidth);
        $("#tp-table-left0 > thead > tr").empty();
        $("#tp-table-left > thead > tr").find("th").each(function (indx, td) {

            var copy = "<th style='width: " + $(td).width() + "px; height: " + $(td).height() + "px' class='sorting'>" + $(td).html() + "</th>";
            $("#tp-table-left0 > thead > tr").append(copy);

        });

        $("#tp-table0").css("width", $("#tp-table0").width());
        $("#tp-table0 > thead > tr").empty();
        $("#tp-table > thead > tr").find("th").each(function (indx, td) {


            var copy = "<th style='width: " + $(td).width() + "px; height: " + $(td).height() + "px' class='sorting'>" + $(td).html() + "</th>";
            $("#tp-table0 > thead > tr").append(copy);

        });

        $("#tp-table-rigth0").css("width", $("#tp-table-rigth").width());
        $("#tp-table-rigth0 > thead > tr").empty();
        $("#tp-table-rigth > thead > tr").find("th").each(function (indx, td) {

            var copy = "<th style='width: 82px; height: " + $(td).height() + "px' >" + $(td).html() + "</th>";
            $("#tp-table-rigth0 > thead > tr").append(copy);

        });
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
        $(".wrapper1").scroll(function () {
            $("#tp-table-wrapper")
                .scrollLeft($(".wrapper1").scrollLeft());
            $("#tp-table-wrapper0")
                .scrollLeft($(".wrapper1").scrollLeft());
        });

        document.querySelector("#table_header").parentElement.addEventListener("scroll", function () {
            document.querySelector("#table_header").style.transform = "translateY(" + this.scrollTop + "px)";
        });

    }

    componentWillMount() {

        window.addEventListener('resize', this.fixRowHeigth);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.fixRowHeigth);
    }



    saveInlineForm(id) {

        this.props.saveInlineForm(id)
    }

    componentDidUpdate() {

        this.fixRowHeigth()

    }

    fixedHeader() {
        $("#tp-table").thfloat();
        $("#tp-table-left").thfloat();
        $("#tp-table-rigth").thfloat();
    }

    componentWillUpdate(nextProps) {
        if (nextProps.bodyData.length >= 1) {
            //this.fixedHeader();
        }
    }

    render() {
        const { bodyData, bodyHeader, table, formType, editID, formData, formControls, focusIndex,
            handleDeleteItem, saveInlineForm, showInlineForm, removeInlineForm} = this.props;


        const gridHeader = bodyHeader.map((grid, index) => {

            if (grid.fixed && grid.fixed === true) {

            } else {
                return <th key={index} tooltip={grid.title} className="sorting">{grid.title}</th>
            }


        })

        const gridHeaderLeft = bodyHeader.map((grid, index) => {

            if (grid.fixed && grid.fixed === true) {
                return <th key={index} tooltip={grid.title} className="sorting">{grid.title} </th>
            }


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
            return <tr key={data.id}>
                <td onClick={this.setRowEdit.bind(this, data.id, 0)}>
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
                        return <td key={columnIndex} onClick={this.setRowEdit.bind(this, data.id, columnIndex)}>
                            {formType == 'inline' && editID == data.id ?
                                <Form formControls={cellformControl}
                                      formData={formData}
                                      formType={formType}
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
            <td >

            </td>
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

        const inlineAddForm = <tr  >

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

                        <span >test test</span>
                    </td>
            })}
        </tr>
        return (<div className="m-a-sm white with-3d-shadow">

            <div id="gridBody">

                <div id="table_header">
                    <table id="tp-table-left0" className="table table-striped table-hover ">
                        <thead>
                        <tr>
                        </tr>
                        </thead>

                    </table>
                    <div id="tp-table-wrapper0">
                        <table id="tp-table0" className="table table-striped table-hover " width="100%">
                            <thead>
                            <tr className="solar-grid-header">


                            </tr>
                            </thead>

                        </table>
                    </div>
                    <table id="tp-table-rigth0" className="table table-striped table-hover ">
                        <thead>
                        <tr>
                            <th className="solar-grid-actions"><i className="fa fa-ellipsis-h"></i></th>
                        </tr>
                        </thead>
                    </table>
                </div>

                <table id="tp-table-left" className="table table-striped table-hover ">
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
                <div id="tp-table-wrapper">
                    <table id="tp-table" className="table table-striped table-hover " width="100%">
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
                <table id="tp-table-rigth" className="table table-striped table-hover ">
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
            <div className="wrapper1">
                <div className="div1">
                </div>
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


