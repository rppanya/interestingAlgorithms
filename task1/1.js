const elem = document.querySelector('#table');

function createTable(parent, n) {
    let fc = parent.firstChild;
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

//тут нужно написать функцию, расчитывающую h, например расстояние по прямой между двумя клетками


//в эту функцию нужно будет передать массив map в виде матрицы смежности графа, построенного на основе карты
// h - эвристическая оценка расстояния между точками(точно меньше фактического расстояния)
const aStar = function (map, h, start, finish) {
    let distances = []; //массив с расстояниями от старта до всех вершин
    for (let i=0; i<map.length; i++) distances[i]=Number.MAX_VALUE;
    distances[start] = 0;

    let priorities = []; //массив с элементами, которые нужно посетить
    for (var i=0; i<map.length; i++) priorities[i]=Number.MAX_VALUE;
    priorities[start]=h[start][finish];

    let visited = []; //массив с посещенными вершинами

    let previous = []; //для каждой вершины будем хранить предыдущую в пути
    previous[start]=-1;

    while(true) {

        //среди непосещенных узлов ищем узел с наибольшим приоритетом (наименьшим значением)
        var lowestPriority = Number.MAX_VALUE;
        var lowestPriorityIndex = -1;
        for (let i=0; i<priorities.length; i++) {
            if (priorities[i] < lowestPriority && !visited[i]) {
                lowestPriority = priorities[i];
                lowestPriorityIndex = i;
            }
        }
        if (lowestPriorityIndex === -1) {
            //все вершины посещены, пути нет
            return -1;
        } else if (lowestPriorityIndex === finish) {
            return previous;
        }

        for (let i=0; i<map[lowestPriorityIndex].length; i++) {
            if (map[lowestPriorityIndex][i] !== 0 && !visited[i]) {
                if (distances[lowestPriorityIndex]+map[lowestPriorityIndex][i] < distances[i]) {
                    distances[i] = distances[lowestPriorityIndex] + map[lowestPriorityIndex][i];
                    priorities[i] = distances[i] + h[i][finish];
                }
                previous[i]=lowestPriorityIndex;
            }
        }
        visited[lowestPriorityIndex]=true;
    }
}