import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {simpleDate} from "../components/formDate"

function Menu({id, date, menu, ingredient, origin, people, calorie, location, schoolName, schoolCode}){
    const data = {
      date: date,
      menu: menu,
      ingredient : ingredient,
      origin : origin,
      people : people,
      calorie : calorie,
      location : location,
      schoolName : schoolName,
      schoolCode : schoolCode
    };

    return(
    <div className='menuList'>
        <div className="menuListDate"><Link to={`/menu/${id}`} state= {{state : data}}>{simpleDate(date)}</Link></div>
        <div className="menuListMenu">{menu.replace(/[^\u3131-\uD79D\s]|[\w\d]/g, ' ').replace(/ 미 /g, ' ').replace(/ 오전간식 /g, '(오전간식)')}</div>
    </div>
    )
}

Menu.propTypes = {
    id : PropTypes.string.isRequired,
    date : PropTypes.string.isRequired,
    menu : PropTypes.string.isRequired,
    //menu : PropTypes.arrayOf(PropTypes.string).isRequired,
    ingredient : PropTypes.string.isRequired,
    origin : PropTypes.string.isRequired,
    people : PropTypes.number.isRequired,
    calorie : PropTypes.string.isRequired,
    location : PropTypes.string.isRequired,
    schoolName : PropTypes.string.isRequired,
    schoolCode : PropTypes.string.isRequired,
};

export default Menu;