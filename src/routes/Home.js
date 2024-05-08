import React, { useEffect, useState } from 'react';
import axios from 'axios'
import schoolList from '../json/schoolInfo.json'
import { Link } from 'react-router-dom';

function Home(){
    const [items, setItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const week = ["일", "월", "화", "수", "목", "금", "토"]; // (0: 일요일, 1: 월요일, ..., 6: 토요일)
    const [selectLocation, setSelectLocation] = useState("");
    const [searchName, setSearchName] = useState([]); //추천 검색어
    const [schoolCode, setSchoolCode] = useState("");  
    const [subscribe, setSubscribe] = useState("");  
    
    const schoolApiKey = process.env.REACT_APP_SCHOOL_API_KEY;

    const fetchData = async () => {
      try {
        const apiUrl = 'https://open.neis.go.kr/hub/mealServiceDietInfo';
        const response = await axios.get(apiUrl, {
          params: {
           KEY : schoolApiKey,
           Type : "json",
           pIndex : 1,
           pSize : 100,
           ATPT_OFCDC_SC_CODE : selectLocation,
           SD_SCHUL_CODE : schoolCode,
           MLSV_YMD : selectedYear.toString() + (selectedMonth).toString().padStart(2, '0')
          },
        })
        setItems(response.data);
        setLoading(false);
       
        console.log(response.data);          
        sessionStorage.setItem("schoolCode", schoolCode);
        sessionStorage.setItem("selectLocation", selectLocation);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
   
   const findSchoolName = (input) => {   
    return schoolList.filter(item => item.SD_SCHUL_CODE === input)[0].SCHUL_NM;
  };
  
   const findSchoolCode = (input) => {   
     return schoolList.filter(item => item.SCHUL_NM === input)[0].SD_SCHUL_CODE;
   };

   const findSchoolLocation = (input) => {   
     return schoolList.filter(item => item.SCHUL_NM === input)[0].ATPT_OFCDC_SC_CODE;
   };

   const findDishByDate = (date, items) => {
    if(items.mealServiceDietInfo?.length > 1){
      for (let i = 0; i < items.mealServiceDietInfo[1]?.row.length; i++) {
        if (date.toString().padStart(2, '0') === items.mealServiceDietInfo[1].row[i].MLSV_TO_YMD.slice(-2)) {
          return items.mealServiceDietInfo[1].row[i];
        }
      }
    }
      return "";
  };
  // 오늘 날짜가 몇 번째 주에 해당하는지 반환합니다.
  function getCurrentWeekNumber() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const firstWeekNumber = Math.ceil((firstDayOfMonth.getDay() + 1) / 7);
    return firstWeekNumber;
  }

  function printDays(){
    const days = []; //전체 날짜
    const weekDays = []; //주수 맞추기
      // 이전 월의 마지막 날()
    const lastDayOfPreviousMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth) -1, 0);
      // 이전 월의 마지막 주의 마지막 일요일
    const lastSundayOfPreviousMonth = (new Date(
      lastDayOfPreviousMonth.getFullYear(),
      lastDayOfPreviousMonth.getMonth(),
      lastDayOfPreviousMonth.getDate() - lastDayOfPreviousMonth.getDay()));    
     // 현재 월의 마지막 날
    const lastDayOfMonth = (new Date(parseInt(selectedYear), parseInt(selectedMonth), 0));

    //표시해야 할 다음 월 수
    const firstSatOfNextMonth = 6- (new Date(parseInt(selectedYear), parseInt(selectedMonth), 0)).getDay();
 
    for(let i=lastSundayOfPreviousMonth.getDate(); i < lastDayOfPreviousMonth.getDate() +1; i++){
      days.push(i);
    }

    for(let i=1; i < lastDayOfMonth.getDate() +1; i++){
      let menus = "";
      menus = findDishByDate(i, items);

      const data = {
        date: menus.MLSV_YMD,
        menu: menus.DDISH_NM,
        ingredient : menus.NTR_INFO,
        origin : menus.ORPLC_INFO,
        people : menus.MLSV_FGR,
        calorie : menus.CAL_INFO,
        location : menus.ATPT_OFCDC_SC_CODE,
        schoolName : menus.SCHUL_NM,
        schoolCode : menus.SD_SCHUL_CODE
      };

      days.push(
        <React.Fragment key={i}>
          {menus ? (
            <Link to={`/menu/${menus.MLSV_YMD}`} state= {{state : data}}>
              {i} 
              <br/> 
              {menus.DDISH_NM.replace(/\([^()]*\)/g, '').replace(/(<br>|<br\/>|<br \/>)/g, '\r\n').split('\r\n')} 
            </Link>
          ) : (
            <div>{i}</div>
          )}
        </React.Fragment>
        );
    }              


    for(let i = 1; i < firstSatOfNextMonth + 1; i++){
      days.push(i)
    }
    for (let i = 0; i < days.length; i += 7) {
      weekDays.push(days.slice(i, i + 7));
    }      
    
    return weekDays;
  };

   // 년도 변경 이벤트 핸들러
   const handleYearChange = (event) => {
     setSelectedYear(parseInt(event.target.value));
   };
 
   // 월 변경 이벤트 핸들러
   const handleMonthChange = (event) => {
     setSelectedMonth(parseInt(event.target.value));
   };   

  // 추천 검색어를 표시해주는 핸들러
  const handleSearchChange = (event) => {  
    const findSchoolName = (input) => {   
      return schoolList.filter(item => item.SCHUL_NM.includes(input));
    };
    setSearchName(findSchoolName(event.target.value));
  };

  //추천 검색어 클릭 시 메뉴 변경 핸들러
  const handleNameButton = (inputValue) => {
    setSchoolCode(findSchoolCode(inputValue));
    setSelectLocation(findSchoolLocation(inputValue))
    sessionStorage.setItem("schoolCode", findSchoolCode(inputValue));
    sessionStorage.setItem("selectLocation", findSchoolLocation(inputValue));
  };
  
  //즐겨찾기 관련
  const makeSubscribe = () => {     
    const userEmail = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).kakao_account.email : null; 
    const data = {
      name : findSchoolName(schoolCode),
      code: schoolCode,
      location: selectLocation
    };
    localStorage.setItem(userEmail ,JSON.stringify(data));
    setSubscribe(data.name);
  };
  const deleteSubscribe = () => {     
    const userEmail = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).kakao_account.email : null; 
    localStorage.removeItem(userEmail);
    setSubscribe("");
    alert("즐겨찾기가 해제되었습니다.");
  };

  // 검색
  const handleSubmit  = (event) => {
    event.preventDefault();
    const inputValue = event.target.querySelector('input').value;
    if(schoolList.filter(item => item.SCHUL_NM === inputValue).length > 1){
      setSchoolCode(findSchoolCode(inputValue));
      setSelectLocation(findSchoolLocation(inputValue));
    }
  };
 
   useEffect(() => {  

    const schoolCodeSession = sessionStorage.getItem('schoolCode');
    const selectLocationSession = sessionStorage.getItem('selectLocation');
    const userEmail = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).kakao_account.email : null; 
    const subscribeInfo = localStorage.getItem(userEmail) ? JSON.parse(localStorage.getItem(userEmail)) : null; 
    
    if(subscribeInfo) {
      setSubscribe(subscribeInfo.name);
      setSchoolCode(subscribeInfo.code);
      setSelectLocation(subscribe.location);
    }
    if(schoolCodeSession){ 
      setSchoolCode(schoolCodeSession) 
    }else if(subscribeInfo){
      setSchoolCode(subscribeInfo.code)
    }else{
      setSchoolCode("7091414")
    }
    if(selectLocationSession){   
      setSelectLocation(selectLocationSession) 
    }else if(subscribeInfo){
      setSelectLocation(subscribeInfo.location) 
    }else{      
      setSelectLocation("B10") 
    };

    fetchData();

   }, [selectedYear, selectedMonth, schoolCode, subscribe])
 
     return (
      <div className='main-page'>
         {loading ? (<div>로딩중...</div>) : (
        <>    
       <div className='mySub'>즐겨찾기 : 
          {subscribe.length > 1 ? ( <span onClick={()=>deleteSubscribe()}> {subscribe} ❌</span>) : (<span> 없음</span>)}
      </div>      
      <div className='searchLine'>
        <div className='line'>
          <select id="year" value={selectedYear} onChange={handleYearChange}>
            {Array.from({ length: 4 }, (_, index) => index + 2021).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <label htmlFor="year"> 년도 </label>
        <select id="month" value={selectedMonth} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
            <option key={month} value={month}>{month}</option>
          ))} 
        </select>
        <label htmlFor="month"> 월 </label>
        </div>
        <form onSubmit={handleSubmit}>
          <input id="inputField" placeholder='학교명을 검색해주세요' onChange={handleSearchChange} />
          <button type='submit'>🔍︎</button>
        </form>
        <div className='recommend'>
          <ul>{searchName.map((item, index) => ( 
            index < 5 && <li key={index}>
              <button onClick={() => handleNameButton(item.SCHUL_NM)}>{item.SCHUL_NM} ({item.LCTN_SC_NM})</button>
            </li> ))}
          </ul>     
        </div>
      </div> {/* 검색창 종료 */}
      <div className='calendar-top'>
        <button onClick={() => {
          if(selectedMonth === 1) {
            setSelectedMonth(12)
            setSelectedYear(selectedYear - 1)
          }else{
            setSelectedMonth(selectedMonth - 1)
          }
          }}>&laquo;
        </button>
        <h2 className='calendar-top-date'>{selectedYear}년 {selectedMonth}월 </h2>
        <button onClick={() => {
          if(selectedMonth === 12){
            setSelectedMonth(1)
            setSelectedYear(selectedYear + 1)
          }else{
            setSelectedMonth(selectedMonth + 1)
          }
          }}>&raquo;
        </button>
      </div> {/*calendar-top 종료 */}
      <div>
        <div className='subInfo'>
          {Array.isArray(items.mealServiceDietInfo) && items.mealServiceDietInfo.length > 1 ? 
            <span>🏫({items.mealServiceDietInfo[1].row[0].ATPT_OFCDC_SC_NM.slice(0,2)}){items.mealServiceDietInfo[1].row[0].SCHUL_NM}의 식단표&nbsp;</span> : (
              <span>{findSchoolName(schoolCode)} 식단표를 불러오지 못했습니다😢&nbsp;</span>
            )}   
          {(subscribe === findSchoolName(schoolCode) ?
            <button className='subscribe-btn' onClick={deleteSubscribe}> ⭐ 즐겨찾기 중 </button>
            : <button className='subscribe-btn' onClick={makeSubscribe}> ⭐ 즐겨찾기 설정 </button>
        )}  
          </div>
        <table>
          <thead>
            <tr>
              {week.map((day, index) => (<th key={index}>{day}</th>))}
            </tr>
          </thead>
            <tbody>
              {printDays().map((days, indexs) => (
                <tr key={indexs} className={indexs === getCurrentWeekNumber() && selectedYear === new Date().getFullYear() && selectedMonth === (new Date().getMonth() + 1)  ? 'todaysWeek' : ''}>
                  {days.map((day, index) => (
                  <td key={index} className={ index === 0 ? 'sun' : index === 6 ? 'sat' : index=== new Date().getDay() ? 'weekday overflow today' : 'weekday overflow'}>
                    {day}
                  </td> 
                  ))}
                </tr>
              ))}
            </tbody>
        </table>
      </div>
        </>
        )}
    </div>
    );
  }
export default Home;