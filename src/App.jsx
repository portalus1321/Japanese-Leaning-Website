import logo from './logo.svg';
import './App.css';
import Navbar from './components/navbar';
import { BrowserRouter as Router, Routes, Route,Navigate, json} from 'react-router-dom';
import MyPricing from './pages/HomeComps/pricing';
import { supabase } from './utils/supabaseClient';

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
  const [log,setLog] = useState(false)
  const [session, setSession] = useState(null);


 if(token){
  sessionStorage.setItem('token',JSON.stringify(token))
 }
 if(log){
  sessionStorage.setItem('log',JSON.stringify(log))
 }

 async function saveLog(contributions) {
  if (!token?.user) return;

  try {
    const { data, error } = await supabase
      .from("Activity")
      .upsert(
        { id: token.user.id, contributions },
        { onConflict: ["id"] } // important: tells Supabase which column is unique
      )
      .select()
      .single();

    if (error) throw error;

    console.log("Saved log (upsert):", data);
    return data;
  } catch (err) {
    console.error("Error saving log:", err);
  }
}

 async function fetchlog(token){
    if(!token || !token.user){
      console.log('Waiting for token...');
      return; // Return early if token is not available
    }
    try {
      const { data, error } = supabase
        .from("Activity")
        .select('id,contributions')
        .eq('id', token.user.id)
      if (error) {
        throw error;
      }
      console.log("Fetched Log of user:", data);
      setLog(data);
      if(data == undefined || data == null || data.length === 0){
        console.log("no log data found, creating new log");
        let res = await saveLog('{}');
        return res;
      }
      return data;
    
    } catch (error) {
      console.error("Error fetching Log:", error);
      alert("Failed to load top players. Please try again later.");
    }
    
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

  useEffect(() => {
  if (token) {
   
    console.log("fetchlog run");
    console.log(fetchlog(token));
  }
 }, [token]);





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
