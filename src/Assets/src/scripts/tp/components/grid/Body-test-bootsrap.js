import React, { Component, PropTypes }  from "react"
import Form from "../form/page_add_edit/Form"
import $ from "jquery"
import floatThead from "floatthead"

import {priceFormatter, nameFormatter, runningFormatter} from "./bootsrap-table/formater"



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

        $("#tp-table").bootstrapTable('destroy');
    }


    saveInlineForm(id) {

        this.props.saveInlineForm(id)
    }

    componentWillUpdate(nextProps){

        if(nextProps.bodyData.length >= 1) {

            $("#tp-table").bootstrapTable('destroy');

            $('#tp-table').bootstrapTable({
                'data':nextProps.bodyData
            });
            $("#tp-table").bootstrapTable('hideLoading');

        }
    }

    runningFormatter(component, index) {
        console.log(component.props)
        return "<b>"+index+"</b>"
    }


    render() {
        const { bodyData, bodyHeader, table, formType, editID, formData, formControls, focusIndex,
            handleDeleteItem, saveInlineForm, showInlineForm, removeInlineForm} = this.props;

        const gridColumns = bodyHeader.map((grid, index) => {



            if(grid.type == '--text')
                return <th key={index} data-field={grid.column} >{grid.title}</th>
            else if(grid.type == '--checkbox')
                return <th key={index} data-field={grid.column} data-formatter="nameFormatter">{grid.title}</th>





        })


        return (<div id="gridBody" className="m-a-sm ">
            <div className="white with-3d-shadow">


                <table id="tp-table" className="table table-bordered table-striped table-hover "
                       data-show-columns="true"
                       data-height={this.props.gridHeight}
                       data-show-export="true"
                >
                    <thead>
                    <tr>
                        <th data-formatter={this.runningFormatter(this, '1')}>Index</th>
                        <th data-field="active">Active</th>
                        <th data-field="name">Name</th>
                    </tr>
                    </thead>

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


