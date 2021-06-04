import { GET_USER, GET_USER_COURSES, LOGOUT, SIGNIN } from '../types'

export default (state, action) => {
    const { payload, type } = action;

    switch (type) {
        case GET_USER: 
            return {
                ...state,
                user: payload
            }

        case GET_USER_COURSES:     
            return {
                ...state,
                courses: payload
            }
            
        case SIGNIN:
            return {
                ...state,
                ...payload
            }
        
        case LOGOUT:
            return {
                ...state,
                ...payload
            }
            
        default:
            return state;
    }
};