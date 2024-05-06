import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
// import app from "../firebase";

function NavBar(){

    const serverUrl = 'https://todays-school-menu.netlify.app';
    // const auth = getAuth(app);
    // const provider = new GoogleAuthProvider();  
    const {pathname} = useLocation(); //현재 위치 확인
    const navigate = useNavigate();
    const initialUserData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null; //로컬스토리지에 저장해 새로고침해도 로그인 상태 유지
    const [userData, setUserData] = useState(initialUserData);
    // useEffect(()=>{
    //     const unsubscribe = onAuthStateChanged(auth, (user) => { // 로그인 여부에 따라 페이지 이동
    //         if(!user){
    //             navigate("/login"); 
    //         }else if(user && pathname ==='/login'){
    //             navigate("/");
    //         }
    //     })
    //     return () => { //navigate는 useEffect 함수 내부에서 사용해야 잘 작동한다
    //         unsubscribe();
    //     }
    // }, [auth, pathname])

    // const handleAuth = () => {        
    //     signInWithPopup(auth, provider).then((result) => {
    //         setUserData(result.user);
    //         localStorage.setItem('userData' ,JSON.stringify(result.user));
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //     });
    // }
    // const handleLogout = () => {
    //     signOut(auth).then(()=> { 
    //     setUserData({})            
    //     localStorage.removeItem('userData');
    //     }).catch(error=> {
    //         alert(error.message);
    //     }) 
    // }


    //카카오 로그인
    const client_id = process.env.REACT_APP_KEY_KAKAO_SHARE_API;//javascript 키
    const redirect_uri = `${serverUrl}/menu-login`;

    const kakaoLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem('userData');
        setUserData(null)         
    }
    
    useEffect(()=> {            
        const changeLocation = () => { // 로그인 여부에 따라 페이지 이동, 동작하지 않는다... (버튼을 이용한 페이지이동은 잘 동작함)
            if(!userData){
                navigate("/menu-login"); 
            }else if(userData && pathname ==='/menu-login'){
                navigate("/");
            }
        }
        const handleNavigation = async () => {
            const search = new URLSearchParams(window.location.search);
            const code = search.get("code");
            if (code){
                await handlegGetToken(code);
            }
            changeLocation();
        };
    
        handleNavigation();
        return () => { } // Clean-up 작업
    }, [userData, pathname]) 

    const getToken = async (code) =>{  
        const accessToken = localStorage.getItem('access_token');        
        const param = new URLSearchParams({ 
            grant_type : "authorization_code",
            client_id : client_id, 
            redirect_uri :redirect_uri,
            code : code
        })
        if(code && !accessToken || accessToken === "undefined"){ //코드를 받았는데 로컬스토리지에는 토큰이 값이 없는 경우..
            const response = await fetch("https://kauth.kakao.com/oauth/token",{//아래 내용대로 요청을 보낸다
                method : "POST",
                headers : {
                    "Content-type" : "application/x-www-form-urlencoded;charset=utf-8"
                },
                body : param
            })
            const result = await response.json();
            return (result);
        }
        return ("");
    };

    const handlegGetToken = async (code) => {// 프론트에서 바로 카카오에게..
        const { access_token } = await getToken(code);
        if (access_token !== '{msg: "this access token does not exist", code: -401}'){
            localStorage.setItem('access_token', access_token);
        }

        const response = await fetch("https://kapi.kakao.com/v2/user/me",{
            method : "GET",
            headers : {
                "Authorization" : `Bearer ${access_token}`,
                "Content-type" : "application/x-www-form-urlencoded;charset=utf-8"
            }
        });
        const result = await response.json();
        localStorage.setItem('userData' ,JSON.stringify(result));
        setUserData(result)
    };

    return(  
    <nav id="nav1">
        <a href={"/"}>Today's Menu</a>
        {/* <ul>{pathname === '/login' ? (<li><span onClick={handleAuth}>구글로그인</span></li>) : <li><img src={userData.photoURL} alt="user"></img><span onClick={handleLogout}>로그아웃</span></li>}</ul> */}
        <ul>
            {!userData ? (<li><a href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`}>로그인</a></li>) 
            :<li>
                <div className="dropdown">
                    <img className="profile" src={userData?.kakao_account.profile.thumbnail_image_url} alt="user profile"></img>
                    <div className="dropdown-content">
                        <a onClick={kakaoLogout} href={`https://kauth.kakao.com/oauth/logout?client_id=${client_id}&logout_redirect_uri=${redirect_uri}`} >로그아웃</a>
                    </div>
                </div>
            </li> 
            }
        </ul>
    </nav>
    )
};

export default NavBar;