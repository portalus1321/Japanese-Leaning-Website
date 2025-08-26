import MyFooter from "../components/footer"
import { Link, Outlet } from 'react-router-dom';
import Register from "./AuthComps/Register";
const Authorization = () => {
   return <>
        <Outlet/>
    </>;

};

export default Authorization;