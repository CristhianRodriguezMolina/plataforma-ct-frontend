import React, { useEffect, useState } from 'react'

// SCSS
import './titlecard.scss';

import PropTypes from 'prop-types';

export default function TitleCard(props) {

    //Variables que llegan por parametro
    const { color, image, title, colorFont } = props;

    return (
        <div
            className="title-container d-flex justify-content-center align-items-center"
            style={
                image ?
                    {
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }
                    :
                    {
                        backgroundColor: color
                    }
            }
        >
            <div className="align-items-center" >
                <h1 style={{ color: colorFont }}>{title}</h1>
                <hr />
            </div>
        </div>
    )
};

TitleCard.propTypes = {
    title: PropTypes.string,
    color: PropTypes.string,
    colorFont: PropTypes.string
}