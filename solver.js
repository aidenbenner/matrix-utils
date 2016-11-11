
var submitButton = document.querySelector("#reduce-btn");
var detButton= document.querySelector("#det-btn");
var invButton= document.querySelector("#inv-btn");
var textField = document.querySelector("#matrix-text");
var answerText= document.querySelector("#answer-text");

var testMatrix = [
  [2,3,7,3],
  [5,2,1,2],
  [7,4,9,1],
  [7,4,9,1],
  [7,4,9,1],
];


function matrixToLatex(matrix){
  var str = "\\begin{bmatrix} ";
    for(var i = 0; i<matrix.length; i++){
      for(var k = 0; k<matrix[i].length;k++){
        if(k == matrix[i].length-1)
          str += matrix[i][k] + " "; 
        else
          str += matrix[i][k] + " & "; 
      }
      if(i != matrix.length - 1)
        str += "\\\\ ";
    }
  str += "\\end{bmatrix}";
  return str; 
}

function displayMatrix(matrix){
  answerText.textContent = matrixToLatex(matrix);
  MathJax.Hub.Typeset();
}

function displayMatrixEquation(matrix, matrixB){
  var matr1 = matrixToLatex(matrix);
  var matr2 = matrixToLatex(matrixB);
  var eroEqn = "  \\longrightarrow ";
  answerText.textContent = "$$" + matr1 + eroEqn + matr2 + " $$";
  MathJax.Hub.Typeset();
}

function solveFromBox(){
  solveFromBox(false, false);
}
function solveFromBox(getDet){
  solveFromBox(getDet, false);
}

function solveFromBox(getDet,getInv){
  var matrix = matrixStringtoMatr(textField.value.split("\n"));
  var matrixCopy = JSON.parse(JSON.stringify(matrix));
  var inv; 
  if(getInv){
    console.log("before");
    inv = gaussianElim(matrix,true,true);
    displayMatrixEquation(matrixCopy, matrix);

    console.log(inv);
    console.log("after");
  }
  else{

    var det = gaussianElim(matrix,true);
    if(getDet)
      console.log(det);
    else
      console.log(matrix);
  }  
}

submitButton.onclick =  solveFromBox;
detButton.onclick = function(){
  solveFromBox(true);
};
invButton.onclick = function(){
  solveFromBox(false,true);
};

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
function gaussianElim(matrix){
  gaussianElim(matrix, false, false);
}

function gaussianElim(matrix, findDet){
  gaussianElim(matrix, findDet, false);
}

function getIdentity(row, col){
  var identity = [];
  for(var i = 0; i<row; i++){
    var rowArr = [];
    for(var k = 0; k<row; k++){
      if(i == k)
        rowArr.push(1);
      else 
        rowArr.push(0);
    }
    identity.push(rowArr);
  }
  return identity;
}

function gaussianElim(matrix, findDet, findInverse) {
  var cols = matrix[0].length;
  var rows = matrix.length;
  var pivotInd = 0; 
  var det = 1; 
  var identity;
  if(findInverse){
    identity = getIdentity(rows,cols);
  }
  for(var i = 0; i<cols; i++){
    //reduce each column so we only have 1 as a pivot and all zeroes
    for(var k = pivotInd; k<rows; k++){
      if(matrix[k][i] != 0){
        //we found a non zero value in this column.
        //swap it to the row of the pivot we're working on 
        if(pivotInd != k){ 
          interchange(matrix, pivotInd, k);
          if(findInverse){
            interchange(identity, pivotInd, k);
          }
          det = det * -1;
        }
        //reduce this row to 1 
        var leadingVal = matrix[pivotInd][k];
        rowMult(matrix, pivotInd, 1/leadingVal);
        if(findInverse){
          rowMult(identity, pivotInd, 1/leadingVal);
        }
        det = det * leadingVal;

        //now elminate values in other rows
        for(var z = 0; z<rows; z++){
          if(z == pivotInd) continue;
          leadingVal = matrix[z][i];
          if(leadingVal!=0){
            addMult(matrix,z,pivotInd,-leadingVal);
            if(findInverse)
              addMult(identity,z,pivotInd,-leadingVal);
          }  
        }
        pivotInd++;
        break;
      }
    }
  }
  if(findInverse){
    if(det == 0){
      return null
    }
    return identity; 
  }
  if(findDet){
    return det;
  }
}

gaussianElim(testMatrix);
