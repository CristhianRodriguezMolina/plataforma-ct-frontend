import React from 'react'

// SCSS
import './course.scss';

export default function CourseCard(props) {
    return (
        <div className="course-card m-4 p-3">
            <h1 className="h5 text-left">CT course</h1>
            <hr className="mx-2"/>
            <img src={props.image} alt="CourseImage"/>
            <div className="info mt-3">
                <p className="text-left m-0">You are going on <b>Unit 2</b>  due <b>March 25</b></p>
                <p className="text-left m-0">It has <b>30</b> students</p>
            </div>
        </div>
    )
}
