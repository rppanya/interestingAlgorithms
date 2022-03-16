const elem = document.querySelector('#table');

function createTable(parent, n) {
    var fc = parent.firstChild;
    while(fc) {
        parent.removeChild(fc);
        fc = parent.firstChild;
    }
    const table = document.createElement('table');
    for (let i=0; i<n; i++) {
        const tr = document.createElement('tr')
        for (let j=0; j<n; j++) {
            const td = document.createElement('td')
            table.appendChild(td);
        }
        table.appendChild(tr);
    }
    parent.appendChild(table);
}
