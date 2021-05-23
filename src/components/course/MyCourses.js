import React from 'react'

// SCSS
import './course.scss';

// COMPONENTS

// Course Card
import CourseCard from './CourseCard';

export default function MyCourses() {
    return (
        <div>
            <div className="title-container-mycourses d-flex justify-content-center align-items-center">
                <div className="align-items-center" style={{width: "40%"}}>
                    <h1>My Courses</h1>
                    <hr/>
                </div>                
            </div>
            <div className="d-flex flex-wrap">
                <CourseCard
                    image="https://i.blogs.es/8c3c21/pcbuild2/450_1000.jpg"
                />
                <CourseCard
                    image="https://i.blogs.es/8c3c21/pcbuild2/450_1000.jpg"
                />
                <CourseCard
                    image="https://i.blogs.es/8c3c21/pcbuild2/450_1000.jpg"
                />
                <CourseCard
                    image="https://i.blogs.es/8c3c21/pcbuild2/450_1000.jpg"
                />
            </div>
        </div>
    )
}
