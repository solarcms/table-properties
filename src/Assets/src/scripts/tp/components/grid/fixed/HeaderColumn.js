import $ from "jquery"
export function fixRowHeigth(gridId) {



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

    /////////////






    let leftTableWidth = $("#"+gridId+"-left > thead").outerWidth();



    /////////////// fixed table header

    $("#"+gridId+"-left").css("width", (leftTableWidth))

    $("#"+gridId+"-wrapper").css('width', $("#"+gridId+"-wrapper").parent().outerWidth() - 103 - leftTableWidth);

    $(".virtual_scroll").css('width', $(".virtual_scroll").parent().outerWidth() - 103 - leftTableWidth);
    $(".virtual_scroll").css('margin-left', leftTableWidth+2);



    ///////////////////////////////////


    $("#"+gridId+"-wrapper0").css('width', $("#"+gridId+"-wrapper").outerWidth());
    $("#"+gridId+"-left0").css("width", (leftTableWidth));
    $("#"+gridId+"-left0 > thead > tr").empty();
    $("#"+gridId+"-left > thead > tr").find("th").each(function (indx, td) {

        let numberOfindex = indx + 1;

        let realWidth = $("#"+gridId+"-left > tbody tr:last-child td:nth-child("+numberOfindex+")").innerWidth();

        if(gridId == 'grid_table')


            if(indx == 0)
                var copy = "<th style='width: " + realWidth + "px; height: " + $(td).height() + "px' >" + $(td).html() + "</th>";
            else
                var copy = "<th style='width: " + realWidth + "px; height: " + $(td).height() + "px' class='sorting'>" + $(td).html() + "</th>";
        $("#"+gridId+"-left0 > thead > tr").append(copy);

    });


    $("#"+gridId+"0 > thead > tr").empty();

    //$("#"+gridId+" thead  tr").clone().appendTo($("#"+gridId+"0 thead")) ;
    $("#"+gridId+" > thead > tr").find("th").each(function (indx, th) {
        let numberOfindex = indx + 1;

        console.log(getWidth(th));

        let realWidth = getWidth(th);



        var copy = "<th style='width: " + realWidth + "px; height: " + $(th).height() + "px' class='sorting'>" + $(th).html() + "</th>";
        $("#"+gridId+"0 > thead > tr").append(copy);

    });

    $("#"+gridId+"-rigth0").css("width", 80);
    $("#"+gridId+"-rigth0 > thead > tr").empty();
    $("#"+gridId+"-rigth > thead > tr").find("th").each(function (indx, td) {

        var copy = "<th style='width: 80px; height: " + $(td).height() + "px' >" + $(td).html() + "</th>";
        $("#"+gridId+"-rigth0 > thead > tr").append(copy);

    });



}

export function getWidth(td) {
    return $(td).outerWidth()-24;
};