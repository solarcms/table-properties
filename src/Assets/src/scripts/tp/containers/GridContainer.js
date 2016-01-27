import React, { Component, PropTypes } from "react"
import $ from "jquery"


//import {modal} from 'bootstrap'
import * as DataActions from "../actions/grid"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import { getList, setupPage, deleteItem, save, update, edit } from "../api/"
import Header from "../components/grid/Header"
import Body from "../components/grid/Body"
import Pagination from "../components/grid/Paginator"
import validation from "../components/form/validation/"
import Window from "../components/window/"

class GridContainer extends Component {
    //export
    exportPDF(){
        $('#tp-table').tableExport({type:'csv'});
    }
    exportEXCEL(){
        //$('#tp-table').tableExport({type:'pdf'});
        //$('#tp-table').tableExport({type:'json'});
        $('#grid_table').tableExport({type:'csv'});
        //$('#tp-table').tableExport({type:'sql'});
    }
    selectRow(row){
        return false;
    }
    //export
    /*
     * Grid main actions starting
     * */
    callPageDatas(page, pageLimit, searchValue) {
        this.props.actions.setShowGrid(false);
        getList(page, {
            pageLimit: pageLimit,
            searchValue: searchValue
        }).then((data)=> {
            this.props.actions.receiveListData(data);
            this.props.actions.setShowGrid(true);
        });
    }
    hangePageLimitChange(e) {
        this.props.actions.setPageLimit(e.target.value*1)
        this.props.actions.setCurrentPage(1)
        this.callPageDatas(1, e.target.value, this.props.searchValue)
    }
    handlePageChange(pageNumber) {
        this.props.actions.setCurrentPage(pageNumber)

        this.callPageDatas(pageNumber, this.props.pageLimit, this.props.searchValue)
    }
    handleSearch() {
        let sword = this.refs.search.refs.searchWord.value
        this.props.actions.setSearch(sword)
        this.callPageDatas(1, this.props.pageLimit, sword)
    }
    handleDeleteItem(id) {
        deleteItem(id).then((data)=> {
            if(data == 'success')
                this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
            else
                alert("Please try agian")
        });
    }
    /*
     * Grid main actions starting
     * */

    /*
    * Grid Inline from starting
    * */
    addInlineForm(){
        this.props.actions.setInlineFrom(true);
    }
    setRowEdit(editId, focusIndex){

        const FC = this.props.formControls;

        if(FC.length >= 1)
            this.props.actions.clearFromValidation();

        if(editId === this.props.editID)
            return false;

        this.props.actions.setRowEdit(editId, focusIndex)
        if(editId >=1)
            edit(editId).then((data)=> {
                if(data.length >= 1)
                    this.props.formControls.map((formControl, index)=>{

                        this.props.actions.chagenValue(index, data[0][formControl.column])
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
                this.props.actions.setError(index, error);
                foundError = true;
            }
        })
        if(foundError === false)
            if(isNaN(id) === false && id != 0){

                update(FD, id).done((data)=>{

                    if(data == 'success' || 'none'){
                        this.props.actions.clearFromValidation();
                        this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)

                        if(this.props.formType == 'inline')
                            this.setRowEdit(0, 0);
                        else if(this.props.formType == 'window')
                            this.hideModal();
                    }

                }).fail(()=>{
                    alert("Уучлаарай алдаа гарлаа дахин оролдоно уу")
                })
            } else {

                save(FD).done((data)=>{

                    if(data == 'success'){
                        this.props.actions.clearFromValidation();
                        this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)

                        if(this.props.formType == 'inline')
                            this.removeInlineForm();
                        else if(this.props.formType == 'window')
                            this.hideModal();
                    }

                }).fail(()=>{
                    alert("Уучлаарай алдаа гарлаа дахин оролдоно уу")
                })
            }

    }
    ChangeValues(e){

        const index = e.target.name.replace("grid_table-solar-input", "");


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


        this.props.actions.chagenValue(index, value)



        // check validation with on change
        const error = (validation(value, FD[index].validate));
        this.props.actions.setError(index, error);

        if(e.target.type == 'text' || e.target.type == 'textarea'){
            var valueLenght=e.target.value.length;
            e.target.setSelectionRange(valueLenght,valueLenght);
        }



    }

    /*
     * Grid Inline from ending
     * */

    /*
    * Window form
    * */
    callWindowEdit(id){
        this.props.actions.setRowEdit(id, 0)
        edit(id).then((data)=> {
            if(data.length >= 1)
                this.props.formControls.map((formControl, index)=>{
                    this.props.actions.chagenValue(index, data[0][formControl.column])
                })
            else
                alert('please try agian')
        });


        $('#windowForm').modal({'backdrop': false}, 'show');
    }
    showModal(){
        $('#windowForm').modal({'backdrop': false}, 'show');
    }
    hideModal(){
        $('#windowForm').modal('hide');
        this.props.actions.clearFromValidation();
    }
    /*
    * Component life circyle
    * */
    componentWillMount() {

    }
    componentDidMount() {
        this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
    }

    render() {

        const {
            setup,
            listData,
            gridHeader,
            totalPages,
            pageLimit,
            totalItems,
            currentPage,
            paginationPosition,
            formData,
            editID,
            formType,
            formControls,
            focusIndex,
            showInlineForm,
            gridWidth,
            gridHeight,
            showGird
            } = this.props;



        const gridId = 'grid_table'
        const topPagination = paginationPosition == 'top' || paginationPosition == 'both' ?
            <Pagination
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                pageLimit={pageLimit}
                handler={this.hangePageLimitChange.bind(this)}
                handlerPage={this.handlePageChange.bind(this)}
                paginationMarg=""
            />
            :
            null

        const BottomPagination = paginationPosition == 'bottom' || paginationPosition == 'both' ?
            <Pagination
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                pageLimit={pageLimit}
                handler={this.hangePageLimitChange.bind(this)}
                handlerPage={this.handlePageChange.bind(this)}
                paginationMarg="paginationBottom"
            />
            :
            null
        const gridBody = showGird === true ? listData.length >= 1 ?
            <Body
                gridId={gridId}
                bodyData={listData}
                bodyHeader={gridHeader}
                setRowEdit={this.setRowEdit.bind(this)}
                formType={formType}
                selectRow={this.selectRow.bind(this)}
                editID={editID}
                showInlineForm={showInlineForm}
                removeInlineForm={this.removeInlineForm.bind(this)}
                formData={formData}
                formControls={formControls}
                focusIndex={focusIndex}
                handleDeleteItem={this.handleDeleteItem.bind(this)}
                inlineChangeValues={this.ChangeValues.bind(this)}
                callWindowEdit={this.callWindowEdit.bind(this)}
                saveInlineForm={this.saveForm.bind(this)}

            />
            :
            <div className="tp-laoder">
               <h5>Мэдээлэл хадаглагдаагүй байна</h5>
            </div>
            :
            <div className="tp-laoder">
                <img src="/shared/table-properties/img/loader.gif" alt="Loading"/>
                <br/>
                Ачааллаж байна
            </div>

        return (
            <div >
                <Header pageName={setup.page_name} icon="fa fa-plus"
                        link="#/add"
                        type="list"
                        formType={formType}
                        addInlineForm={this.addInlineForm.bind(this)}
                        ref="search"
                        handlerSearch={this.handleSearch.bind(this)}
                        showModal={this.showModal.bind(this)}
                        handlerReload={this.callPageDatas.bind(this, this.props.currentPage, this.props.pageLimit, this.props.searchValue)}
                        exportPDF={this.exportPDF.bind(this)}
                        exportEXCEL={this.exportEXCEL.bind(this)}
                />

                {topPagination}

                {gridBody}

                {BottomPagination}


                <Window
                    formControls={formControls}
                    formData={formData}
                    pageName={setup.page_name}
                    changeHandler={this.ChangeValues.bind(this)}
                    saveForm={this.saveForm.bind(this, editID)}
                    hideModal={this.hideModal.bind(this)}
                />
            </div>

        )
    }
}

GridContainer.defaultProps = {
    gridHeader: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageLimit: 10,
    searchValue: '',
    listData:[],
    formControls:[],

}
GridContainer.propTypes = {
    //setup: PropTypes.object.isRequired,
    //listData: PropTypes.object.isRequired,
}

function mapStateToProps(state) {

    const TpStore = state.TpStore;

    return {
        setup: TpStore.get('setup').toJS(),
        formData: TpStore.get('formData').toJS(),
        editID: TpStore.get('editID'),
        showInlineForm: TpStore.get('showInlineForm'),
        showGird: TpStore.get('showGird'),
        focusIndex: TpStore.get('focusIndex'),
        formControls: TpStore.get('setup').toJS().form_input_control,
        paginationPosition: TpStore.get('setup').toJS().pagination_position,
        formType: TpStore.get('setup').toJS().formType,
        //listData: TpStore.getIn(['listData', 'data']),
        listData: TpStore.get('listData').toJS().data,
        gridHeader: TpStore.get('setup').toJS().grid_output_control,
        totalItems: TpStore.get('listData').toJS().total,
        totalPages: TpStore.get('listData').toJS().last_page,
        currentPage: TpStore.get('currentPage'),
        pageLimit: TpStore.get('pageLimit'),
        searchValue: TpStore.get('searchValue'),

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
)(GridContainer)
