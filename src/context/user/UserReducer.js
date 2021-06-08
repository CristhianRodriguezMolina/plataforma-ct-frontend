import { LOGOUT, SIGNIN } from '../types'

// eslint-disable-next-line
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