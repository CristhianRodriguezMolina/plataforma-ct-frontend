import { LOGOUT, SIGNIN } from '../types'

export default (state, action) => {
    const { payload, type } = action;

    switch (type) {
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