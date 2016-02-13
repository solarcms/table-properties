export function priceFormatter(value) {
    // 16777215 == ffffff in decimal
    var color = '#'+Math.floor(Math.random() * 6777215).toString(16);
    return '<div  style="color: ' + color + '">' +
        '<i className="glyphicon glyphicon-usd"></i>' +
        value.substring(1) +
        '</div>';
}

export function nameFormatter(value, row) {
    console.log(value)
    //var icon = row.id % 2 === 0 ? 'glyphicon-star' : 'glyphicon-star-empty'
    //
    //return '<i className="glyphicon ' + icon + '"></i> ' + value;

    return 'sss'
}


export function runningFormatter(index) {
    return "<b>"+index+"</b>";
}