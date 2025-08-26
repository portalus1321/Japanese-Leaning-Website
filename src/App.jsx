import logo from './logo.svg';
import './App.css';
import Navbar from './components/navbar';
import { BrowserRouter as Router, Routes, Route,Navigate, json} from 'react-router-dom';
import MyPricing from './pages/HomeComps/pricing';

import Home from './pages/home';
import Features from './pages/HomeComps/Features';
import FAQS from './pages/HomeComps/FAQ';
import Learn from './pages/Learn';
import AI from './pages/LearnComps/AI';
import AIChat from './pages/LearnComps/AIcomps/Chat';
import Cards from './pages/LearnComps/cards';
import masterMind from './pages/LearnComps/masterMind';
import TypekitLoader from './utils/TPloader';
import MasterMind from './pages/LearnComps/masterMind';

import Profile from './pages/Profile';
import Dashboard from './pages/ProfileComps/Dashboard';
import Authorization from './pages/Authorization';
import Login from './pages/AuthComps/Login';
import Register from './pages/AuthComps/Register';
import Leaderboard from './pages/Leaderboard';

import Wpm from './pages/LearnComps/wpm';

import { useEffect,useState } from 'react';
import KanjiQuiz from './pages/LearnComps/Quiz';

function App() {
  const [token, setToken] = useState(false)


 if(token){
  sessionStorage.setItem('token',JSON.stringify(token))
 }
 useEffect(()=>{
     try {
              if (sessionStorage.getItem('token')) {
        let data = JSON.parse(sessionStorage.getItem('token'))
        setToken(data)
      }  
     } catch (error) {
          
     }

 },[])



   return (
    <div className="App">
      <TypekitLoader/>
      <Navbar token={token}/>
      <Router>
      <Routes>
         <Route path="/" element={<Navigate to="/home" replace />} />
         <Route path="/home" element={<Home />}>
              <Route path='Pricing' element={<MyPricing/>}/>
              <Route path='Features' element={<Features/>}/>
              <Route path='FAQs' element={<FAQS/>}/>
              <Route path='Learn' element={<FAQS/>}/>
         </Route>
         <Route path='Learn' element={<Learn/>}>
             <Route path='AI' element={<AI token={token}/>}>
                  <Route path=":id" element={<AIChat token={token} />} />
             </Route>   
             <Route path='Cards' element={<Cards token={token} />}/>
             <Route path='Quiz' element={<KanjiQuiz token={token} />}/>
             <Route path='MasterMind' element={<MasterMind/>}/>
             <Route path='wpm' element={<Wpm token={token}/>}/>            
         </Route>
         <Route path='Profile' element={<Profile />}>
              <Route path='Dashboard' element={<Dashboard token={token}/>}/>
         </Route>
         <Route path='Authorization' element={<Authorization/>}>
              <Route path='Register' element={<Register/>}/>
              <Route path='Login' element={<Login setToken={setToken}/>}/>
         </Route>
         <Route path='Leaderboard' element={<Leaderboard/>}>
         </Route>
       {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
       */}
      </Routes>
    </Router>
   
    </div>
  );
}

export default App;
