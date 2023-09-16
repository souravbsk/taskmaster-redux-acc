import { Navigate, useLocation } from 'react-router-dom';
import Loading from './Loading';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import auth from '../../utils/firebase.config';
import { setUser, toggleLoading } from '../../redux/features/user/userSlice';

const PrivateRoute = ({ children }) => {
  const { pathname } = useLocation();

  const {email,isLoading} = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth,(currentUser) => {
      console.log(currentUser);
      if(currentUser){
        dispatch(
          setUser({
            name: currentUser.displayName,
            email: currentUser.email
          })
        );
        dispatch(toggleLoading(false))
      }
      else{
        dispatch(toggleLoading(false))
      }
    })

    return () => unSubscribe()
  },[email,isLoading])



  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading && !email) {
    return <Navigate to="/login" state={{ path: pathname }} />;
  }

  return children;
};

export default PrivateRoute;
