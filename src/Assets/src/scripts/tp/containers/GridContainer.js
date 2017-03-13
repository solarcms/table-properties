import React, {Component, PropTypes} from "react"

import {bindActionCreators} from "redux"
import {connect} from "react-redux"



// import Window from "../components/window/"


import * as DataActions from "../actions/grid";
import * as DataActionsForm from "../actions/form"
import {getList, deleteItem, getCascadeChild, edit, changeLanguage} from "../api/"
import Header from "../components/grid/Header"
import Pagination from "../components/grid/Paginator"
import {afterChangeCallerH, validationCaller, getData, getColumnIndex, getValueAtCell, getColumnTranslate, getColumnType, getColumn, afterChange, exportEXCEL, afterValidater, setUpHandsonTable, editDeleteRender} from '../tools/handsonTable'

import {getDate} from "../tools/date";
import validationGrid from "../components/grid/validation/"
import AdvenvedSearch from "../components/grid/AdvenvedSearch"
import Loading from '../components/loading/loading'
import {calculate} from '../tools/calculate'

class GridContainer extends Component {

    constructor(props) {
        super(props);
        let topH = this.props.showAdvenced ? this.props.gridTopWithAdvenced : this.props.gridTop;
        this.state = {
            tpHeight:window.innerHeight-topH
        };
        //auto calculate
        this.calculate = calculate.bind(this);
        //window resize handler
        this.handleResize = this.handleResize.bind(this);
        //handson table
        this.grid = 'tp_grid';
        this.exportEXCEL = exportEXCEL.bind(this);
        this.getData = getData.bind(this);
        this.validationCaller = validationCaller.bind(this);
        this.getValueAtCell = getValueAtCell.bind(this);
        this.getColumnIndex = getColumnIndex.bind(this);
        this.getColumnTranslate = getColumnTranslate.bind(this);
        this.getColumnType = getColumnType.bind(this);
        this.getColumn = getColumn.bind(this);
        this.afterChange = afterChange.bind(this);
        this.afterValidater = afterValidater.bind(this);
        this.setUpHandsonTable = setUpHandsonTable.bind(this);
        this.editDeleteRender = editDeleteRender.bind(this);
        this.afterChangeCallerH = afterChangeCallerH.bind(this);
        this.tp_handSonTable = null;
        this.exportPlugin = null;
        this.tp_dataSchema = {};

        //after change trigger
        this.timeout = null;
    }

    /* component life cycle ----------------------------------------- */
    componentWillMount() {

    }

    componentDidMount() {
        this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
        window.addEventListener('resize', this.handleResize);
    }

    handleResize(e) {

        let topH = this.props.showAdvenced ? this.props.gridTopWithAdvenced : this.props.gridTop;
        this.setState({tpHeight: window.innerHeight-topH});

        this.setUpHandsonTable(window.innerHeight-topH);
    }

    componentDidUpdate(prevProps) {

        if (prevProps.defaultLocale != this.props.defaultLocale) {
            this.setUpHandsonTable()
        }
        if (prevProps.permission.r == false && this.props.permission.r == true) {
            this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
        }
        if (this.props.showInlineForm === true) {
            //this.setUpHandsonTable()

        }

        if (prevProps.order.column != this.props.order.column || prevProps.order.sortOrder != this.props.order.sortOrder) {
            this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
        }

        if (JSON.stringify(prevProps.advancedSearch) != JSON.stringify(this.props.advancedSearch)) {
            this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
        }


    }

    componentWillUnmount() {
        //tp_handSonTable.destroy()

        window.removeEventListener('resize', this.handleResize);

    }


    /* header functions ----------------------------------------- */
    changeLanguage(locale) {
        changeLanguage(locale).then(()=> {
            this.props.actions.setLocale(locale);

        })

    }
    hideShowColumn(show, columnIndex) {
        this.props.actions.setShowHideColumn(show, columnIndex)
        setTimeout(
            () => {
                this.setUpHandsonTable()
            },
            100
        );
    }

    handleSearch() {
        let sword = this.refs.search.refs.searchWord.value
        this.props.actions.setSearch(sword)
        this.callPageDatas(1, this.props.pageLimit, sword)
    }

    /* pagination */
    pageLimitChange(e) {
        this.props.actions.setPageLimit(e.target.value * 1)
        this.props.actions.setCurrentPage(1)
        this.callPageDatas(1, e.target.value, this.props.searchValue)
    }

    handlePageChange(event) {
        this.props.actions.setCurrentPage(event)

        this.callPageDatas(event, this.props.pageLimit, this.props.searchValue)
    }

    /* Window form*/
    callWindowEdit(id) {
        if (this.props.permission.u !== true)
            return false;


        this.props.actions.setRowEdit(id, 0)
        edit(id).then((data)=> {
            if (data.length >= 1)
                this.props.formControls.map((formControl, index)=> {
                    this.props.actions.chagenValue(index, data[0][formControl.column])
                })
            else
                alert('please try agian')
        });
        //$('#windowForm').modal({'backdrop': false}, 'show');
    }

    showModal() {
        if (this.props.permission.c !== true)
            return false;
        //$('#windowForm').modal({'backdrop': false}, 'show');
    }

    hideModal() {
        //$('#windowForm').modal('hide');
        this.props.actions.clearFromValidation();
    }

    callPageDatas(page, pageLimit, searchValue) {
        if (this.props.permission.r !== true)
            return false;

        this.props.actions.setShowGrid(false);
        console.log('test test 4')
        getList(page, {
            pageLimit: pageLimit,
            searchValue: searchValue,
            order: this.props.order,
            advancedSearch:this.props.advancedSearch
        }).success((data)=> {
            console.log('data', 'aa', 'kkk');
            this.props.actions.receiveListData(data);
            this.props.actions.setShowGrid(true);
            this.setUpHandsonTable();
        });
    }

    handleDeleteItem(id) {

        if (id == -1) {
            this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)

            this.removeInlineForm()
        } else if (this.props.permission.d == true) {

            if (!confirm('Delete this record?')) {
                return;
            }
            else {
                deleteItem(id).then((data)=> {

                    this.removeInlineForm()
                    if (data == 'success')
                        this.callPageDatas(this.props.currentPage, this.props.pageLimit, this.props.searchValue)
                    else if (data == 'error')
                        alert("Алдаа гарлаа")
                    else
                        alert(data)
                }).fail(()=> {
                    alert("Алдаа гарлаа")
                });
            }


        }
    }

    addInlineForm() {
        this.props.actions.setInlineFrom(true);


        if (this.props.showInlineForm === false) {


            this.tp_handSonTable.alter('insert_row', 0, 1);

        }

        else
            alert("Эхний өгөгдлөө хадгалана уу")

    }

    removeInlineForm() {

        this.props.actions.setInlineFrom(false);
    }



    internalLink(instance, td, row, col, prop, value, cellProperties) {
        while (td.firstChild) {
            td.removeChild(td.firstChild);
        }


        if (value) {
            let colIndex = this.getColumnIndex(prop)
            let pre_link = document.createElement('a');

            let colOption = this.props.gridHeader[colIndex];
            pre_link.setAttribute('target', '_blank');
            td.setAttribute('class', 'htCenter htMiddle');
            pre_link.setAttribute('href', colOption.link + value);


            pre_link.innerHTML = colOption.icon


            td.appendChild(pre_link);


            return td;
        }
    }




    showAdvenced(){
        if(this.props.showAdvenced)
            this.props.actions.showAdvenced(false);
        else
            this.props.actions.showAdvenced(true);

        this.setUpHandsonTable();
    }

    /* advanced search & order */
    beforeColumnSort(columnIndex, order){
        if(columnIndex == -1)
            return false;

        let column = null;
        let sortOrder = null;

        if(order === true){
            sortOrder = 'ASC';
            column = this.getColumn(columnIndex);
        } else if(order === false){
            sortOrder = 'DESC';
            column = this.getColumn(columnIndex);
        }


        this.props.actions.setOrder(column, sortOrder)




        return false;
    }
    mainOrderNew(){
        this.props.actions.setOrder(this.props.identity_name, 'DESC')
    }
    mainOrderOld(){
        this.props.actions.setOrder(this.props.identity_name, 'ASC')
    }
    parentSelectHandler(index, value){

        this.props.actions.dynamicChange(['advancedSearch', 'parentSelect', index, 'value'], value);



        if(this.props.advancedSearch.parentSelect[index].child){

            this.props.advancedSearch.parentSelect.map((parentSelect, Pindex)=> {

                if(parentSelect.column == this.props.advancedSearch.parentSelect[index].child){
                    this.props.actions.dynamicChange(['advancedSearch', 'parentSelect', Pindex, 'value'], null);
                }
            });
            getCascadeChild(this.props.advancedSearch.parentSelect[index].child, value).then((data)=>{
                this.props.actionsForm.changeFormData(this.props.advancedSearch.parentSelect[index].child, data);
            })
        }
    }
    dateRange(index, v,  value){
      
        let newValue = getDate(value);
        this.props.actions.dynamicChange(['advancedSearch', 'dateRange', index, 'value'+v], newValue);
    }
    dateYearMonthChangeY(value){
        this.props.actions.dynamicChange(['advancedSearch', 'dateYearMonth', 'defaultYear'], value);
    }
    dateYearMonthChangeM(value){
        this.props.actions.dynamicChange(['advancedSearch', 'dateYearMonth', 'defaultMonth'], value);
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
            ifUpdateDisabledCanEditColumns,
            button_texts,
            advancedSearch,
            order,
            identity_name,
            formDataNew,
            hideMainOrder,
            grid_extra_data,
            advancedSearchImmutalbe
        } = this.props;

        if (permission.r === false && permission.c === true) {

            window.location.replace('#/add');

        }

        if (permission.r === false && permission.c === false && permission.d === false && setup.update_row !== null) {

            window.location.replace('#/edit/' + setup.update_row);

        }


        const BottomPagination = <Pagination
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={currentPage}
            pageLimit={pageLimit}
            handler={this.pageLimitChange.bind(this)}
            handlerPage={this.handlePageChange.bind(this)}
            paginationMarg="paginationBottom"
        />

        const AdvencedClass = this.props.showAdvenced ? 'show_advenced' : '';
        const gridClass = this.props.showAdvenced ? 'with_advenced' : '';
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
                        exportEXCEL={this.exportEXCEL.bind(this)}
                        permission={permission}
                        gridHeader={gridHeader}
                        hideMainOrder={hideMainOrder}
                        hideShowColumn={this.hideShowColumn.bind(this)}
                        showAdvenced={this.showAdvenced.bind(this)}
                        add_button_text={button_texts.add_button_text}
                />
                <AdvenvedSearch
                    AdvencedClass={AdvencedClass}
                    advancedSearch={advancedSearch}
                    order={order}
                    identity_name={identity_name}
                    formDataNew={formDataNew}
                    grid_extra_data={grid_extra_data}
                    defaultLocale={defaultLocale}
                    formControls={formControls}
                    hideMainOrder={hideMainOrder}
                    dateRangeChange={this.dateRange.bind(this)}
                    dateYearMonthChangeY={this.dateYearMonthChangeY.bind(this)}
                    dateYearMonthChangeM={this.dateYearMonthChangeM.bind(this)}
                    parentSelectHandler={this.parentSelectHandler.bind(this)}
                    mainOrderNew={this.mainOrderNew.bind(this)}
                    mainOrderOld={this.mainOrderOld.bind(this)}
                />

                <div id="tp_grid" className={gridClass}>
                    <Loading />
                </div>

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
    listData: [],
    locales: [],
    permission: {c: false, r: true, u: false, d: false},
    ifUpdateDisabledCanEditColumns: []

}


function mapStateToProps(state) {

    const Grid = state.Grid;
    const Form = state.Form;

    return {
        identity_name: Form.get('identity_name'),
        setup: Grid.get('setup').toJS(),
        locales: Grid.get('setup').toJS().locales,
        defaultLocale: Grid.get('defaultLocale'),
        formData: Form.get('formData').toJS(),
        formDataNew: Form.get('formData'),
        grid_extra_data: Grid.get('grid_extra_data'),
        editID: Grid.get('editID'),
        showInlineForm: Grid.get('showInlineForm'),
        showGird: Grid.get('showGird'),
        button_texts: Grid.get('button_texts'),
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
        edit_delete_column_title: Grid.get('edit_delete_column_title'),
        showAdvenced: Grid.get('showAdvenced'),
        order: Grid.get('order').toJS(),
        advancedSearch: Grid.get('advancedSearch').toJS(),
        columnSummary: Grid.get('columnSummary').toJS(),
        gridTop: Grid.get('gridTop'),
        gridTopWithAdvenced: Grid.get('gridTopWithAdvenced'),
        hideMainOrder: Grid.get('hideMainOrder'),

    }
}

function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(DataActions, dispatch),
        actionsForm: bindActionCreators(DataActionsForm, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GridContainer)
