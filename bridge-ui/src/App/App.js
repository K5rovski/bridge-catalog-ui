import '../assets/css/App.css';
import Nav from "./components/nav";
import Home from "./components/home"
import Feature from "./components/feature-request"
import Role from "./components/create-role"
import { BrowserRouter, Route } from "react-router-dom";

function App() {
 return (
    <BrowserRouter>
      <div className="App">
        <Nav />
        <Route exact path = '/' component = {Home}></Route>
        <Route path = '/home' component = {Home}></Route>
        <Route  path = '/feature-request' component = {Feature}></Route>
        <Route  path = '/create-role' component = {Role}></Route>
      </div>
    </BrowserRouter>
  );
}

export default App;
