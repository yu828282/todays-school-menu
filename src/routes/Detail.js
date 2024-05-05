import { Link, useLocation } from 'react-router-dom';
import {formatDate} from "../components/formDate"

function Detail(){
    //const {id} = useParams();//url 값을 반환하는 함수 (url의 id를 지정해 반환)
    
    const serverUrl = 'https://todays-school-menu.netlify.app';
    let { state } = useLocation();    
    console.log(state);
    
    let { schoolName } = state.state;
    let { date } = state.state;
    let { menu } = state.state;

    const formattedDate = `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(6, 8)}`;

    let kakaoText = formattedDate +' '+ schoolName + '의 식단은 ' + menu.replace(/\([^()]*\)/g, '').replace(/(<br>|<br\/>|<br \/>)/g, '\r\n').split('\r\n');

  const kakaoMessage = () => { 
    if (window.Kakao) {
      const kakao = window.Kakao;
      if (!kakao.isInitialized()) {
        kakao.init(process.env.REACT_APP_KEY_KAKAO_SHARE_API);
      }
        window.Kakao.Share.sendDefault({
        //container: '#kakaotalk-sharing-btn', 
        objectType: 'text',
        text:
            `🥗 ${kakaoText}`,
        link: {
            mobileWebUrl: serverUrl,
            webUrl: serverUrl //'http://localhost:3000/',
        },
        });
    };
    }

    return (
        <div className='sub-page'>
            <h2>{formatDate(state.state.date)} 식단표</h2>
            <div className='detailPart'>
                <div className='detailTitle'>학교명 : </div>
                <div className='detailContent'>&nbsp;{state.state.schoolName} </div>
            </div>
            <div className='detailPart'>
                <div className='detailTitle'>식단구성 : </div>
                <div className='detailContent'>
                    {state.state.ingredient.replace(/(<br>|<br\/>|<br \/>)/g, '\r\n').split('\r\n')
                    .map(item => (<div key={item}>&nbsp;{item} </div>))
                    }
                </div>
            </div>
            <div className='detailPart'>
                <div className='detailTitle'>식단표 : </div>
                <div className='detailContent'>
                    {state.state.menu.replace(/\([^()]*\)/g, '').replace(/(<br>|<br\/>|<br \/>)/g, '\r\n').split('\r\n')
                    .map(item => (<div key={item}>&nbsp;{item} </div>))
                    }
                </div>
            </div>
            <div className='detailPart'>
                <div className='detailTitle'>원산지 : </div>
                <div className='detailContent'>
                    {state.state.origin.replace(/(<br>|<br\/>|<br \/>)/g, '\r\n').split('\r\n')
                    .map(item => (<div key={item}>&nbsp;{item} </div>))
                    }
                </div>
            </div>            
            <div className='detailPart'>
                <div className='detailTitle'>칼로리 : </div>
                <div className='detailContent'>
                    &nbsp;{state.state.calorie}
                </div>
            </div>
            <div className='detailPart'>
             <div className='detailTitle'>대상 : </div>
                <div className='detailContent'>
                    &nbsp;{state.state.people} 인분
                </div>
            </div>
            <div className='kakao-share'>
                <button onClick={() => kakaoMessage()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16"> <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/> </svg>
                    &nbsp;오늘의 식단 공유
                </button>
            </div>       
            <button className='backBtn'><Link to={"/"}>홈 화면으로 돌아가기</Link></button>
        </div>
    )
}

export default Detail;