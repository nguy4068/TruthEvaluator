import React, {useState,useEffect} from 'react';
import {Cell} from './Cell';
export const Header =({values,widthInfo})=>{
    const [value,setVal] = useState(values)
    const [w,setW] = useState(widthInfo)
    console.log(values)
    useEffect(() =>{
        setVal(values)
        setW(widthInfo)
    })
    return (
        <div style ={{display:"flex", flexDirection:"row",justifyContent:"center"}}>
            {value.map((title,i)=>{
                return(
                    <Cell value={title} header={true} widthBox={w[i]}/>
                )
            })}
        </div>
    )


}