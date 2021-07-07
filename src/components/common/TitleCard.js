import React from 'react'

// SCSS
import './titlecard.scss';

import PropTypes from 'prop-types';


//Tooltip
import Tooltip from '@material-ui/core/Tooltip';

export default function TitleCard(props) {

    //Variables que llegan por parametro
    const { color, image, title, colorFont } = props;

    return (
        <div
            className="title-container"
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
            <div className={image ? 'title-overlay overlay' : 'title-overlay'}>
                <div className="align-items-center" >
                    <Tooltip enterDelay={200} enterNextDelay={200} title={title} aria-label={`${title}`}>
                        <h1 className="text-overflow-2" style={{ color: colorFont }}>{title}</h1>
                    </Tooltip>
                    <hr style={image ? { borderColor: colorFont } : {}} />
                </div>
            </div>
        </div>
    )
};

TitleCard.propTypes = {
    title: PropTypes.string,
    color: PropTypes.string,
    colorFont: PropTypes.string
}