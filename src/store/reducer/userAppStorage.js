import { LOGIN, FORCEUSERIN, LOGOUT,LOGIN_USER} from "../action/userAppStorage";


const initialState = {
    token: "",
    expiresIn: "",
    user: null,
    admin: null
}


export const userAuthReducer = (state = initialState, action) => {
    switch (action.type) {
     
        case LOGIN_USER:
            if (action.payload) {
                return {
                    ...state,
                    token: action.payload.token,
                    expiresIn: action.payload.expiresIn,
                    user: action.payload.user,
                }
            }
            break;
      case LOGOUT:
            if (action.payload) {
                return null; // if you want to clear the state completely
            }
            return state; // return the previous state if no payload
        // other cases...
        default:
            return state; // very important to always return state by default
    }

}