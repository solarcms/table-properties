export function urtugBodoh(noat_shalgah, irsen_une) {
    if(noat_shalgah == 1 || noat_shalgah == '1'){
        return Math.ceil((irsen_une/1.1));
    } else {

        return irsen_une*1;
    }
}

export function noatBodoh(noat_shalgah, irsen_une, urtug_une) {
    if (noat_shalgah == 1 || noat_shalgah == '1') {
        return (irsen_une * 1) - (urtug_une * 1);
    } else {
        return 0;
    }

}

export function hudaldahUneBodoh(urtug_une, borluulaltiin_huvi, noattei_zarah, nhattai_zarah) {

    let hudaldah_und_bodson = 0;

    let pluss_vlue = (urtug_une/100)*borluulaltiin_huvi;
    hudaldah_und_bodson = (urtug_une*1)+(pluss_vlue);

    let noat = 0;
    let nhat = 0;

    if(noattei_zarah == 1 || noattei_zarah == '1'){
        noat = (hudaldah_und_bodson*0.1);

    }

    if(nhattai_zarah == 1 || nhattai_zarah == '1'){
        nhat = (hudaldah_und_bodson*0.01);

    }
    hudaldah_und_bodson = hudaldah_und_bodson+nhat+noat;
    hudaldah_und_bodson = Math.ceil((hudaldah_und_bodson/10))*10;

    return hudaldah_und_bodson;

}

export function noatZarah(urtug_une, borluulaltiin_huvi, noattei_zarah) {
    let hudaldah_und_bodson = 0;

    let pluss_vlue = (urtug_une/100)*borluulaltiin_huvi;
    hudaldah_und_bodson = (urtug_une*1)+(pluss_vlue);

    let noat = 0;


    if(noattei_zarah == 1 || noattei_zarah == '1'){
        noat = (hudaldah_und_bodson*0.1);

    }



    return noat;
}

export function noatDun(hudaldah_une, noattei_zarah, nhattai_zarah) {

    let urtug = hudaldah_une;

    let noat = 0;

    if(noattei_zarah == 1 && nhattai_zarah == 0 || noattei_zarah == '1' && nhattai_zarah == '0'){
        urtug =hudaldah_une/1.1;
        noat = (hudaldah_une * 1) - (urtug * 1);
    }

    if(noattei_zarah == 1 && nhattai_zarah == 1 || noattei_zarah == '1' && nhattai_zarah == '1'){
        urtug =(hudaldah_une/1.11);
        noat = (urtug * 0.1);
    }





    return noat;
}
export function nhatZarah(urtug_une, borluulaltiin_huvi, nhattai_zarah) {
    let hudaldah_und_bodson = 0;

    let pluss_vlue = (urtug_une/100)*borluulaltiin_huvi;
    hudaldah_und_bodson = (urtug_une*1)+(pluss_vlue);

    let nhat = 0;


    if(nhattai_zarah == 1 || nhattai_zarah == '1'){
        nhat = (hudaldah_und_bodson*0.01);

    }



    return nhat;
}
export function nhatDun(hudaldah_une, nhattai_zarah, noattei_zarah) {

    let urtug = hudaldah_une;

    let nhat = 0;

    if(noattei_zarah == 0 && nhattai_zarah == 1 || noattei_zarah == '0' && nhattai_zarah == '1'){
        urtug =hudaldah_une/1.01;
        nhat = (hudaldah_une * 1) - (urtug * 1);
    }

    if(noattei_zarah == 1 && nhattai_zarah == 1 || noattei_zarah == '1' && nhattai_zarah == '1'){
        urtug =(hudaldah_une/1.11);
        nhat = (urtug * 0.01);
    }

    return nhat;
}

export function calculate(row){

    let calculate_columns = [];

    let formControls = this.props.formType != 'inline' && this.state.formGrid !== true ? this.props.formControls.toJS() : this.props.gridHeader;

    formControls.map((fcontrol, findex)=> {
        if (fcontrol.type == '--auto-calculate') {


            let calculate_type = fcontrol.options.calculate_type;
            let calculate_column = fcontrol.column;

            let columns = [];

            fcontrol.options.calculate_columns.map((calculate_column, cal_index)=> {



                columns.push(
                    {column: calculate_column, value: this.getValueAtCell(row, calculate_column)}
                );
            })
            if(calculate_type == '--urtug-bodoh'){
                let noat_shalgah = fcontrol.options.noat_shalgah;
                let irsen_une = fcontrol.options.irsen_une;



                calculate_columns.push(
                    {
                        column:calculate_column,
                        type:calculate_type,
                        columns:columns,
                        dataIndex:findex,
                        noat_shalgah: this.getValueAtCell(row, noat_shalgah),
                        irsen_une: this.getValueAtCell(row, irsen_une)
                    }
                )
            } else if(calculate_type == '--noat-bodoh'){
                let noat_shalgah = fcontrol.options.noat_shalgah;
                let irsen_une = fcontrol.options.irsen_une;
                let urtug_une = fcontrol.options.urtug_une;

                calculate_columns.push(
                    {
                        column:calculate_column,
                        type:calculate_type,
                        columns:columns,
                        dataIndex:findex,
                        noat_shalgah: this.getValueAtCell(row, noat_shalgah),
                        irsen_une: this.getValueAtCell(row, irsen_une),
                        urtug_une: this.getValueAtCell(row, urtug_une)
                    }
                )
            } else if(calculate_type == '--hudaldal-une-bodoh'){
                let borluulaltiin_huvi = fcontrol.options.borluulaltiin_huvi;
                let urtug_une = fcontrol.options.urtug_une;
                let noattei_zarah = fcontrol.options.noattei_zarah;
                let nhattai_zarah = fcontrol.options.nhattai_zarah;



                calculate_columns.push(
                    {
                        column:calculate_column,
                        type:calculate_type,
                        columns:columns,
                        dataIndex:findex,
                        borluulaltiin_huvi: this.getValueAtCell(row, borluulaltiin_huvi),
                        urtug_une: this.getValueAtCell(row, urtug_une),
                        nhattai_zarah: this.getValueAtCell(row, nhattai_zarah),
                        noattei_zarah: this.getValueAtCell(row, noattei_zarah)
                    }
                )
            } else if(calculate_type == '--noat-zarah'){
                let borluulaltiin_huvi = fcontrol.options.borluulaltiin_huvi;
                let urtug_une = fcontrol.options.urtug_une;
                let noattei_zarah = fcontrol.options.noattei_zarah;


                calculate_columns.push(
                    {
                        column:calculate_column,
                        type:calculate_type,
                        columns:columns,
                        dataIndex:findex,
                        borluulaltiin_huvi: this.getValueAtCell(row, borluulaltiin_huvi),
                        urtug_une: this.getValueAtCell(row, urtug_une),
                        noattei_zarah: this.getValueAtCell(row, noattei_zarah)
                    }
                )
            } else if(calculate_type == '--noat-dun'){
                let hudaldah_une = fcontrol.options.hudaldah_une;
                let noattei_zarah = fcontrol.options.noattei_zarah;
                let nhattai_zarah = fcontrol.options.nhattai_zarah;


                calculate_columns.push(
                    {
                        column:calculate_column,
                        type:calculate_type,
                        columns:columns,
                        dataIndex:findex,
                        hudaldah_une: this.getValueAtCell(row, hudaldah_une),
                        noattei_zarah: this.getValueAtCell(row, noattei_zarah),
                        nhattai_zarah: this.getValueAtCell(row, nhattai_zarah)
                    }
                )
            } else if(calculate_type == '--nhat-zarah'){
                let borluulaltiin_huvi = fcontrol.options.borluulaltiin_huvi;
                let urtug_une = fcontrol.options.urtug_une;
                let nhattai_zarah = fcontrol.options.nhattai_zarah;


                calculate_columns.push(
                    {
                        column:calculate_column,
                        type:calculate_type,
                        columns:columns,
                        dataIndex:findex,
                        borluulaltiin_huvi: this.getValueAtCell(row, borluulaltiin_huvi),
                        urtug_une: this.getValueAtCell(row, urtug_une),
                        nhattai_zarah: this.getValueAtCell(row, nhattai_zarah)
                    }
                )
            } else if(calculate_type == '--nhat-dun'){
                let hudaldah_une = fcontrol.options.hudaldah_une;
                let nhattai_zarah = fcontrol.options.nhattai_zarah;
                let noattei_zarah = fcontrol.options.noattei_zarah;


                calculate_columns.push(
                    {
                        column:calculate_column,
                        type:calculate_type,
                        columns:columns,
                        dataIndex:findex,
                        hudaldah_une: this.getValueAtCell(row, hudaldah_une),
                        nhattai_zarah: this.getValueAtCell(row, nhattai_zarah),
                        noattei_zarah: this.getValueAtCell(row, noattei_zarah)
                    }
                )
            } else
                calculate_columns.push(
                    {
                        column:calculate_column,
                        type:calculate_type,
                        columns:columns,
                        dataIndex:findex
                    }
                )

        }
    })

    calculate_columns.map((calculate_column, index)=>{
        let checkAllValue = true;
        calculate_column.columns.map((cal_column)=>{
            if(cal_column.value === null)
                checkAllValue = false
        })
        let calculate_result = null;
        if(checkAllValue === true){
            if(calculate_column.type == '--multiply') {
                calculate_column.columns.map((cal_column, calIndex)=> {
                    if (calIndex == 0)
                        calculate_result = cal_column.value;
                    else
                        calculate_result = calculate_result * cal_column.value
                })
            } else if(calculate_column.type == '--divide') {
                calculate_column.columns.map((cal_column, calIndex)=> {
                    if (calIndex == 0)
                        calculate_result = cal_column.value;
                    else
                        calculate_result = calculate_result / cal_column.value
                })
            }else if(calculate_column.type == '--add_percent_10'){
                calculate_column.columns.map((cal_column, calIndex)=>{
                    if(calIndex == 0)
                        calculate_result = cal_column.value;
                    else{
                        let pluss_vlue = (calculate_result/100)*cal_column.value;

                        let calculate_10 = Math.ceil((((calculate_result*1)+(pluss_vlue))/10))*10;

                        calculate_result = calculate_10;
                    }

                })
            }else if(calculate_column.type == '--urtug-bodoh'){

                calculate_result = urtugBodoh(calculate_column.noat_shalgah, calculate_column.irsen_une);

            }else if(calculate_column.type == '--noat-bodoh'){

                calculate_result = noatBodoh(calculate_column.noat_shalgah, calculate_column.irsen_une, calculate_column.urtug_une);

            }else if(calculate_column.type == '--hudaldal-une-bodoh'){

                calculate_result = hudaldahUneBodoh(calculate_column.urtug_une, calculate_column.borluulaltiin_huvi, calculate_column.noattei_zarah, calculate_column.nhattai_zarah);


            }else if(calculate_column.type == '--noat-zarah'){

                calculate_result = noatZarah(calculate_column.urtug_une, calculate_column.borluulaltiin_huvi, calculate_column.noattei_zarah);


            }else if(calculate_column.type == '--noat-dun'){

                calculate_result = noatDun(calculate_column.hudaldah_une, calculate_column.noattei_zarah, calculate_column.nhattai_zarah);


            }else if(calculate_column.type == '--nhat-zarah'){

                calculate_result = nhatZarah(calculate_column.urtug_une, calculate_column.borluulaltiin_huvi, calculate_column.nhattai_zarah );


            }else if(calculate_column.type == '--nhat-dun'){

                calculate_result = nhatDun(calculate_column.hudaldah_une, calculate_column.nhattai_zarah, calculate_column.noattei_zarah);


            }else if(calculate_column.type == '--minus'){
                calculate_column.columns.map((cal_column, calIndex)=>{
                    if(calIndex == 0)
                        calculate_result = cal_column.value;
                    else
                        calculate_result = calculate_result - cal_column.value
                })
            }else if((calculate_column.type == '--sum')){
                calculate_column.columns.map((cal_column, calIndex)=>{
                    if(calIndex == 0)
                        calculate_result = cal_column.value;
                    else
                        calculate_result = calculate_result + cal_column.value
                })
            } else if(calculate_column.type == '--average'){
                calculate_column.columns.map((cal_column, calIndex)=>{
                    if(calIndex == 0)
                        calculate_result = cal_column.value;
                    else
                        calculate_result = calculate_result + cal_column.value
                })
                calculate_result = calculate_result/calculate_column.columns.length;
            }
            if(calculate_result !== null){


                if (this.props.formType != 'inline' && this.state.formGrid !== true) {

                    this.props.changeHandler([calculate_column.dataIndex], calculate_result);


                } else {
                    let thisValue = this.tp_handSonTable.getDataAtCell(row, calculate_column.dataIndex);

                    if(thisValue != calculate_result){

                        this.tp_handSonTable.setDataAtCell(row, calculate_column.dataIndex, calculate_result);
                    }
                }


            }
        }
    });
}