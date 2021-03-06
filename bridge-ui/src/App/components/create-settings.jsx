import React from "react";
import {connString, SEPARATOR} from "../../utils/constants.js";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Funcs from "./func-component";


class CreateSetting extends React.Component{
	 constructor(props) {
        super();
        this.state = {
            features: [],
            isSelectedAll: false,
            sid_latest_index: -1,
            setting_name: '',
            setting_description: '',
            setting_field_id: '',
            setting_features: null,
            setting_admin_group: '',
            setting_admin_subgroup: ''
        };
        this.settingName = React.createRef();
        this.fullSid = React.createRef();
        this.settingDescription = React.createRef();
        this.settingFeatures = React.createRef();
        this.settingFieldId = React.createRef();
        this.settingAdminGroup = React.createRef();
        this.settingAdminSubGroup = React.createRef();

        const funcsContainer = (new Funcs());

        // 'permissions-input-div','role_label-div'
        this.updateText = funcsContainer.updateText.bind(this);
        this.selectFeature = funcsContainer.selectItem.bind(this);
        this.deselectItem = funcsContainer.deselectItem.bind(this);

        this.searchFeatures = (new Funcs({searchInput: "search-features-input",
            listElementId: 'features-ul'})).searchList.bind(this);
        // after select deselect call manually


        this.deleteParent = funcsContainer.deleteParent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        axios.get(connString.backendEndpoint + "/setting")
            .then(res => {
                const data = res.data;
                this.setState({
                    sid_latest_index: data.sid_latest_index,
                    features: data.features
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

		const setting_data = {
		    setting_name: this.settingName.current.value,
            setting_description: this.settingDescription.current.value,
            setting_features: this.settingFeatures.current.value,}
        //
        //     setting_field_id: this.settingFieldId?.current.value,
        //     setting_admin_group: this.settingAdminGroup,
        //     setting_admin_subgroup: this.settingAdminSubGroup,
        //     setting_sid: this.state.sid_latest_index
		// };

		console.log('in submit', setting_data)
		axios.post(connString.backendEndpoint+"/setting", setting_data)
	.then(res => {
			toast.info('Written setting in DB :(', {
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
                <h1>Create/Edit Setting</h1>

                <div className="row col-3">
                    <div className="cell">
                        <p className="badge">
                            {this.state.sid_latest_index}
                        </p>
                    </div>
                    <div className="cell">
                        <p className="badge">
                            <span>{this.state.sid_latest_index}:&nbsp;</span>
                            <span id="full_sid" ref={this.fullSid}>
       </span>
                        </p>
                    </div>
                    <div className="input-text-section cell" id="in_full_sid">
                        <p className="line-item">
                            <input type="text" name="setting_name"
                                   id="setting_name" required
                                   onKeyUp={e => {this.updateText(e, "full_sid") }} ref={this.settingName}/>
                            <label htmlFor="setting_name">Setting Name</label>
                        </p></div>

                </div>
                <div className="row">
    <textarea name="setting_description" id="setting_description"
              style={{height: "150px", overflow: "auto"}} ref={this.settingDescription}></textarea>
                    <label htmlFor="setting_description">Setting Description</label>
                </div>


    <div id="features-input-div" className="flex-col" >
    <h3>Select Setting Features: </h3>
    <input type="hidden" id="features-input" name="setting_features" value="" ref={this.settingFeatures}  />
    <select id="select-features" style={{width: "100%", height: "100px", overflow: "auto"}} multiple >
    </select>
		<button tabIndex="0" type="button" className={`${this.state.isSelectedAll ? "active" : ""} `}
				onClick={e => this.selectAllItems(e.target,
					'select-features', 'features-input', 'setting_features') }>Select all</button>


    <div id="features-row" className="row pad-20"
         style={{"maxHeight": "500px", overflow:"auto"}}>
    <input type="text" id="search-features-input"
           onKeyUp={(e) =>
               this.searchFeatures('search-features-input', 'features-ul')} placeholder="Search Features"
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
            onClick={e => this.selectFeature(e.target, 'select-features',
                'features-input', 'setting_features') } ></i>
          { feature.fullFid }</li>

          ))}
    </ul>
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

export default CreateSetting;