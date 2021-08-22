import React from 'react';
import { Card } from '../Component/Card';

export const MainPage = ({display,widthInfo,change}) => {
    return (
    <div style={{display:"flex",justifyContent:"center"}}>
        <Card listStatement={display} width={widthInfo} handleChange={change}/>
    </div>
    )
}