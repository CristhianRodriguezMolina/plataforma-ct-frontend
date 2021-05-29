import { GET_USER, GET_USER_COURSES } from '../types'

export default (state, action) => {
    const { payload, type } = action;

    switch (type) {
        case GET_USER:            
            break;

        case GET_USER_COURSES:        
            break;
    
        default:
            return state;
    }
};