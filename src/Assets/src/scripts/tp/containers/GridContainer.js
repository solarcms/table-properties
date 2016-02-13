import React, { Component, PropTypes } from "react"
import $ from "jquery"

//import {modal} from 'bootstrap'
import * as DataActions from "../actions/grid"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import { getList, setupPage, deleteItem, save, update, edit, changeLanguage } from "../api/"
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
    //translation
    changeLanguage(locale){
        changeLanguage(locale).then(()=>{

            this.props.actions.setLocale(locale);


        })

    }
    /*
     * Grid main actions starting
     * */
    callPageDatas(page, pageLimit, searchValue) {
        if(this.props.permission.r !== true)
            return false;

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
        if(this.props.permission.d == true) {
            deleteItem(id).then((data)=> {
                if (data == 'success')
                    this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
                else
                    alert("Please try agian")
            });
        }
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


        if(this.props.permission.u !== true)
            return false;

            const FC = this.props.formControls;

            if (FC.length >= 1)
                this.props.actions.clearFromValidation();

            if (editId === this.props.editID)
                return false;

            this.props.actions.setRowEdit(editId, focusIndex)
            if (editId >= 1)
                edit(editId).then((data)=> {
                    if (data.length >= 1)
                        this.props.formControls.map((formControl, index)=> {

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
                if(this.props.permission.u !== true)
                    return false;
                    update(FD, id).done((data)=> {

                        if (data == 'success' || 'none') {
                            this.props.actions.clearFromValidation();
                            this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)

                            if (this.props.formType == 'inline')
                                this.setRowEdit(0, 0);
                            else if (this.props.formType == 'window')
                                this.hideModal();
                        }

                    }).fail(()=> {
                        alert("Уучлаарай алдаа гарлаа дахин оролдоно уу")
                    })

            } else {

                if(this.props.permission.c !== true)
                    return false;

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
        if(this.props.permission.u !== true)
            return false;


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
        if(this.props.permission.c !== true)
           return false;
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
    componentDidUpdate(prevProps) {

        if(prevProps.permission.r == false && this.props.permission.r == true){
            this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
        }

    }

    render() {

        const {
            setup,
            defaultLocale,
            locales,
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
            showGird,
            permission,
            ifUpdateDisabledCanEditColumns
            } = this.props;

        if (permission.r === false && permission.c === true) {

            window.location.replace('#/add');

        }


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
        const gridBody = permission.r === true ? showGird === true ? listData.length >= 1 ?
            <Body
                gridId={gridId}
                defaultLocale={defaultLocale}
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
                permission={permission}
                ifUpdateDisabledCanEditColumns={ifUpdateDisabledCanEditColumns}

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
            :
            <div className="tp-laoder">
                <h5>Уучлаарай таньд хандах эрх байхгүй байна !!!</h5>
            </div>

        /*
         <Window
         formControls={formControls}
         formData={formData}
         pageName={setup.page_name}
         changeHandler={this.ChangeValues.bind(this)}
         saveForm={this.saveForm.bind(this, editID)}
         hideModal={this.hideModal.bind(this)}
         />*/

        return (
            <div >
                <Header pageName={setup.page_name} icon="fa fa-plus"
                        locales={locales}
                        changeLanguage={this.changeLanguage.bind(this)}
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
                        permission={permission}
                />

                {topPagination}

                {gridBody}

                {BottomPagination}



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
    locales:[],
    permission:{c:false, r:true, u:false, d:false},
    ifUpdateDisabledCanEditColumns:[]

}
GridContainer.propTypes = {
    //setup: PropTypes.object.isRequired,
    //listData: PropTypes.object.isRequired,
}

function mapStateToProps(state) {

    const Grid = state.Grid;
    const Form = state.Form;

    return {
        setup: Grid.get('setup').toJS(),
        locales: Grid.get('setup').toJS().locales,
        defaultLocale: Grid.get('defaultLocale'),
        formData: Form.get('formData').toJS(),
        editID: Grid.get('editID'),
        showInlineForm: Form.get('showInlineForm'),
        showGird: Grid.get('showGird'),
        focusIndex: Grid.get('focusIndex'),
        formControls: Form.get('form_input_control'),
        permission: Grid.get('setup').toJS().permission,
        ifUpdateDisabledCanEditColumns: Grid.get('setup').toJS().ifUpdateDisabledCanEditColumns,
        paginationPosition: Grid.get('setup').toJS().pagination_position,
        formType: Grid.get('setup').toJS().formType,
        listData: Grid.get('listData').toJS().data,
        gridHeader: Grid.get('setup').toJS().grid_output_control,
        totalItems: Grid.get('listData').toJS().total,
        totalPages: Grid.get('listData').toJS().last_page,
        currentPage: Grid.get('currentPage'),
        pageLimit: Grid.get('pageLimit'),
        searchValue: Grid.get('searchValue'),

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
