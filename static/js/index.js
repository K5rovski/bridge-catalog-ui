// From Chris Smith's "All Form Elements" pen: https://codepen.io/chris22smith/pen/pymBWL

function deleteParent(element){
	let parent = element.parentElement;
	parent.parentElement.removeChild(parent);

}


// function hoverChange(element){
// 	if (element.classList)
// 	const classList = element.classList.add('bi-circle-fill');
//
// }

function printValue(sliderID, textbox) {
	 var x = document.getElementById(textbox);
	 var y = document.getElementById(sliderID);
	 x.value = y.value;
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


	  // Loop through all list items, and hide those who don't match the search query
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

function makeBadge(text, parent){
	parent.insertItemBefore()
}

function updateText(text_elm, elm_print_id){
	const elm_print = document.getElementById(elm_print_id);
	elm_print.innerText = text_elm.value;
}

window.onload = function() {
	// printValue('rangeSlider', 'rangeValue');
}