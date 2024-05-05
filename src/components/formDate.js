export function formatDate(dateString) {
    const year = parseInt(dateString.slice(0,4));
    const month = dateString.slice(4,6);
    const week = ["일", "월", "화", "수", "목", "금", "토"]; // (0: 일요일, 1: 월요일, ..., 6: 토요일)
    
    const date = new Date(year, parseInt(month) - 1, parseInt(dateString.slice(6,8)));  
    const day = date.getDate().toString().padStart(2, '0');
    const dayOfWeek = week[date.getDay()]; // 요일 문자열 배열에서 요일 추출
    return `${year}년 ${month}월 ${day}일 (${dayOfWeek}요일)`;
  };

  export function simpleDate(dateString) {
    const year = parseInt(dateString.slice(0,4));
    const month = dateString.slice(4,6);
    const week = ["일", "월", "화", "수", "목", "금", "토"]; // (0: 일요일, 1: 월요일, ..., 6: 토요일)
    const date = new Date(year, parseInt(month) - 1, parseInt(dateString.slice(6,8)));  
    const dayOfWeek = week[date.getDay()]; // 요일 문자열 배열에서 요일 추출
    const printDate = `${dateString.slice(0, 4)}/${dateString.slice(4, 6)}/${dateString.slice(6, 8)}`;

    return `${printDate} (${dayOfWeek})`;
  };