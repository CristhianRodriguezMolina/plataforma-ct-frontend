import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';

//API
import api from '../../services/api';

//Components
import LogicSequenceStudent from './logic-sequence/LogicSequenceStudent';
import MazeStudent from './maze/MazeStudent';


const StudentActivity = () => {

	const [activity, setActivity] = useState(null);
	const [inheritedActivity, setInheritedActivity] = useState(null);
	const [studentActivity, setStudentActivity] = useState(null);

	const [loading, setLoading] = useState(true);

	const { courseId, unitId, taskId, activityId } = useParams(); 

    useEffect(() => {

		const createStudentActivity = async () => {
			try {
				console.log("hi")
				//Create the student activity
				const createStudentActivityRes = await api.post("/api/student-activity", {
					studentId: localStorage.getItem("user_id"),
					courseId: courseId,
					unitId: unitId,
					taskId: taskId,
					activityId: activityId
				}, {
					headers: { 'x-access-token': localStorage.getItem('token') }
				});

				if (!createStudentActivityRes) {
					return;
				}
				setStudentActivity(createStudentActivityRes.data.savedStudentActivity);

			}
            catch (err) {
                if (err.response) {
                    console.log(err.response.data.message);
                }
                else {
					console.log('No encontrado')
                }
            }
		};

        const fetch = async () => {

				//Get logic sequence activity
                const activityRes = await api.get(`/api/activity/${activityId}`, {
                    headers: { 'x-access-token': localStorage.getItem('token') }
                });

                if (!activityRes) {
                    console.log('activity not found');
                    return;
                }
                setActivity(activityRes.data.activity);
				setInheritedActivity(activityRes.data.inheritedActivity);


                //GET student activity
                const studentActivityRes = await api.post("/api/student-activity/foreign", {
                    student: localStorage.getItem("user_id"),
                    course: courseId,
                    unit: unitId,
                    task: taskId,
                    activity: activityId
                }, {
                    method: 'GET',
                    headers: {
                        'x-access-token': localStorage.getItem('token')
                    }
                });

				console.log(studentActivityRes.data)
				if (studentActivityRes) {
					if(studentActivityRes.data.found) {

						if (studentActivityRes.data.studentActivity.length > 0) {
							setStudentActivity(studentActivityRes.data.studentActivity[0]);
						} else {
							console.log(1)
							createStudentActivity();
						}
					}
					else {
						console.log(2);
						createStudentActivity();
					}
				}
				console.log(activityRes.data)
				setLoading(false);
        };

        if (!activity) {
            fetch();
        }
    }, [activity]);

	return (
		<div>
			{!loading ?
				activity && inheritedActivity && studentActivity?

					activity.type === 'logic_sequence' ?

						<LogicSequenceStudent activity={activity} inheritedActivity={inheritedActivity} studentActivity={studentActivity}/>
						:
						activity.type === 'maze' ?

							<MazeStudent activity={activity} inheritedActivity={inheritedActivity} studentActivity={studentActivity}/>
							:
							<Redirect to='/unauthorized'/>

				:
				<Redirect to="/unauthorized" />
			 :
			''}
		</div>
	)
};

export default StudentActivity;
