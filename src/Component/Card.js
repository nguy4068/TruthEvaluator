import React ,{useState,useEffect}from 'react';
import {Cell} from './Cell'
export const Card = ({listStatement,width,handleChange,results}) =>{
    const [state,setState] = useState(listStatement ? listStatement : [])
    const [w, setW] = useState(width)
    useEffect(() =>{
        setState(listStatement)
        setW(width)
    })
    console.log(state)
    return (<div style={{display:"flex", flexDirection:"column"}}>
        {state.map((line,i)=>{
            return (<div style ={{display:"flex", flexDirection:"row"}}>

                {line.map((cell, j)=>{
                    return <div><Cell value={cell} header={false} widthBox={w[j]} i={i} j={j} handleC={handleChange} results={listStatement}/></div>
                })}
                </div>
            )
                
        })}
    </div>)
}