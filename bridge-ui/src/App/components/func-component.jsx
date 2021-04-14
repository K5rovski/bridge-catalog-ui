import {SEPARATOR} from "../../utils/constants";


class FuncComponent{

    constructor(props) {
    this.searchInput = props ? props.searchInput : null;
    this.listElementId = props ? props.listElementId : null;
    // this.selectItem =
    }

    selectAllItems(elm, select_elm_id, hidden_elm_id){

    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        console.log(name, value)
        this.setState({
            [name]: value
        });
    }
    updateText(e, fullIdHTMLId){
        const fullId = document.getElementById(fullIdHTMLId)
	fullId.innerText = e.target.value;
}
    deleteParent(element){
// Loop through all list items, and hide those who don't match the search query
	let parent = element.parentElement;
	parent.parentElement.removeChild(parent);
}
    deselectItem(e, hidden_elm_id, input_name){
	const elm = e.target;
	const pid_elm_id = elm.innerText;
	const item = document.getElementById(pid_elm_id)
	item.style.display = 'block';
	elm.parentElement.removeChild(elm);
	const hidden_elm = document.getElementById(hidden_elm_id);
	const hidden_value = hidden_elm.getAttribute("value");
	const new_value = hidden_value.replace(SEPARATOR+item.innerText.trim(),"");
	hidden_elm.setAttribute("value", new_value);
	const event_data = {target: {value: new_value, type: 'hidden',
		 name: input_name}}
    return event_data;
	// deleteParent(x_elem);

}
 selectItem(elm, select_elm_id, hidden_elm_id, input_name){
	const item = elm.parentElement;
	const start_text = item.innerText.trim();
	const small_text = start_text.slice(0, start_text.indexOf(":"));
	const option = document.createElement('option');
	option.setAttribute('class', 'badge');
	option.innerText = small_text;
	option.style.display = 'inline-block';
	option.style.margin = '10px';
	option.style.padding = '8px';
	option.addEventListener('click', (e) => this.deselectItem(e, hidden_elm_id, input_name))
	const select_elm = document.getElementById(select_elm_id);
	select_elm.append(option);
	const hidden_select = document.getElementById(hidden_elm_id);
	const select_value = hidden_select.getAttribute('value');
	hidden_select.setAttribute('value', select_value+ SEPARATOR+start_text);

	item.style.display = 'none';
	const event_data = {target: {value: hidden_select.getAttribute('value'),
			type: 'hidden', name: input_name}}
    return event_data;
	// console.log(small_text);
}

searchList() {
	// Declare variables
  var input, filter, ul, li, a, i, txtValue;
	input = document.getElementById(this.searchInput);
	filter = input.value.toUpperCase();
	ul = document.getElementById(this.listElementId);
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

}

export default FuncComponent;