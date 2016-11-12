var submitButton = document.querySelector("#reduce-btn");
var detButton= document.querySelector("#det-btn");
var invButton= document.querySelector("#inv-btn");
var solveButton= document.querySelector("#solve-btn");
var textField = document.querySelector("#matrix-text");
var answerText= document.querySelector("#answer-text");

var testMatrix = [
  [2,3,7,3],
  [5,2,1,2],
  [7,4,9,1],
  [7,4,9,1],
  [7,4,9,1],
];

var precision = 5; 
function matrixToLatex(matrix){
  var str = "\\begin{bmatrix} ";
  for(var i = 0; i<matrix.length; i++){
    for(var k = 0; k<matrix[i].length;k++){
      var val = Math.round(Math.pow(10,precision) * matrix[i][k]) / Math.pow(10,precision); 
      if(k == matrix[i].length-1)
        str += val + " "; 
      else
        str += val + " & "; 
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

function displayMatrixEquation(matrix, matrixB, message){
  var matr1 = matrixToLatex(matrix);
  var matr2 = matrixToLatex(matrixB);

  var msg = ""; 
  if(message != undefined){
    msg = message;
  }

  var eroEqn = " \\xrightarrow{" + msg + "} ";
  answerText.textContent = "$$" + matr1 + eroEqn + matr2 + " $$";
  MathJax.Hub.Typeset();
}

function displayDetEquation(matrix, det, message){
  var matr1 = "det " + matrixToLatex(matrix);
  answerText.textContent = "$$" + matr1 + " = " + det + " $$";
  MathJax.Hub.Typeset();
}

function displayNotInvertible(matrix){
  var matr1 = matrixToLatex(matrix);
  answerText.textContent = "$$" + matr1 + " $$ is not invertible" + " ";
  MathJax.Hub.Typeset();
}

function solveFromBox(){
  solveFromBox(false, false);
}
function solveFromBox(getDet){
  solveFromBox(getDet, false);
}

function solveFromBox(getDet,getInv,solveAug){
  var matrix = matrixStringtoMatr(textField.value.split("\n"));
  var matrixCopy = JSON.parse(JSON.stringify(matrix));
  var inv; 
  if(getInv){
    inv = gaussianElim(matrix,true,true);
    if(inv == null){
      displayNotInvertible(matrixCopy); 
    }
    else{ 
      displayMatrixEquation(matrixCopy, inv,"inverse");
    }
    console.log(inv);
  }
  else if(solveAug){
    solveAugmented(matrix);
    displayMatrixEquation(matrixCopy, matrix);
  }
  else if (getDet){
    var det = gaussianElim(matrix,true);
    inv = gaussianElim(matrix,true,true);

    if(inv == null){
      displayNotInvertible(matrixCopy); 
    }
    else{ 
      displayDetEquation(matrixCopy,det);
    }  
  }  
  else{
    gaussianElim(matrix);
    displayMatrixEquation(matrixCopy, matrix);
  }
}

solveFromBox(false,true);
submitButton.onclick =  function(){
  solveFromBox(false,false);
};
detButton.onclick = function(){
  solveFromBox(true);
};
invButton.onclick = function(){
  solveFromBox(false,true);
};
solveButton.onclick = function(){
  solveFromBox(false,false,true);
};

function matrixStringtoMatr(eqnStrArr){
  var rows = eqnStrArr.length;
  var cols = eqnStrArr[0].split(",").length; 

  var matrix = [];
  for(var i = 0; i<rows; i++){
    var colStrs = eqnStrArr[i].split(",");
    var rowCol = [];
    if(colStrs.length != cols) continue;
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
  gaussianElim(matrix, false, false,false);
}

function gaussianElim(matrix, findDet){
  gaussianElim(matrix, findDet, false,false);
}

function solveAugmented(matrix){
  gaussianElim(matrix,false,false,true);
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

function gaussianElim(matrix, findDet, findInverse, isAugmented) {
  var cols = matrix[0].length;
  if(isAugmented != undefined) cols--; 
  console.log(findDet);
  var rows = matrix.length;
  var pivotInd = 0; 
  var det = 1; 
  var identity;
  if(findInverse != false || findDet != false){
    if(rows != cols){
      return null;
    }
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
  //multiply det 
  for(var i = 0; i<cols; i++){
    for(var k = 0; k<rows; k++){
      if(i != k) continue;
      det *= matrix[i][k];
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
