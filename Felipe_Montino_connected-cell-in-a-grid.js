'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', inputStdin => {
    inputString += inputStdin;
});

process.stdin.on('end', _ => {
    inputString = inputString.replace(/\s*$/, '')
        .split('\n')
        .map(str => str.replace(/\s*$/, ''));

    main();
});

function readLine() {
    return inputString[currentLine++];
}

// Complete the connectedCell function below.
function connectedCell(matrix) {
     
    let regions = [];
    let regionsCount = 0;

    for(let n = 0; n < matrix.length; n++)
    {
        for(let m = 0; m < matrix[n].length; m++)
        {
            if(matrix[n][m] == "X")
            {
                continue;
            }
            else if(matrix[n][m] == 1)
            {  
                let currentRegionCount = 0;

                let totalRegion = validateCellsConnection(n, m, matrix, currentRegionCount);
                
                //Se não encontrou nenhuma conexão de célugar na região 
                //quer dizer que temos uma região com uma célula apenas
                if(totalRegion == 0)
                {
                    totalRegion++;
                }
                
                //A célula que começa a busca será contada 
                //durante a busca das outras células linkadas a ela
                matrix[n][m] = "X";

                //Atribui o total de células encontradas na região
                regions[regionsCount] = totalRegion;

                //Cria mais uma região
                regionsCount++;
            }
        }
    }

    let regionWithMoreCells = regions.reduce((a, b) => Math.max(a, b));
    
    return regionWithMoreCells;
}

function validateCellsConnection(lineCurrentCell, colCurrentCell, matrix, regionCount)
{ 
    //Obtem a celula acima da atual
    let currentCountRegion = getAndValidateCellRegionInTheMatrix(lineCurrentCell - 1,
                                                                 colCurrentCell, 
                                                                 matrix, 
                                                                 regionCount);

    //Obtem a celula acima da atual na diagonal esquerda 
    currentCountRegion = getAndValidateCellRegionInTheMatrix(lineCurrentCell - 1, 
                                                             colCurrentCell - 1, 
                                                             matrix, 
                                                             currentCountRegion);

    //Obtem a celula acima da atual na diagonal direita
    currentCountRegion = getAndValidateCellRegionInTheMatrix(lineCurrentCell - 1, 
                                                             colCurrentCell + 1, 
                                                             matrix, 
                                                             currentCountRegion); 

     //Obtem a celula ao lado esquedo da atual
     currentCountRegion = getAndValidateCellRegionInTheMatrix(lineCurrentCell, 
                                                              colCurrentCell - 1, 
                                                              matrix, 
                                                              currentCountRegion);

     //Obtem a celula ao lado direito da atual
     currentCountRegion = getAndValidateCellRegionInTheMatrix(lineCurrentCell, 
                                                              colCurrentCell + 1, 
                                                              matrix, 
                                                              currentCountRegion);

    //Obtem a celula abaixo da atual
    currentCountRegion = getAndValidateCellRegionInTheMatrix(lineCurrentCell + 1, 
                                                             colCurrentCell, 
                                                             matrix, 
                                                             currentCountRegion);

    //Obtem a celula abaixo da atual na diagonal esquerda
    currentCountRegion = getAndValidateCellRegionInTheMatrix(lineCurrentCell + 1, 
                                                             colCurrentCell - 1, 
                                                             matrix, 
                                                             currentCountRegion);

    //Obtem a celula abaixo da atual na diagonal direita
    currentCountRegion = getAndValidateCellRegionInTheMatrix(lineCurrentCell + 1, 
                                                             colCurrentCell + 1, 
                                                             matrix, 
                                                             currentCountRegion);

    return currentCountRegion;
}

function existsCell(lineCurrentCell, colCurrentCell, matrix)
{
    return matrix[lineCurrentCell] != undefined &&  
           matrix[lineCurrentCell][colCurrentCell] != undefined;
}

function getAndValidateCellRegionInTheMatrix(lineCurrentCell, 
                                             colCurrentCell, 
                                             matrix, 
                                             currentCountRegion)
{
    if(existsCell(lineCurrentCell, colCurrentCell, matrix))
    {       
        if(matrix[lineCurrentCell][colCurrentCell] == 1)
        {
            matrix[lineCurrentCell][colCurrentCell] = "X";
            currentCountRegion++;

            currentCountRegion = validateCellsConnection(lineCurrentCell, 
                                                         colCurrentCell, 
                                                         matrix, 
                                                         currentCountRegion);
        }
    }    

    return currentCountRegion;   
}


function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const n = parseInt(readLine(), 10);

    const m = parseInt(readLine(), 10);

    let matrix = Array(n);

    for (let i = 0; i < n; i++) {
        matrix[i] = readLine().split(' ').map(matrixTemp => parseInt(matrixTemp, 10));
    }

    let result = connectedCell(matrix);

    ws.write(result + "\n");

    ws.end();
}
