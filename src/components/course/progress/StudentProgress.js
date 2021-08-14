import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

//SCSS
import './StudentProgress.scss';


// API
import api from '../../../services/api';


//COMPONENTS

//MATERIAL UI ACCORDION
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

//Material ui icons
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

//Tooltip
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

const StudentProgress = props => {

    const [studentActivities, setStudentActivities] = useState(null);

    const classes = useStyles();

    useEffect(async () => {
        if (!studentActivities) {
            try {
                // get the progress of all students
                let response = await api.post("/api/student-activity/foreign", {
                    course: props.course._id,
                    unit: props.unit._id
                }, {
                    headers: { 'x-access-token': localStorage.getItem('token') }
                });
                if (response) {
                    setStudentActivities(response.data.studentActivity);
                }
            }
            catch (e) {
                if (e.response) {
                    console.log('e.response.data.message');
                    console.log(e.response.data.message);
                }
                console.log('e');
                console.log(e);
            }
        }
    }, [studentActivities]);


    const renderStudentProgress = (student, taskId) => {
        const items = [];
        let tempActivities = props.taskActivities.filter((taskActivity) => taskActivity.task === taskId);
        tempActivities.sort((a, b) => {
            return a.position - b.position;
        });
        let tempStudentActivities = studentActivities.filter((studentActivity) => studentActivity.student === student._id);

        if (tempStudentActivities.length > 0) {
            for (let i = 0; i < tempActivities.length; i++) {
                let studentActivity = tempStudentActivities.find(studentActivity => studentActivity.activity === tempActivities[i].activity);

                if (studentActivity) {
                    if (studentActivity.complete) {
                        items.push(
                            <Tooltip enterDelay={200} enterNextDelay={200} title={i + 1} aria-label={`${i + 1}`}>
                                <div className="activity-item-progress">
                                    <div className="activity-task-view-progress active" />
                                </div >
                            </Tooltip>
                        );
                    }
                    else {

                        items.push(
                            <Tooltip enterDelay={200} enterNextDelay={200} title={i + 1} aria-label={`${i + 1}`}>
                                <div className="activity-item-progress">
                                    <div className="activity-task-view-progress" />
                                </div >
                            </Tooltip>
                        );
                    }
                }
                else {

                    items.push(
                        <Tooltip enterDelay={200} enterNextDelay={200} title={i + 1} aria-label={`${i + 1}`}>
                            <div className="activity-item-progress">
                                <div className="activity-task-view-progress" />
                            </div >
                        </Tooltip>
                    );
                }
            }
        }
        else {

            for (let i = 0; i < tempActivities.length; i++) {
                items.push(
                    <Tooltip enterDelay={200} enterNextDelay={200} title={i + 1} aria-label={`${i + 1}`}>
                        <div className="activity-item-progress">
                            <div className="activity-task-view-progress" />
                        </div >
                    </Tooltip>
                );
            }
        }
        return items;
    }
    const checkCompletedTask = (student, taskId) => {
        let tempActivities = props.taskActivities.filter((taskActivity) => taskActivity.task === taskId);
        let tempStudentActivities = studentActivities.filter(studentActivity => studentActivity.student === student._id && studentActivity.task === taskId && studentActivity.complete);

        if (tempStudentActivities) {
            if (tempStudentActivities.length !== tempActivities.length) {
                return <CancelIcon className='incompleted-task-icon' />
            }
            else {
                return <CheckCircleIcon className='completed-task-icon' />
            }
        }
        else {
            return <CancelIcon className='incompleted-task-icon' />
        }
    }

    return (
        <div className="student-progress-container">
            {props.taskActivities && studentActivities ?
                props.unit.tasks.map((task) => {
                    return <div className={classes.root}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >

                                <Typography className={classes.heading}>{task.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography component="div" style={{ width: '100%' }}>
                                    <div>
                                        <table className="student-progress-by-tasks">
                                            <thead>
                                                <tr>
                                                    <th className="name-field-th">Estudiante</th>
                                                    <th className="activities-field-th">Actividades</th>
                                                    <th className="completed-field-th">Completado</th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                {props.students ?
                                                    props.students.map((student) => {
                                                        return <tr>
                                                            <Tooltip enterDelay={200} enterNextDelay={200} title={`${student.last_name} ${student.first_name}`} aria-label={`${student.last_name} ${student.first_name}`}>
                                                                <td className="student-name-field-td">{student.last_name} {student.first_name}</td>
                                                            </Tooltip>
                                                            <td className="student-tasks-view-td">
                                                                <div className="student-progress-items-container scrollable">
                                                                    {renderStudentProgress(student, task._id)}
                                                                </div>
                                                            </td>

                                                            <td className="completed-field-td">{checkCompletedTask(student, task._id)}</td>
                                                        </tr>
                                                    })
                                                    : ""}
                                            </tbody>
                                        </table>


                                    </div>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>

                })
                : ""}

        </div>
    )
};
export default StudentProgress;
