import React from 'react'

// SCSS
import './course.scss';

// COMPONENTS

// Icono Delete
import DeleteIcon from '@material-ui/icons/Delete';

// Icono
import Icon from '@material-ui/core/Icon';

// Button 
import Button from '@material-ui/core/Button';

export default function CourseCard({ course, image }) {

    const deleteCourse = () => {

    }

    return (
        <div className="course-card m-4 p-3">
            <div className="d-flex justify-content-between">
                <h1 className="h5 text-left">{course.name}</h1>
                <Button                
                    color="secondary"
                    startIcon={<DeleteIcon />}
                ></Button>
            </div>
            <hr className="mx-2"/>
            <img src={image} alt="CourseImage"/>
            <div className="info mt-3">
                <p className="text-left m-0">You are going on <b>{course.actual_unit}</b>  due <b>{course.due_date}</b></p>
                <p className="text-left m-0">It has <b>{course.students}</b> students</p>
            </div>
        </div>
    )
}
