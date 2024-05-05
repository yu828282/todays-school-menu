import { Routes, Route, Outlet } from 'react-router-dom'
import Home from './routes/Home.js';
import Detail from './routes/Detail.js';
import Login from './routes/Login.js';
import NavBar from './components/NavBar.js';
import Footer from './components/Footer.js';

const Layout = () => {
  return(
    <>
      <NavBar></NavBar>
      <br/>
      <Outlet></Outlet> 
      <Footer></Footer>
    </>
  )
}

 function App() {
  return(    
    <div>
      <Routes>
        <Route path="/" element={<Layout></Layout>}>
          <Route exact path={`${process.env.PUBLIC_URL}/`} element={<Home></Home>}> </Route>           {/* {process.env.PUBLIC_URL + "/"} */}
          <Route path="/menu/:id" element={<Detail></Detail>}></Route>
          <Route path="/menu-login" element={<Login></Login>}></Route>
          <Route path="*" element={ <h1 className='loader'>없는 페이지입니다. 😢</h1> } /> 
        </Route>
      </Routes>
    </div>
  )
 }


 export default App;