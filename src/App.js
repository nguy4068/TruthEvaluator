import React, {useState,useEffect} from "react";
import "./App.css";
import {MainPage} from './Pages/MainPage';
import {Header} from './Component/Header';
import { Button } from '@material-ui/core';
import {API} from 'aws-amplify';

function App() {
  const [todo, setTodo] = useState([]);
  const [displayName, setDisplayName] = useState("Hello");
  const [name, setName] = useState("");
  const [load, setLoad] = useState(false);
  const [expression, setExpression] = useState("");
  const [result,setResult] = useState([]);
  const [header,setHeader] = useState([]);
  const [width,setWidth] = useState([]);
  const [error,setError] = useState(null);
  const [body,setBody] = useState([]);
  const [autoFill, setAutoFill] = useState([]);
  const [convertedText, setConvertedText] = useState("");
  const [first, setFirst] = useState(null);
  const [second,setSecond] = useState(null);
  useEffect(()=>{
    document.getElementById('foobar').addEventListener('keyup', e => {
      console.log('Caret at: ', e.target.selectionStart)
      var character = expression[e.target.selectionStart];
      if (character === '('){
        setFirst(e.target.selectionStart);
        var track = e.target.selectionStart;
        var count = 1;
        while (count !== 0 && track < expression.length){
          if (expression[track] === ')'){
            count = count - 1;
          }
          if (expression[track] === '('){
            count = count + 1;
          }
        }
        if (track < expression.length){
          setSecond(track)
        }
        
      }
    })
  })
  const toggleChange = (i,j) =>{
    var tempR = result;
    if (result[i][j] === "T"){
        console.log("Here")
        tempR[i][j] = "F"
    }else{
        tempR[i][j] = "T"
    }
    setResult(tempR)
  }
  const insert = (value) =>{
      var temp = expression
      temp = temp + value
      setExpression(temp)
    
  }
  const testAPI = () =>{
    API.get('truthevaluatorAPI','/items',{
      'queryStringParameters': {
        'query': String(expression)
      }}).then(
      (data)=>{
        console.log(data);
        console.log(data.result);
        if (data.error !== undefined){
          setError(data.error)
        }else{
          setError(null)
          let first = data.result[0]
          let headerTemp = Object.keys(first)
          console.log(headerTemp )
          var reorderHeader = headerTemp.sort(function(a,b){return a.length-b.length});
          setHeader(reorderHeader)
          var tempWidth = [];
          for (var s of reorderHeader){
            var l = s.length*10 + 10;
            tempWidth.push(l);
          }
          console.log(tempWidth)
          setWidth(tempWidth);
          var bodyTemp = [];
          for (let r of data.result){
            var truth_values = []
            for (var b of reorderHeader){
              var v = r[b]
              if (v === 1){
                truth_values.push("T")
              }else{
                truth_values.push("F")
              }
            }
            bodyTemp.push(truth_values)
          }
          setResult(bodyTemp)
          
        }
      }
    );
  }
  const textConvert = () => {
    if (result){
      var col = header.length;
      var count = 0;
      var presentation = "|";
      var length = [];
      var bound = "";
      while (count < col){
        var exp = header[count];
        var l = exp.length+2;
        length.push(l);
        var track = 0;
        while (track < l){
          presentation = presentation + "-";
          track++;
        }
        presentation = presentation + "|";
        count++;

      }
      console.log(presentation);
      presentation = presentation + "\n";
      bound = presentation;
      var row = result.length + 1;
      var i = 0;
      var j = 0;
      while (i < row){
        presentation = presentation + "|";
        j = 0;
        while (j < col){
            var m = length[j]
            var n = 0;
            var value = "";
            if (i === 0){
              n = header[j].length;
              value = header[j];
            }else{
              n = result[i-1][j].length;
              value = result[i-1][j];
            }
            var remain = m - n;
            var left = parseInt(remain/2);
            var right = left;
            if (remain %2 === 1){
              left = left + 1;
            }
            var e = 0;
            while (e < left){
              presentation = presentation + " ";
              e++;
            }
            presentation = presentation + value;
            e = 0;
            while (e < right){
              presentation = presentation + " ";
              e++;
            }
            presentation = presentation + "|";
            j++;
        }
        presentation = presentation + "\n";
        console.log(presentation)
        i++;
      }
      presentation = presentation + bound;
      setConvertedText(presentation);
    }
  }
  const changeExpression = (event) =>{
    var prevValue = expression;
    var currentValue = event.target.value;
    var index = event.target.selectionStart;
    var l1 = prevValue.length;
    var l2 = currentValue.length;
    if (l2 > l1){
      var prev = currentValue[index-1];
      if (prev === '('){
        if (index === currentValue.length){
          currentValue = currentValue + ")";
        }else{
          var part1 = currentValue.substring(0,index-1);
          var part2 = currentValue.substring(index,l2);
          currentValue = part1 + "()" + part2;
        }
        event.target.selectionEnd = index;
      }
    }
    setExpression(currentValue);
    
    

  }
  const deleteResult = () =>{
    setResult([]);
    setConvertedText(null);
    setHeader([]);
  }
  const evaluate = (event) =>{
    testAPI();
    event.preventDefault()
  }
  return (
    <div className="App">
      <h1>Truth Table Evaluation</h1>
      <p>
        Welcome to truth table evaluation. Please use these following
        logical operation to receive your desire logical expression
      </p>
      <div style ={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
        <Button style={{margin:"10px"}} variant="contained" color="primary" onClick={() => {insert("|")}}  disableElevation>
          {'| for OR'}
        </Button>
        <Button style={{margin:"10px"}} variant="contained" color="primary" onClick={()=>{insert(">")}} disableElevation>
          {'> for IMPLY'}
        </Button>
        <Button style={{margin:"10px"}} variant="contained" color="primary" onClick={()=>{insert("^")}} disableElevation>
          {'^ for AND'}
        </Button>
        <Button style={{margin:"10px"}} variant="contained" color="primary" onClick={() => {insert("=")}} disableElevation>
          {'= for EQUIVALENT'}
        </Button>
        <Button style={{margin:"10px"}} variant="contained" color="primary" onClick={() => {insert("~")}} disableElevation>
          {'~ for NEGATE'}
        </Button>
        

      </div>
      <form onSubmit = {evaluate} style={{margin:"50px"}}>
        <label>
          Expression:
          <input type="text" value ={expression} name="name" id={"foobar"} onChange={changeExpression}/>
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div>
        {(error !== null) ? error:null}
      </div>
    <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
      <Button style={{margin:"10px"}} variant="contained" color="primary" onClick={() => {textConvert()}} disableElevation>
          {'Convert to text'}
      </Button>
      <div>
        {result.length > 0 ? <Button style={{margin:"10px"}} variant="contained" color="primary" onClick={() => {deleteResult()}} disableElevation>
          {'Delete Result'}
        </Button> : null}
      </div>
    </div>
    
    <div style={{display:"flex",flexDirection:"column"}}>
      <div>
        <h3>Converted text</h3>
        <pre>{convertedText}</pre>
      </div>
      <div style={{justifyContent:"center",margin:"50px"}}>
          <Header values={header} widthInfo={width}/>
          <MainPage display={result} widthInfo={width} change={toggleChange}/>
      </div>
    </div>
    
    </div>
  );
}

export default App;
