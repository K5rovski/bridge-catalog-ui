// From Chris Smith's "All Form Elements" pen: https://codepen.io/chris22smith/pen/pymBWL
const SEPARATOR = "|||";

function deleteParent(element){
// Loop through all list items, and hide those who don't match the search query
	let parent = element.parentElement;

	parent.parentElement.removeChild(parent);


}
function searchList(listElement) {
	// Declare variables
  var input, filter, ul, li, a, i, txtValue;
	input = document.getElementById('myInput');
	filter = input.value.toUpperCase();
	ul = document.getElementById(listElement);
	li = ul.getElementsByTagName('li');
	console.log(filter==="");
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
function deselectItem(e, hidden_elm_id){
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

function selectItem(elm, select_elm_id, hidden_elm_id){
	const item = elm.parentElement;
	const start_text = item.innerText.trim();
	const small_text = start_text.slice(0, start_text.indexOf(":"));
	const option = document.createElement('option');
	option.setAttribute('class', 'badge');
	option.innerText = small_text;
	option.style.display = 'inline-block';
	option.style.margin = '10px';
	option.style.padding = '8px';
	option.addEventListener('click', (e) =>deselectItem(e, hidden_elm_id))
	const select_elm = document.getElementById(select_elm_id);
	select_elm.append(option);
	const hidden_select = document.getElementById(hidden_elm_id);
	const select_value = hidden_select.getAttribute('value');
	hidden_select.setAttribute('value', select_value+ SEPARATOR+start_text);

	item.style.display = 'none';
	// console.log(small_text);
}


function updateRoleTypeRequireds(role_type_elm, permissions_input, role_label_input){
	const role_type = role_type_elm.value;
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

function updateText(text_elm, elm_print_id){
	const elm_print = document.getElementById(elm_print_id);
	elm_print.innerText = text_elm.value;
}

window.onload = function() {
	// printValue('rangeSlider', 'rangeValue');
}