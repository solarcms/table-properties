export function moveCursorToEnd(e) {
    var index = e.target.value.length;
    e.target.setSelectionRange(index, index);
}