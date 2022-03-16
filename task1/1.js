var elem = document.querySelector('#table');
createTable(elem, 3, 5);
function createTable(parent, cols, rows) {
    var table = document.createElement('table');
    for (var i=0; i<rows; i++) {
        var tr = document.createElement('tr')
        for (var j=0; j<cols; j++) {
            var td = document.createElement('td')
            table.appendChild(td);
        }
        table.appendChild(tr);
    }
    parent.appendChild(table);
}