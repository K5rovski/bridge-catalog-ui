import {NavLink} from 'react-router-dom';


function Navbar(){
	return (
			<nav>
		    <div className ='logo'>
		        <p>Logo</p>
		    </div>
		    <div>
		        <ul>
		            <li><NavLink to = '/home'>Home </NavLink></li>
		            <li><NavLink to = '/feature-request'>Feature Request</NavLink></li>
		            <li><NavLink to = '/create-role'>Create Role</NavLink></li>
		            <li><NavLink to = '/create-permission'>Create Permission</NavLink></li>

		         </ul>
		    </div>
		</nav>
	);

}

export default Navbar;