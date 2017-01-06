import React, { Component, PropTypes }  from 'react';

import ComboBox from '../../components/form/elements/ComboBox';
import HeaderCombo from '../../components/grid/HeaderCombo';
import Datetime from 'react-datetime';
export default class AdvenvedSearch extends Component {

    parentSelectHandler(index, value){
        this.props.parentSelectHandler(index, value);
    }

    dateRangeChange(index, number, value){
        this.props.dateRangeChange(index, number, value);
    }

    render() {
        const {
            AdvencedClass,
            advancedSearch,
            order,
            identity_name,
            formDataNew,
            defaultLocale,
            formControls,
            dateRangeChange,
            mainOrderOld,
            mainOrderNew,
            hideMainOrder,
            dateYearMonthChangeY,
            grid_extra_data,
            dateYearMonthChangeM
        } = this.props;

        let yearOptions = [];
        let monthOptions = [];

        if(advancedSearch.dateYearMonth && advancedSearch.dateYearMonth.years.length >= 1 && advancedSearch.dateYearMonth.months.length >= 1){
            yearOptions = advancedSearch.dateYearMonth.years;
            monthOptions = advancedSearch.dateYearMonth.months;


        }


        return (
            <div className={`advanced_search_order ${AdvencedClass}`}>
                {advancedSearch.dateYearMonth && advancedSearch.dateYearMonth.years.length >= 1 && advancedSearch.dateYearMonth.months.length >= 1?
                    <div  className="date-year-month">
                        <div className="year-search">
                            <HeaderCombo
                                disabled={false}
                                name={`years`}
                                fieldClass={``}
                                placeholder={`Жил`}
                                fieldClassName={``}
                                value={advancedSearch.dateYearMonth.defaultYear}
                                multi={false}
                                fieldOptions={yearOptions}
                                changeHandler={dateYearMonthChangeY}
                            />

                        </div>
                        <div className="month-search">
                            <HeaderCombo
                                disabled={false}
                                name={`months`}
                                fieldClassName={``}
                                placeholder={`Сар`}
                                value={advancedSearch.dateYearMonth.defaultMonth}
                                multi={false}
                                fieldOptions={monthOptions}
                                changeHandler={dateYearMonthChangeM}
                            />
                        </div>
                    </div>:null
                }
                <div className="dateRange">
                    {advancedSearch.dateRange ? advancedSearch.dateRange.map((dateRange, index)=>{


                            return <div key={index} className="form-inline">

                                <div key={index} dataIndex={index} className={`form-group`}>
                                    <label className="control-label">{dateRange.label}</label>
                                    <div className="date-range">
                                        <Datetime
                                            value={dateRange.value1 ? dateRange.value1 : undefined}
                                            defaultValue={dateRange.value1 ? dateRange.value1 : undefined}
                                            viewMode={`days`}
                                            dateFormat={`YYYY-MM-DD`}
                                            timeFormat={false}
                                            onChange={this.dateRangeChange.bind(this, index, 1)}
                                            closeOnSelect={true}
                                            inputProps={{placeholder:'Эхлэх'}}
                                        />
                                        <Datetime
                                            value={dateRange.value2 ? dateRange.value2 : undefined}
                                            defaultValue={dateRange.value2 ? dateRange.value2 : undefined}
                                            viewMode={`days`}
                                            dateFormat={`YYYY-MM-DD`}
                                            timeFormat={false}
                                            onChange={this.dateRangeChange.bind(this, index, 2)}
                                            closeOnSelect={true}
                                            inputProps={{placeholder:'Дуусах'}}

                                        />


                                    </div>

                                </div>

                            </div>
                        }
                    ) : null}

                </div>
                <div className="numberRange">

                </div>
                <div className="parentSelect" >
                    {advancedSearch.parentSelect ? advancedSearch.parentSelect.map((parentSelect, index)=>{

                            let options = [];
                            formControls.map(data=>{
                                if(data.get('column') == parentSelect.column){

                                    options = data.get('options');
                                }
                            });
                            if(Array.isArray(options)){
                                if(options.length <= 0){

                                    grid_extra_data.map(data=>{
                                        if(data.get('column') == parentSelect.column){

                                            options = data.get('options');
                                        }
                                    });
                                }
                            }else{


                                grid_extra_data.map(data=>{
                                    if(data.get('column') == parentSelect.column){

                                        options = data.get('options');
                                    }
                                });

                            }


                            return <div key={index}  >

                                <ComboBox
                                    disabled={false}
                                    dataIndex={index}
                                    column={parentSelect.column}
                                    name={parentSelect.column}
                                    fieldClass={``}
                                    placeholder={parentSelect.label}
                                    formType={``}
                                    formData={formDataNew}
                                    value={parentSelect.value}
                                    multi={false}
                                    defaultLocale={defaultLocale}
                                    fieldOptions={options}
                                    changeHandler={this.parentSelectHandler.bind(this, index)}
                                    errorText={``}
                                />

                            </div>
                        }
                    ): null}
                </div>
                {hideMainOrder === false ?
                    <div className="sortNewOld">
                        Эрэмбэлэх:
                        <a href="javascript:void(0)"
                           onClick={mainOrderNew}
                           className={order.column == identity_name && order.sortOrder == 'DESC' ? `active-sort` : null}>
                            <i className="material-icons">&#xE5C5;</i> Шинэ 1
                        </a>
                        <a href="javascript:void(0)"
                           onClick={mainOrderOld}
                           className={order.column == identity_name && order.sortOrder == 'ASC' ? `active-sort` : null}>
                            <i className="material-icons">&#xE5C7;</i> Хуучин 2
                        </a>
                    </div>
                    :null
                }



            </div>
        )
    }
}
