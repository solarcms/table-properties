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

    let leftTableWidth = $("#"+gridId+"-left > thead").width();



    /////////////// fixed table header

    $("#"+gridId+"-left").css("width", (leftTableWidth+2))

    $("#"+gridId+"-wrapper").css('width', $("#"+gridId+"-wrapper").parent().width() - 105 - leftTableWidth);
    $("#"+gridId+"-wrapper0").css('width', $("#"+gridId+"-wrapper").width());
    $(".virtual_scroll").css('width', $(".virtual_scroll").parent().width() - 105 - leftTableWidth);
    $(".virtual_scroll").css('margin-left', leftTableWidth);


    $("#"+gridId+"-left0").css("width", (leftTableWidth+2));
    $("#"+gridId+"-left0 > thead > tr").empty();
    $("#"+gridId+"-left > thead > tr").find("th").each(function (indx, td) {

        var copy = "<th style='width: " + $(td).width() + "px; height: " + $(td).height() + "px' class='sorting'>" + $(td).html() + "</th>";
        $("#"+gridId+"-left0 > thead > tr").append(copy);

    });

    $("#"+gridId+"0").css("width", $("#"+gridId+"").width());
    $("#"+gridId+"0 > thead > tr").empty();
    $("#"+gridId+" > thead > tr").find("th").each(function (indx, td) {


        var copy = "<th style='width: " + $(td).width() + "px; height: " + $(td).height() + "px' class='sorting'>" + $(td).html() + "</th>";
        $("#"+gridId+"0 > thead > tr").append(copy);

    });

    $("#"+gridId+"-rigth0").css("width", 87);
    $("#"+gridId+"-rigth0 > thead > tr").empty();
    $("#"+gridId+"-rigth > thead > tr").find("th").each(function (indx, td) {

        var copy = "<th style='width: 87px; height: " + $(td).height() + "px' >" + $(td).html() + "</th>";
        $("#"+gridId+"-rigth0 > thead > tr").append(copy);

    });

}