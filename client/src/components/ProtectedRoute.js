import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMessage } from "./MessageProvider";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../apicalls/users";
import { SetUser } from "../redux/usersSlice";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import Navigation from "./Navigation";

function ProtectedRoute({ children }) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const message = useMessage();
  
  // Use a ref to track if the component is mounted
  const isMountedRef = useRef(true);
  
  // Use a ref to prevent duplicate API calls
  const isLoadingRef = useRef(false);
  
  // Keep track of last auth check time to prevent excessive API calls
  const lastAuthCheckRef = useRef(0);

  // Memoize the getUser function to prevent recreating it on each render
  const getUser = useCallback(async () => {
    const now = Date.now();
    // Throttle auth checks to once every 30 seconds at most
    if (now - lastAuthCheckRef.current < 30000) {
      setIsUserLoggedIn(true);
      return;
    }
    lastAuthCheckRef.current = now;
    
    // Prevent duplicate API calls
    if (isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      dispatch(ShowLoading());
      
      const response = await getUserInfo();
      
      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return;
      
      dispatch(HideLoading());
      isLoadingRef.current = false;
      
      if (response.success) {
        // Use a timestamp to defer the state update slightly for better UI responsiveness
        setTimeout(() => {
          if (isMountedRef.current) {
            dispatch(SetUser(response.data));
            setIsUserLoggedIn(true);
          }
        }, 0);
      } else {
        // Use setTimeout to defer non-critical UI updates
        setTimeout(() => {
          if (isMountedRef.current) {
            message.error(response.message);
          }
        }, 0);
        
        localStorage.removeItem("token");
        setIsUserLoggedIn(false);
        navigate("/login");
      }
    } catch (error) {
      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return;
      
      dispatch(HideLoading());
      isLoadingRef.current = false;
      
      // Use setTimeout to defer non-critical UI updates
      setTimeout(() => {
        if (isMountedRef.current) {
          message.error(error.message || "Something went wrong");
        }
      }, 0);
      
      localStorage.removeItem("token");
      setIsUserLoggedIn(false);
      navigate("/login");
    }
  }, [dispatch, message, navigate]);

  // Use a separate effect for authentication check to improve code organization
  useEffect(() => {
    // If user is already in state, no need to fetch again
    if (user) {
      setIsUserLoggedIn(true);
      return;
    }
    
    // Check for token
    if (localStorage.getItem("token")) {
      getUser();
    } else {
      navigate("/login");
    }
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMountedRef.current = false;
    };
  }, [getUser, navigate, user]);

  // Return a loading placeholder during authentication check
  if (!isUserLoggedIn) {
    return (
      <div className="auth-loading">
        {/* Empty div as placeholder - the global loader will show */}
      </div>
    );
  }
  
  // Render the navigation with children once authenticated
  return (
    <Navigation>
      {children}
    </Navigation>
  );
}

export default React.memo(ProtectedRoute);
