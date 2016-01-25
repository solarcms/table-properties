import React, { Component, PropTypes }  from 'react';
import Body from '../../grid/Body'
import Pagination from "../../grid/Paginator"
import $ from "jquery"
import { getComboList, deleteItemComboGrid, saveComboGrid, updateComboGrid, editComboGrid } from "../../../api/"
import * as DataActions from "../../../actions/grid"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import Header from "../../../components/grid/Header"
import validation from "../../../components/form/validation/"

import {fixRowHeigth} from '../../grid/fixed/HeaderColumn'


export default class ComboGrid extends Component {
    selectRow(row){
        if(row.id !== this.props.editID)
        this.props.comboGridSelected(row[this.props.valueField], row[this.props.textField], this.props.column)
    }
    callPageDatas(page, searchValue) {
        getComboList(page, {
            column: this.props.column,
            searchValue: searchValue
        }).then((data)=> {
            this.props.actions.changeFormData(this.props.column, data);
        });
    }
    hangePageLimitChange(e) {
        this.props.actions.setPageLimit(e.target.value*1)
        this.props.actions.setCurrentPage(1)
        this.callPageDatas(1, e.target.value, this.props.searchValue)
    }
    handlePageChange(pageNumber) {
        this.props.actions.setCurrentPageComboGrid(pageNumber)

        this.callPageDatas(pageNumber, this.props.searchValue)
    }
    handleOpen(){
        fixRowHeigth('combo-grid-'+this.props.column);
    }

    handleSearch() {
        let sword = this.refs.searchComboGrid.refs.searchWord.value

        this.callPageDatas(1, sword)
    }
    handleDeleteItem(id) {
        deleteItemComboGrid(this.props.column, id).then((data)=> {
            if(data == 'success')
                this.callPageDatas(this.props.currentPage, this.props.searchValue)
            else
                alert("Please try agian")
        });
    }
    /*
     * Grid Inline from starting
     * */
    addInlineForm(){
        this.props.actions.setInlineFrom(true);
    }
    setRowEdit(editId, focusIndex){

        const FC = this.props.formControls;

        if(FC.length >= 1)
            this.props.actions.clearComboGridFormValidation(this.props.column);

        if(editId === this.props.editID)
            return false;

        this.props.actions.setRowEdit(editId, focusIndex)
        if(editId >=1)
            editComboGrid(this.props.column, editId).then((data)=> {
                if(data.length >= 1)
                    this.props.formControls.map((formControl, index)=>{

                        this.props.actions.comboGridChageValue(this.props.column, index, data[0][formControl.column])
                    })
                else
                    alert('please try agian')


            });



    }
    removeInlineForm(){
        this.props.actions.setInlineFrom(false);
    }
    saveForm(id){

        const FD = this.props.formControls;



        let foundError = false;

        FD.map((fromColumn, index) => {

            const error = (validation(fromColumn.value, fromColumn.validate));

            if(error){
                this.props.actions.comboGridSetError(this.props.column, index, error);
                foundError = true;
            }

        })
        if(foundError === false)
            if(isNaN(id) === false && id != 0){

                updateComboGrid(this.props.column, FD, id).done((data)=>{

                    if(data == 'success' || 'none'){
                        this.props.actions.clearComboGridFormValidation(this.props.column);
                        this.callPageDatas(this.props.currentPage, this.props.searchValue)


                        this.setRowEdit(0, 0);

                    }

                }).fail(()=>{
                    alert("Уучлаарай алдаа гарлаа дахин оролдоно уу")
                })
            } else {

                saveComboGrid(this.props.column, FD).done((data)=>{

                    if(data == 'success'){
                        this.props.actions.clearComboGridFormValidation(this.props.column);
                        this.callPageDatas(1, '')


                            this.removeInlineForm();


                    }

                }).fail(()=>{
                    alert("Уучлаарай алдаа гарлаа дахин оролдоно уу")
                })
            }

    }
    ChangeValues(e){

        const index = e.target.name.replace("combo-grid-"+this.props.column+"-solar-input", "");
        let value = null

        if(e.target.type == 'checkbox'){
            if(e.target.checked === true)
                value = 1;
            else
                value = 0;

        } else{
            value = e.target.value;
        }

        const FD = this.props.formControls;




        this.props.actions.comboGridChageValue(this.props.column, index, value)



        // check validation with on change
        const error = (validation(value, FD[index].validate));
        this.props.actions.comboGridSetError(this.props.column, index, error);

        if(e.target.type == 'text' || e.target.type == 'textarea'){
            var valueLenght=e.target.value.length;
            e.target.setSelectionRange(valueLenght,valueLenght);
        }



    }

    /*
     * Grid Inline from ending
     * */

    componentDidMount(){
        this.props.actions.clearComboGridFormValidation(this.props.column);
    }
    render() {
        const { listData, gridHeader, currentPage, totalPages, totalItems, pageLimit, column, pageName, showInlineForm, formControls, editID, text} = this.props;
        const gridId = 'combo-grid-'+column



        return (
            <div className="dropdown combo-grid " id={`combo-grid-${column}`}>
                <a className="dropdown-toggle realLarge" data-toggle="dropdown" href  onClick={this.handleOpen.bind(this)}  >
                    {text === null ? <span>Сонгох</span> : <span>{text}</span>}
                <b><i className="material-icons">&#xE5C5;</i></b>
                </a>
                <div className="dropdown-menu  grid-menu" >
                    <form>
                        <div >
                            <Header pageName={pageName} icon="fa fa-plus"
                                    link="#/add"
                                    type="comboGrid"
                                    formType={`inline`}
                                    addInlineForm={this.addInlineForm.bind(this)}
                                    ref="searchComboGrid"
                                    handlerSearch={this.handleSearch.bind(this)}
                                    handlerReload={this.callPageDatas.bind(this, this.props.currentPage, this.props.searchValue)}

                            />
                            <Body
                                bodyData={listData}
                                bodyHeader={gridHeader}
                                formControls={formControls}
                                gridId={gridId}
                                formType={`inline`}
                                setRowEdit={this.setRowEdit.bind(this)}
                                handleDeleteItem={this.handleDeleteItem.bind(this)}

                                editID={editID}
                                selectRow={this.selectRow.bind(this)}
                                showInlineForm={showInlineForm}
                                inlineChangeValues={this.ChangeValues.bind(this)}

                                saveInlineForm={this.saveForm.bind(this)}
                            />


                        </div>
                        <div>

                                <Pagination
                                    totalItems={totalItems}
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    pageLimit={pageLimit}
                                    handler={this.hangePageLimitChange.bind(this)}
                                    handlerPage={this.handlePageChange.bind(this)}
                                    paginationMarg="m-r-sm m-l-sm paginationBottom"
                                />

                        </div>
                    </form>

                </div>
            </div>
        )
    }
}
ComboGrid.defaultProps = {
    pageLimit: 20,
    searchValue: '',


}
function mapStateToProps(state) {

    const TpStore = state.TpStore;

    return {

        currentPage: TpStore.getIn(['comboGrid', 'currentPage']),
        showInlineForm: TpStore.get('showInlineForm'),
        editID: TpStore.get('editID'),


    }
}

function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(DataActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ComboGrid)
