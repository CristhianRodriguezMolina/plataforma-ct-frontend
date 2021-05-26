import React from 'react'

// SCSS
import './titlecard.scss';

export default function TitleCard(props) {
    return (
        <div className="title-container d-flex justify-content-center align-items-center text-center" style={{backgroundColor: props.color}}>
            <div className="align-items-center" style={{width: "40%"}}>
                <h1>{props.title}</h1>
                <hr/>
            </div>                
        </div>
    )
}
