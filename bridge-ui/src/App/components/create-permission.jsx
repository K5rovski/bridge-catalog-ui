import React from "react";
import {connString, SEPARATOR} from "../../utils/constants.js";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Funcs from "./func-component";


class CreatePermission extends React.Component {

    constructor(props) {
        super();
        this.state = {
            pid_latest_index: -1,
            roles: [],
            features: [],
            isSelectedAll: false,
            perm_name: '',
            perm_description: '',
            perm_field_id: '',
            perm_roles: null,
            perm_features: null,
        };
        this.permName = React.createRef();
        this.fullPid = React.createRef();
        const funcsContainer = (new Funcs());

        // 'permissions-input-div','role_label-div'
        this.updateText = funcsContainer.updateText.bind(this);
        this.selectFeature = funcsContainer.selectItem.bind(this);
        this.selectRole = funcsContainer.selectItem.bind(this);
        this.searchRoles = (new Funcs({searchInput: "search-roles-input",
            listElementId: 'roles-ul'})).searchList.bind(this);
        this.searchFeatures = (new Funcs({searchInput: "search-features-input",
            listElementId: 'features-ul'})).searchList.bind(this);
        // this.handleInputChange(event_data);
        // after select deselect call manually



        this.handleInputChange = funcsContainer.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        axios.get(connString.backendEndpoint + "/permission")
            .then(res => {
                const data = res.data;
                this.setState({
                    pid_latest_index: data.pid_latest_index,
                    roles: data.roles, features: data.features
                });
            }).catch(err => {
            toast.error('Db error! :(', {
                position: "top-right",
                autoClose: 3000,
            });

        });
    }
	handleSubmit(event) {
		event.preventDefault();

		const perm_data = {	perm_name: this.state.perm_name,
			perm_roles: this.state.perm_roles,
			perm_description: this.state.perm_description
		};

		console.log('in submit')
		axios.post(connString.backendEndpoint+"/permission", perm_data)
	.then(res => {
			toast.info('Written permission in DB :(', {
				position: "top-right",
				autoClose: 3000,
			});
		}).catch(err=> {

			toast.error('Db error! :(', {
				position: "top-right",
				autoClose: 3000,
			});

		});
	}


    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h1>Create/Edit Permission</h1>

                <div className="row col-3">
                    <div className="cell">
                        <p className="badge">
                            {this.state.pid_latest_index}
                        </p>
                    </div>
                    <div className="cell">
                        <p className="badge">
                            <span>{this.state.pid_latest_index}:&nbsp;</span>
                            <span id="full_pid" ref={this.fullPid}>
       </span>
                        </p>
                    </div>
                    <div className="input-text-section cell" id="in_full_pid">
                        <p className="line-item">
                            <input type="text" name="perm_name"
                                   id="perm_name" required onChange={this.handleInputChange}
                                   onKeyUp={e => {this.updateText(e, "full_pid") }} ref={this.permName}/>
                            <label htmlFor="perm_name">Permission Name</label>
                        </p></div>

                </div>
                <div className="row">
    <textarea name="perm_description" id="perm_description"
              style={{height: "150px", overflow: "auto"}}></textarea>
                    <label htmlFor="perm_description">Permission Description</label>
                </div>


                <div className="row col-2">
    <div id="roles-input-div" className="flex-col" >
    <h3>Select Permission Roles: </h3>
    <input type="hidden" id="roles-input" name="perm_roles" value=""  />
    <select id="select-roles" style={{width: "100%", height: "100px", overflow: "auto"}} multiple >
    </select>
		<button tabIndex="0" type="button" className={`${this.state.isSelectedAll ? "active" : ""} `}
				onClick={e => this.selectAllItems(e.target,
					'select-roles', 'roles-input', 'perm_roles') }>Select all</button>


    <div id="roles-row" className="row pad-20"
         style={{"maxHeight": "500px", overflow:"auto"}}>
    <input type="text" id="search-roles-input"
           onKeyUp={this.searchRoles} placeholder="Search Roles"
        style={{"marginTop": "20px"}} />
    <ul id="roles-ul"  style={{"maxHeight": "400px", overflow:"auto"}}>

    {this.state.roles.map(role => (

      <li id={role.role_id} key={role.role_id}>
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
            onClick={e => this.selectRole(e.target, 'select-roles', 'roles-input', 'perm_roles') } ></i>
          { role.full_roleId }</li>

          ))}
    </ul>
  </div>
    </div>

       <div id="features-input-div" className="flex-col" >
    <h3>Select Permission Features: </h3>
    <input type="hidden" id="features-input" name="perm_features" value=""  />
    <select id="select-features" style={{width: "100%", height: "100px", overflow: "auto"}} multiple >
    </select>
		<button tabIndex="0" type="button" className={`${this.state.isSelectedAll ? "active" : ""} `}
				onClick={e => this.selectAllItems(e.target,
					'select-features', 'features-input') }>Select all</button>


    <div id="features-row" className="row pad-20"
         style={{"maxHeight": "500px", overflow:"auto"}}>
    <input type="text" id="search-roles-input"
           onKeyUp={this.searchFeatures} placeholder="Search Features"
        style={{"marginTop": "20px"}} />
    <ul id="features-ul"  style={{"maxHeight": "400px", overflow:"auto"}}>

    {this.state.features.map(feature => (

      <li id={feature.fid} key={feature.fid}>
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
            onClick={e => this.selectFeature(e.target, 'select-features', 'features-input', 'perm_features') } ></i>
          { feature.full_id }</li>

          ))}
    </ul>
  </div>
    </div>


                </div>


                <div className="flex-row" style={{"justifyContent": "center"}}>
                    <button type="submit" tabIndex="0">Submit</button>
                </div>

                <ToastContainer/>

            </form>
        );
    }
}

export default CreatePermission;