import React from 'react'

// SCSS
import './titlecard.scss';

import PropTypes from 'prop-types';

export default function TitleCard(props) {
    return (
        <div className="title-container d-flex justify-content-center align-items-center" style={{backgroundColor: props.color}}>
            <div className="align-items-center" >
                <h1>{props.title}</h1>
                <hr/>
            </div>                
        </div>
    )
};

TitleCard.propTypes = {
    title: PropTypes.string,
    color: PropTypes.string
}