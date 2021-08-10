import React, { useState, useEffect } from 'react';
import { withRouter, Redirect, useParams } from 'react-router-dom';

//API
import api from '../../services/api';

//Components
import LogicSequenceStudent from './logic-sequence/LogicSequenceStudent';
import MazeStudent from './maze/MazeStudent';


const StudentActivity = (props) => {

	const [activity, setActivity] = useState(null);
	const [inheritedActivity, setInheritedActivity] = useState(null);
	const [studentActivity, setStudentActivity] = useState(null);

	const [loading, setLoading] = useState(true);

	const { view, courseId, unitId, taskId, activityId } = useParams(); 

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

				if (studentActivityRes) {
					if(studentActivityRes.data.found) {

						if (studentActivityRes.data.studentActivity.length > 0) {
							setStudentActivity(studentActivityRes.data.studentActivity[0]);
						} else {
							createStudentActivity();
						}
					}
					else {
						createStudentActivity();
					}
				}
				setLoading(false);
        };

		if (!activity) {
			fetch();
		}
		else {

			if(view === 'teacher') {
				if(activity.type === 'logic_sequence') {
					//Redirect to maze view for teachers or admins
					props.history.push(`/activity/logic-sequence/${activityId}`);
				}
				else if(activity.type === 'maze') {
					//Redirect to maze view for teachers or admins
					props.history.push(`/activity/maze/${activityId}`);
				}
				else if(activity.type === 'questionnaire') {
					//Redirect to questionnaire view for teacher or admins
				}
			}
		}

    }, [activity]);

	return (
		<div>
			{!loading ?

				view === 'teacher' || view === 'student' ?

					view === 'student' ?

						activity && inheritedActivity && studentActivity?

							activity.type === 'logic_sequence' ?

								<LogicSequenceStudent activity={activity} inheritedActivity={inheritedActivity} studentActivity={studentActivity}/>
								:
								activity.type === 'maze' ?

									<MazeStudent activity={activity} inheritedActivity={inheritedActivity} studentActivity={studentActivity}/>
									:
									<Redirect to='/unauthorized'/>

						:
						<Redirect to='/unauthorized'/>

					:
					""

				:
				<Redirect to="/unauthorized" />
			 :
			''}
		</div>
	)
};

export default withRouter(StudentActivity);
