import { useEffect } from "react";
import { useDispatch, } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../_actions/user_action"


function Auth(SpecificComponent, option, adminRoute = null){

  // option
   // null  => 아무나 출입 가능
   // true  => 로그인한 유저만 출입 가능
   // false => 로그인한 유저 출입 불가능

  function AuthenticationCheck () {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
      dispatch(auth()).then(response => {
        console.log(response)

        // 로그인하지 않은 상태
        if(!response.payload.isAuth){
          if(option){
            navigate('/login')
          }
        }
        // 로그인한 상태
        else{
          // Admin 아닌 사람이 Admin 페이지에 접속하려는 경우
          if(adminRoute && !response.payload.isAdmin){
            navigate('/')
          }
          else{
            // 로그인한 유저가 출입 불가능한 페이지에 접속하려는 경우
            if(!option){
              navigate('/')
            }
          }
        }
      })
      
    }, [dispatch, navigate])

    return <SpecificComponent/>
    
  } 

  return AuthenticationCheck;
}

export default Auth