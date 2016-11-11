
var submitButton = document.querySelector("button");
submitButton.textContent = "tEST";
var textField = document.querySelector("#matrix-text");
var testMatrix = [
  [2,3,7,3],
  [5,2,1,2],
  [7,4,9,1],
  [7,4,9,1],
  [7,4,9,1],
    ];

function solveFromBox(){
  console.log(textField.value);
  var matrix = matrixStringtoMatr(textField.value.split("\n"));
  console.log(matrix);
  gaussianElim(matrix);
  console.log(matrix);
}

submitButton.onclick =  solveFromBox;

function matrixStringtoMatr(eqnStrArr){
  var rows = eqnStrArr.length;
  var cols = eqnStrArr[0].split(",").length; 

  var matrix = [];
  for(var i = 0; i<rows; i++){
    var colStrs = eqnStrArr[i].split(",");
    var rowCol = [];
    for(var k = 0; k<colStrs.length;k++){
      rowCol.push(parseFloat(colStrs[k]));;
    }
    matrix.push(rowCol);
  }
  return matrix;
}

function rowMult(matrix, row, c){
  for(var i = 0; i<matrix[row].length; i++ ){
    matrix[row][i] = matrix[row][i] * c; 
  }
}

//adds rowB * c = rowA
function addMult(matrix,rowA,rowB,c){
  for(var i = 0; i<matrix[rowA].length; i++){
    matrix[rowA][i] = matrix[rowA][i] + c * matrix[rowB][i];
  }
}

function interchange(matrix, rowA,rowB){
  for(var i = 0; i<matrix[rowA].length; i++){
    var hold = matrix[rowA][i];
    matrix[rowA][i] = matrix[rowB][i];
    matrix[rowB][i] = hold;
  }
}

//[rows][cols]
function gaussianElim(matrix) {
  var cols = matrix[0].length;
  var rows = matrix.length;
  var pivotInd = 0; 
  for(var i = 0; i<cols; i++){
    //reduce each column so we only have 1 as a pivot and all zeroes
    for(var k = pivotInd; k<rows; k++){
      if(matrix[k][i] != 0){
        //we found a non zero value in this column.
        //swap it to the row of the pivot we're working on 
        interchange(matrix, pivotInd, k);
        //reduce this row to 1 
        var leadingVal = matrix[pivotInd][k];
        rowMult(matrix, pivotInd, 1/leadingVal);

        //now elminate values in other rows
        for(var z = 0; z<rows; z++){
          if(z == pivotInd) continue;
          leadingVal = matrix[z][i];
          if(leadingVal!=0){
            addMult(matrix,z,pivotInd,-leadingVal);
          }  
        }
        pivotInd++;
        break;
      }
    }
  }
}

gaussianElim(testMatrix);
