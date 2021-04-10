import React from "react";
import {connString, SEPARATOR} from "../../utils/constants.js";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class CreateRole extends React.Component {
	constructor(props){
		super();
		this.state = {
			rid_latest_index: -1,
			permissions: [],
			role_name: '',
			role_type: '',
			role_label: '',
			role_scope: null,
		};
		this.roleName = React.createRef();
		this.fullRid = React.createRef();
		this.listElement = React.createRef();

		// 'permissions-input-div','role_label-div'
		this.updateText = this.updateText.bind(this);
		this.updateRoleTypeRequireds = this.updateRoleTypeRequireds.bind(this);
		this.selectItem = this.selectItem.bind(this);
		this.searchList = this.searchList.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);

	}
	componentDidMount() {
    axios.get(connString.backendEndpoint+"/create-role")
      .then(res => {
        const data = res.data;
        this.setState({ rid_latest_index:data.rid_latest_index,
        				permissions:data.permissions });
      }).catch(err=> {
			toast.error('Db error! :(', {
			position: "top-right",
			autoClose: 3000,
			});

      });
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.role_name);
    event.preventDefault();
  }
    handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }


	updateText(e){
	this.fullRid.current.innerText = e.target.value;
}
deleteParent(element){
// Loop through all list items, and hide those who don't match the search query
	let parent = element.parentElement;
	parent.parentElement.removeChild(parent);
}
deselectItem(e, hidden_elm_id){
	const elm = e.target;
	const pid_elm_id = elm.innerText;
	const item = document.getElementById(pid_elm_id)
	item.style.display = 'block';
	elm.parentElement.removeChild(elm);
	const hidden_elm = document.getElementById(hidden_elm_id);
	const hidden_value = hidden_elm.getAttribute("value");
	const new_value = hidden_value.replace(SEPARATOR+item.innerText.trim(),"");
	hidden_elm.setAttribute("value", new_value);
	// deleteParent(x_elem);

}
 selectItem(elm, select_elm_id, hidden_elm_id){
	const item = elm.parentElement;
	const start_text = item.innerText.trim();
	const small_text = start_text.slice(0, start_text.indexOf(":"));
	const option = document.createElement('option');
	option.setAttribute('class', 'badge');
	option.innerText = small_text;
	option.style.display = 'inline-block';
	option.style.margin = '10px';
	option.style.padding = '8px';
	option.addEventListener('click', (e) => this.deselectItem(e, hidden_elm_id))
	const select_elm = document.getElementById(select_elm_id);
	select_elm.append(option);
	const hidden_select = document.getElementById(hidden_elm_id);
	const select_value = hidden_select.getAttribute('value');
	hidden_select.setAttribute('value', select_value+ SEPARATOR+start_text);

	item.style.display = 'none';
	// console.log(small_text);
}
 updateRoleTypeRequireds(role_type){
 	const permissions_input='permissions-input-div', role_label_input='role_label-div';
	// const role_type = e.target.value;
	let do_permissions=false,do_label=false;

	if (role_type==='Owner'){
		do_label = true;
		do_permissions = true;
	}else if (role_type==='LE'){
		do_label = true;
	} else if (role_type==='Admin'){
		do_permissions = true;
	}
	if (do_permissions){
		const permissions_elm = document.getElementById(permissions_input);
		const permissions_elm_input = document.getElementById(permissions_input.replace('-div', ''));
		permissions_elm_input.setAttribute("required", "");
		permissions_elm.style.display = 'block';
	} else {
		const permissions_elm_input = document.getElementById(permissions_input.replace('-div', ''));
		permissions_elm_input.removeAttribute("required");
	}
	if (do_label){
		const label_elm = document.getElementById(role_label_input);
		const label_elm_input = document.getElementById(role_label_input.replace('-div', ''));
		label_elm_input.setAttribute("required", "");
		label_elm.style.display = 'block';
	} else {
		const label_elm_input = document.getElementById(role_label_input.replace('-div', ''));
		label_elm_input.removeAttribute("required");
	}

	// console.log(role_type_elm);
}
searchList() {
	// Declare variables
  var input, filter, ul, li, a, i, txtValue;
	input = document.getElementById('myInput');
	filter = input.value.toUpperCase();
	ul = this.listElement.current // document.getElementById(this.listElement);
	li = ul.getElementsByTagName('li');
	// console.log(filter==="");
	if (filter===""){
	  for (i=0;i<li.length;i++){
		li[i].style.display = "block";
	}


  } else {
// console.log(item);
	  for (i = 0; i < li.length; i++) {
		  // a = li[i].getElementsByTagName("a")[0];
		  txtValue = li[i].innerText;
		  if (txtValue && txtValue.toUpperCase().indexOf(filter) > -1) {
			  li[i].style.display = "";
		  } else {
			  li[i].style.display = "none";
		  }

	  }
  }

}
render(){
  return (
  <form onSubmit={this.handleSubmit}>
  <h1>Create/Edit Role</h1>

  <div className="row col-3">
  <div className="cell">
   <p className="badge">
      {this.state.rid_latest_index}
   </p>
    </div>
       <div className="cell" >
           <p className="badge">
           <span>{ this.state.rid_latest_index }:&nbsp;</span>
            <span id="full_rid" ref={this.fullRid}>
       </span>
           </p>
       </div>
        <div className="input-text-section cell" id="in_full_rid">
            <p className="line-item">
                <input type="text" name="role_name"
                 id="role_name" required onChange={this.handleInputChange}
                 onKeyUp={this.updateText} ref={this.roleName} />
                <label htmlFor="role_name">Role Name</label>
</p>        </div>

  </div>
  <div className="row">
    <textarea name="role_description" id="role_description" 
    style={{height: "150px", overflow: "auto"}}></textarea>
    <label htmlFor="role_description">Role Description</label>
  </div>
<div className="row col-2 pad-20">
     <div className="flex-col" style={{"marginLeft": "50px"}}>
         <h3>Choose Scope</h3>

<div className="cell flex-row" style={{"maxHeight": "300px"}} >
    <p>
    <input type="radio" required name="role_scope" 
    id="scope_room" value="room" />
    <label htmlFor="scope_room">Room</label>
        </p>

    <p className="badge font-small" >Room</p>
</div>
    <div className="cell flex-row" style={{"maxHeight": "300px"}}>
        <p>
    <input type="radio" name="role_scope" 
    id="scope_global" value="global" />
    <label htmlFor="scope_global">Global</label>
        </p>
        <span className="badge font-small">Global</span>
</div>

   </div>

    <div className="cell">
          <h3>  <label htmlFor="role_type">Choose Role Type:</label> </h3>
        <p className="badge ">
{/*            <input data-list="CSS, JavaScript, HTML, SVG, ARIA, MathML"
                   id="lista" list="role_type" name="role_type"  required data-multiple
                   onChange={this.updateRoleTypeRequireds} />*/}


        <input id="lista" list="role_type" name="role_type" 
        required 
               onChange={e=> this.updateRoleTypeRequireds(e.target.value)} />
                <datalist id="role_type">
                  <option value="Owner" />
                  <option value="Admin" />
                  <option value="LE" />
                </datalist>
        </p>

</div>
</div>

<div className="row col-2">
    <div id="permissions-input-div" className="flex-col" style={{"display": "none"}}>
    <h3>Select Role Permissions: </h3>
    <input type="hidden" id="permissions-input" name="permissions" value="" />
    <select id="select-permissions" style={{width: "100%", height: "100px", overflow: "auto"}} multiple >
    </select>
    <div id="permissions-row" className="row pad-20"
         style={{"maxHeight": "500px", overflow:"auto"}}>
    <input type="text" id="myInput"
           onKeyUp={this.searchList} placeholder="Search Permissions"
        style={{"marginTop": "20px"}} />
    <ul id="permissions-ul" ref={this.listElement} style={{"maxHeight": "400px", overflow:"auto"}}>

    {this.state.permissions.map(permission => (
          
      <li id={permission.PID} key={permission.PID}>
          <i className="bi-x-circle"
             onMouseEnter={ e => {
             {/*e.target.classList.replace('bi-x-circle','bi-x-circle-fill'); */}
			 e.target.classList.toggle('red');}}
             onMouseLeave={e=>{
             	e.target.classList.toggle('red');  
				{/*e.target.classList.replace('bi-x-circle-fill', 'bi-x-circle');*/}
			}}
          onClick={e => this.deleteParent(e.target)}></i>
          <i className="bi-circle"
            onMouseEnter={e=> 
          	e.target.classList.replace('bi-circle','bi-circle-fill')}
             onMouseLeave={e => 
             	e.target.classList.replace('bi-circle-fill', 'bi-circle')}
            onClick={e => this.selectItem(e.target, 'select-permissions', 'permissions-input') } ></i>
          { permission.PID +": "+permission.name }</li>

          ))}
    </ul>
  </div>
    </div>
  <div id="role_label-div" className="input-text-section" style={{"marginLeft": "10px", 
  			width: "80%", display: "none" }}>
      <h3>Write Role Label:</h3>
 <input type="text" name="role_label" id="role_label" />
 <label htmlFor="role_label">Role Label</label>
  </div>
</div>

<div className="flex-row" style={{"justifyContent": "center"}}>
  <button type="submit" tabIndex="0">Submit</button>
    </div>

<ToastContainer />

</form>

);
}

}

export default CreateRole;