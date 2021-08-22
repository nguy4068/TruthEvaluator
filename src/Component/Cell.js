import React, {useEffect,useState} from 'react'

export const Cell = ({value,header,widthBox,handleC,i,j,results}) =>{
    const [myValue, setMyValue] = useState(value)
    const [color,setColor] = useState((value === "T") ? "#87CEFA" : ((header === true) ? "#90EE90" : "#FFB6C1"))
    const [width,setWidth] = useState(widthBox)
    const [row,setRow] = useState(i)
    const [col,setCol] = useState(j)
    const handleChange = () =>{
        if (header === false){
            if (myValue === "T"){
                results[i][j] = "F"
                setMyValue("F")
                setColor("#FFB6C1")
            }else{
                results[i][j] = "T"
                setMyValue("T")
                setColor("#87CEFA")
            }

        }
        
    }
    useEffect(() =>{
        console.log("yes")
        if (header === true){
            setColor("#90EE90")
        }else{
            if (value === "F"){
                setColor("#FFB6C1")
                
            }else{
                setColor("#87CEFA")
            }
        }
        setMyValue(value)
        setWidth(widthBox)
        setRow(i)
        setCol(j)
    },[value,widthBox])
    return (<div style={{backgroundColor:color,border:"1px solid black",width:width, margin:"2px"}} onClick={handleChange}>
        {myValue}
    </div>)
}