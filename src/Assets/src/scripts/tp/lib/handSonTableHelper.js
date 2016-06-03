
export function customDropdownRenderer(instance, td, row, col, prop, value, cellProperties) {

    while (td.firstChild) {
        td.removeChild(td.firstChild);
    }

    var selectedId;
    var multiple = cellProperties.chosenOptions.multiple;
    var optionsList = cellProperties.chosenOptions.data;

    var valueField = cellProperties.chosenOptions.valueField;
    var textField = cellProperties.chosenOptions.textField;
    var valueReal = value;







    var values = (value + "").split(",");


    var value = [];
    for (var index = 0; index < optionsList.length; index++) {

        if (multiple === true) {
            values.map(tagValue=> {

                if (tagValue == optionsList[index]['id']) {
                    value.push(optionsList[index]['label']);
                }
            })
        }
        else {
            if (valueReal == optionsList[index]['id']) {
                value.push(optionsList[index]['label']);
            }

        }
    }
    value = value.join(", ");


    let pre = document.createElement('span');
    pre.innerHTML = value
    td.appendChild(pre)


    td.setAttribute('class', cellProperties.className);

    return td;
}
export function gridImage(instance, td, row, col, prop, value, cellProperties) {

    while (td.firstChild) {
        td.removeChild(td.firstChild);
    }


    if (value) {
        let pre_link = document.createElement('a');


        let value_image = JSON.parse(value);

        let image_thum_url = value_image.thumbUrl + value_image.uniqueName
        let image_url = value_image.destinationUrl + value_image.uniqueName

        pre_link.setAttribute('target', '_blank');
        pre_link.setAttribute('href', image_url);

        let image = document.createElement('img');
        image.setAttribute('class', 'grid-thumb');
        image.setAttribute('src', image_thum_url);

        pre_link.appendChild(image)


        td.appendChild(pre_link);


        return td;
    }


}
export function genrateComboboxvalues(data, header) {

    let optionsList = [];
   data.map((lsdata, lsindex) => {

        var valuef = [];
        if (header.options.textField instanceof Array) {
            header.options.textField.map(tf=> {

                valuef.push(lsdata[tf]);
            })
        } else
            valuef.push(lsdata[header.options.textField]);

        valuef = valuef.join(", ");
        optionsList.push({
            id:lsdata[header.options.valueField],
            label:valuef
        })
    })

    return optionsList;
}

var _table_ = document.createElement('table'),
    _tr_ = document.createElement('tr'),
    _th_ = document.createElement('th'),
    _td_ = document.createElement('td');


export function gridJson(instance, td, row, col, prop, value, cellProperties) {

    while (td.firstChild) {
        td.removeChild(td.firstChild);
    }


    if (value) {



        let jsonTable = JSON.parse(value);






        td.appendChild(buildHtmlTable(jsonTable));


        return td;
    }


}
function buildHtmlTable(arr) {
    var table = _table_.cloneNode(false),
        columns = addAllColumnHeaders(arr, table);
    for (var i=0, maxi=arr.length; i < maxi; ++i) {
        var tr = _tr_.cloneNode(false);
        for (var j=0, maxj=columns.length; j < maxj ; ++j) {
            var td = _td_.cloneNode(false);

            td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}

function addAllColumnHeaders(arr, table)
{
    var columnSet = [],
        tr = _tr_.cloneNode(false);
    for (var i=0, l=arr.length; i < l; i++) {
        for (var key in arr[i]) {
            if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key)===-1) {
                columnSet.push(key);
                var th = _th_.cloneNode(false);
                th.appendChild(document.createTextNode(key));
                tr.appendChild(th);
            }
        }
    }
    table.appendChild(tr);
    return columnSet;
}




