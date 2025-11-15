export const FORCEUSERIN = "FORCEUSERIN";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const LOGIN_USER = "LOGIN_USER";



export const login = (data) => async (dispatch, getState) => {
  try {
    const response = await fetch("https://learnvault-backend.onrender.com/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    //https://learnvault-backend.onrender.com

    const result = await response.json();

    console.log(result);

    if (response.status === 201) {
     
      // Dispatch to Redux
      dispatch({
        type: LOGIN_USER,
        payload: {
          user: result.response.user,
          userToken: result.response.token,
          userExpiresIn: result.response.expiresIn,
        },
      });

      return { bool: true, url: "/dashboard", message: "Login successful" };
    }

    // Handle specific failure status codes
    if ([300, 401, 404].includes(response.status)) {
      return { bool: false, url: "/verification", message: result.response || "Please verify your account" };
    }

    // Default fallback
    return { bool: false, message: result.response || "Unexpected error" };

  } catch (err) {
    return { bool: false, message: err.message || "Network error" };
  }
};


//https://learnvault-backend.onrender.com


export const signup = (data) => async () => {
  try {
    const response = await fetch("https://learnvault-backend.onrender.com/api/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    switch (response.status) {
      case 200:
        return { bool: true, url: "login", message: "Signup successful." };
      case 409:
        return { bool: false, message: "User already exists" };
      case 400:
        return { bool: false, message: "Invalid signup details" };
      default:
        return { bool: false, message: result.response || "Unexpected error" };
    }
  } catch (err) {
    return { bool: false, message: err.message };
  }
};




export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT });
};
