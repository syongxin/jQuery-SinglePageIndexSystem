var rowsToShow = jQuery('#selectRow').val();

// window.onload = loadData(rowsToShow); //jQuery(document).ready(...)
jQuery(document).ready(loadData(rowsToShow));

function loadData(rowsToShow) {
  if (localStorage.length === 0) {
    jQuery.ajax({
      "type": "GET",
      "url": "data.json",
      success: function(data) {
        if (data) {
          localStorage.setItem('object', JSON.stringify(data));

          getHTML(rowsToShow, data);
        }
      }
    });
  } else {

    var retrieved_obj = localStorage.getItem('object');
    var obj = JSON.parse(retrieved_obj);
    if (obj.length < rowsToShow) {
      rowsToShow = obj.length;
    } else if (rowsToShow === "") {
      rowsToShow = obj.length;
    }
    getHTML(rowsToShow, obj);
  }
}

function getHTML(num, data) {
  var html = '<table id="mytable" border="1">';
  html += "<tr><th>ID</th><th>Firstname</th><th>Lastname</th><th>Email</th><th>Location</th><th>Phone</th><th>Current Class</th><th>Address</th><th>Options</th></tr>"

  for (var i = 0; i < num; i++) {
    html += "<tr id='row_" + i + "'><td>" + i + "</td><td>" + data[i].firstname + "</td><td>" + data[i].lastname + "</td><td>" + data[i].email + "</td><td>" + data[i].location + "</td><td>" + data[i].phone + "</td><td>" + data[i].current_class + "</td><td>Communication: " + data[i].address.communication +
      "<br/>Permanent: " + data[i].address.permanent + "</td><td>" + "<input type='button' value='More Details' id='more_" + i + "'/>" + "<input class='edit' type='button' value='Edit' id='edit_" + i + "'/>" + "<input class='save' type='button' value='Save' id='save_" + i + "'/>" + "<input type='button' value='Delete' id='delete_" + i + "'/> </td></tr>"
  }
  html += "</table>";
  //Write table
  jQuery('#show_table').html(html);
}


//--------------------- Table show N rows ----------------------------------

function changeTableLength(value) {
  // var last_row = jQuery('#show_table').find('tr').last();
  // console.log(last_row.attr('id').split('_')[1]);
  jQuery('#mytable').remove();
  loadData(value);
}

jQuery('#selectRow').on('change', function() {
  changeTableLength(this.value);
  rowsToShow = this.value;
});


//---------------------- More details(marks) alert pop up ---------------------------
var modal_more = document.getElementById('myModal_more');

var getMoreDetailsHTML = function(obj) {
  var html = "";

  html += "Firstname: " + obj.firstname + "<br/><br/>";
  html += "Lastname: " + obj.lastname + "<br/><br/>";
  html += "Email: " + obj.email + "<br/><br/>";
  html += "Location: " + obj.location + "<br/><br/>";
  html += "Phone: " + obj.phone + "<br/><br/>";
  html += "Current Class: " + obj.current_class + "<br/><br/>";
  html += "Address:<br/> --Communication: " + obj.address.communication + "<br/><br/>";
  html += "--Permanent: " + obj.address.permanent + "<br/><br/>";
  html += "Marks:<br/> -- JavaScript: " + obj.marks.JavaScript + "<br/><br/>";
  html += "--J2EE: " + obj.marks.J2EE + "<br/><br/>";
  html += "--Node.js: " + obj.marks["Node.js"] + "<br/><br/>";
  html += "--Ruby on Rails: " + obj.marks["Ruby on Rails"] + "<br/><br/>";
  return html;
}

jQuery(document).on('click', 'input[id^="more_"]', function() {
  // modal_more.style.display = "block";
  var this_obj = jQuery(this),
    content_obj = jQuery('#myModal_more .modal-content'),
    id = this_obj.attr('id').split('_')[1];

  var retrieved_obj = JSON.parse(localStorage.getItem('object'));
  var obj = retrieved_obj[id];

  var curt_row = this_obj.parent().parent();
  var marks = "";
  for (var key in obj.marks) {
    marks += key + ":" + obj.marks[key] + " ";
  }
  var detail_row = '<tr id="detail_' + id + '">' + marks + '</tr>';

  if (curt_row.next().attr('id') === ('detail_' + id)) {
    curt_row.next().remove();
  } else {
    curt_row.after('<tr id="detail_' + id + '"><td colspan="9"> Marks: ' + marks + '</td></tr>');
  }

  var html = getMoreDetailsHTML(obj);

  content_obj.find('p[id="more"]').html(html);

});
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal_more.style.display = "none";
}

//----------------------- Delete row, also delete corresponding record in localStorage ---------
jQuery(document).on('click', 'input[id^="delete_"]', function() {
  var this_obj = jQuery(this),
    id = this_obj.attr('id').split('_')[1];
  
  var parent_row = this_obj.closest('tr');
  //Remove item from localStorage
  var retrieved_obj = JSON.parse(localStorage.getItem('object'));
  retrieved_obj.splice(id, 1);
  localStorage.setItem('object', JSON.stringify(retrieved_obj));
  
  
  if(parent_row.next().attr('id') === ('detail_'+id)){
    parent_row.next().remove();
  }
  
  getHTML(rowsToShow, retrieved_obj);
  
  // //Delete row from table
  // this_obj.closest('tr').remove();
  

});


//------------- Edit row, update localStorage and table ----------------------
var modal_edit = document.getElementById('myModal_edit');

function getEditHTML(obj) {
  var html = "";
  html += "Firstname: <input type='text' value='" + obj.firstname + "'/><br/><br/>";
  html += "Lastname: <input type='text' value='" + obj.lastname + "'/><br/><br/>";
  html += "Email: <input type='text' value='" + obj.email + "'/><br/><br/>";
  html += "Location: <input type='text' value='" + obj.location + "'/><br/><br/>";
  html += "Phone: <input type='text' value='" + obj.phone + "'/><br/><br/>";
  html += "Current Class: <input type='text' value='" + obj.current_class + "'/><br/><br/>";
  html += "Address:<br/> --Communication: <input type='text' value='" + obj.address.communication + "'/><br/><br/>";
  html += "--Permanent: <input type='text' value='" + obj.address.permanent + "'/><br/><br/>";
  html += "Marks:<br/> -- JavaScript: <input type='text' value='" + obj.marks.JavaScript + "'/><br/><br/>";
  html += "--J2EE: <input type='text' value='" + obj.marks.J2EE + "'/><br/><br/>";
  html += "--Node.js: <input type='text' value='" + obj.marks["Node.js"] + "'/><br/><br/>";
  html += "--Ruby on Rails: <input type='text' value='" + obj.marks["Ruby on Rails"] + "'/><br/><br/>";

  return html;


}

jQuery(document).on('click', 'input[id^="edit_"]', function() {
  modal_edit.style.display = "block";
  var content_obj = jQuery('#myModal_edit .modal-content'),
    id = jQuery(this).attr('id').split('_')[1];

  var retrieved_obj = JSON.parse(localStorage.getItem('object'));
  var obj = retrieved_obj[id];

  var html = getEditHTML(obj);

  html += "<input type='button' value='Submit' id='makeUpdate_" + id + "'/>";

  content_obj.find('p[id="update"]').html(html);

});

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[1];


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal_edit.style.display = "none";
}

//Submit Row Update to localStorage and Table
jQuery(document).on('click', 'input[id^="makeUpdate_"]', function() {
  modal_edit.style.display = "none";
  var this_obj = jQuery(this),
    id = this_obj.attr('id').split('_')[1];

  var value_arr = this_obj.parent().find('input').slice(0, 12);
  var retrieved_obj = JSON.parse(localStorage.getItem('object'));
  var obj = retrieved_obj[id];

  var firstname_val = value_arr[0].value;
  var lastname_val = value_arr[1].value;
  var email_val = value_arr[2].value;
  var location_val = value_arr[3].value;
  var phone_val = value_arr[4].value;
  var class_val = value_arr[5].value;
  var commu_val = value_arr[6].value;
  var perm_val = value_arr[7].value;
  var mark_1_val = value_arr[8].value;
  var mark_2_val = value_arr[9].value;
  var mark_3_val = value_arr[10].value;
  var mark_4_val = value_arr[11].value;

  obj.firstname = firstname_val;
  obj.lastname = lastname_val;
  obj.email = email_val;
  obj.location = location_val;
  obj.phone = phone_val;
  obj.class = class_val;
  obj.address.communication = commu_val;
  obj.address.permanent = perm_val;
  obj.marks.J2EE = mark_1_val;
  obj.marks.JavaScript = mark_2_val;
  obj.marks["Node.js"] = mark_3_val;
  obj.marks["Ruby on Rails"] = mark_4_val;
  //Update localStorage
  localStorage.setItem('object', JSON.stringify(retrieved_obj));
  alert('Update successed.');

  //Update html table
  var row_obj = jQuery('#show_table tr[id="row_' + id + '"]');
  console.log(row_obj.find('td').slice(1, 8));
  var row_value_arr = row_obj.find('td').slice(1, 8);
  row_value_arr.eq(0).html(firstname_val);
  row_value_arr.eq(1).html(lastname_val);
  row_value_arr.eq(2).html(email_val);
  row_value_arr.eq(3).html(location_val);
  row_value_arr.eq(4).html(phone_val);
  row_value_arr.eq(5).html(class_val);
  row_value_arr.eq(6).html("Communication:" + commu_val + "<br/>Permanent:" + perm_val);

});

//------------------------ Add new record ------------------------------------
var modal_new = document.getElementById('myModal_new');

function getNewRecordHTML() {
  html = "Firstname: <input type='text' name='firstname'><br/><br/>" + "Lastname: <input type='text' name='lastname'><br/><br/>" + "Email: <input type='text' name='email'><br/><br/>" + "Location: <input id='location' type='text' name='location' ondrop='drop(event)' ondragover='allowDrop(event)'><br/><br/>" + "<div id='drag_div'>" + "<span class='drag_span' id='Piscataway' draggable='true' ondragstart='drag(event)'>Piscataway</span> " + "<span class='drag_span' id='Philadelphia' draggable='true' ondragstart='drag(event)'>Philadelphia</span> " + "<span  class='drag_span' id='New York' draggable='true' ondragstart='drag(event)'>New York</span> " + "</div><br/>" + "Phone: <input type='text' name='phone'><br/><br/>" + "Current Class: <input type='text' name='current_class'><br/><br/>" + "Address:<br/> --Communication: <input type='text' name='communication'><br/><br/>" + "--Permanent: <input type='text' name='permanent'><br/><br/>" + "Marks:<br/> --JavaScript: <input type='text' name='javascript'><br/><br/>" + "--J2EE <input type='text' name='j2ee'><br/><br/>" + "--Node.js <input type='text' name='node'><br/><br/>" + "--Ruby on Rails <input type='text' name='ruby'><br/><br/>" + "<input type='button' value='Submit' id='submitNew'>";
  return html;
}

jQuery(document).on('click', 'input[id=addNew]', function() {
  modal_new.style.display = "block";
  var content_obj = jQuery('#myModal_new .modal-content');

  var html = getNewRecordHTML();

  content_obj.find('p[id="new"]').html(html);

});

//--------------------------- Location drag and drop -----------------------------
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  // alert(data);
  ev.target.value += " " + data + " ";
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[2];


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal_new.style.display = "none";
}

//Submit new record and Write to HTML
jQuery(document).on('click', 'input[id="submitNew"]', function() {
  modal_new.style.display = "none";
  var retrieved_obj = JSON.parse(localStorage.getItem('object'));
  var new_id = retrieved_obj.length;


  var new_obj = {};
  var this_obj = jQuery(this),
    value_arr = this_obj.parent().find('input').slice(0, 12);

  new_obj.firstname = value_arr.eq(0)[0].value;
  new_obj.lastname = value_arr.eq(1)[0].value;
  new_obj.email = value_arr.eq(2)[0].value;
  new_obj.location = value_arr.eq(3)[0].value;
  new_obj.phone = value_arr.eq(4)[0].value;
  new_obj.current_class = value_arr.eq(5)[0].value;
  new_obj.address = {};
  new_obj.address.communication = value_arr.eq(6)[0].value;
  new_obj.address.permanent = value_arr.eq(7)[0].value;
  new_obj.marks = {};
  new_obj.marks.JavaScript = value_arr.eq(8)[0].value;
  new_obj.marks.J2EE = value_arr.eq(9)[0].value;
  new_obj.marks["Node.js"] = value_arr.eq(10)[0].value;
  new_obj.marks["Ruby on Rails"] = value_arr.eq(11)[0].value;

  retrieved_obj.push(new_obj);

  localStorage.setItem('object', JSON.stringify(retrieved_obj));
  alert('New record added.');

  new_row = "<tr id='row_" + new_id + "'><td>" + new_id + "</td><td>" + value_arr.eq(0)[0].value + "</td><td>" + value_arr.eq(1)[0].value + "</td><td>" + value_arr.eq(2)[0].value + "</td><td>" + value_arr.eq(3)[0].value + "</td><td>" + value_arr.eq(4)[0].value + "</td><td>" + value_arr.eq(5)[0].value + "</td><td>Communication: " + value_arr.eq(6)[0].value + "<br/>Permanent: " + value_arr.eq(7)[0].value + "</td><td>" + "<input type='button' value='More Details' id='more_" + new_id + "'/>" + "<input class='edit' type='button' value='Edit' id='edit_" + new_id + "'/>" + "<input class='save' type='button' value='Save' id='save_" + new_id + "'/>" + "<input type='button' value='Delete' id='delete_" + new_id + "'/> </td></tr>";

  jQuery('#show_table tbody').append(new_row);

});

//------------------------------- Search by fields and Global Search ------------------------------

function getResultHTML(result, resultID){
  var html = '<table id="mytable" border="1">';
  html += "<tr><th>ID</th><th>Firstname</th><th>Lastname</th><th>Email</th><th>Location</th><th>Phone</th><th>Current Class</th><th>Address</th><th>Options</th></tr>"

  for (var i = 0; i < result.length; i++) {
    html += "<tr id='row_" + resultID[i] + "'><td>" + i + "</td><td>" 
        + result[i].firstname + "</td><td>" 
        + result[i].lastname + "</td><td>" 
        + result[i].email + "</td><td>" 
        + result[i].location + "</td><td>" 
        + result[i].phone + "</td><td>" 
        + result[i].current_class 
        + "</td><td>Communication: " + result[i].address.communication 
        + "<br/>Permanent: " + result[i].address.permanent + "</td><td>" 
        + "<input type='button' value='More Details' id='more_" + resultID[i] + "'/>" 
        + "<input class='edit' type='button' value='Edit' id='edit_" + resultID[i] + "'/>" 
        + "<input class='save' type='button' value='Save' id='save_" + resultID[i] + "'/>" 
        + "<input type='button' value='Delete' id='delete_" + resultID[i] + "'/> </td></tr>"
  }
  html += "</table>";
  //Write table
  jQuery('#show_table').html(html);
}

//Search by fields

jQuery("#search_firstname").keyup(function() {
  var value = this.value;
  if(value === ""){
    changeTableLength(rowsToShow);
  }else{
    jQuery('#mytable').remove();
    var retrieved_obj = JSON.parse(localStorage.getItem('object'));
    var result = [];
    var resultID = [];
    
    for(var i=0; i<retrieved_obj.length; i++){
      if(retrieved_obj[i].firstname.toLowerCase().startsWith(value)){
        result.push(retrieved_obj[i]);
        resultID.push(i);
      }
    }
    getResultHTML(result, resultID); 
  }

});

jQuery("#search_lastname").keyup(function() {
  var value = this.value;
  if(value === ""){
    changeTableLength(rowsToShow);
  }else{
    jQuery('#mytable').remove();
    var retrieved_obj = JSON.parse(localStorage.getItem('object'));
    var result = [];
    var resultID = [];
    
    for(var i=0; i<retrieved_obj.length; i++){
      if(retrieved_obj[i].lastname.toLowerCase().startsWith(value)){
        result.push(retrieved_obj[i]);
        resultID.push(i);
      }
    }
    getResultHTML(result, resultID); 
  }


});

jQuery("#search_location").keyup(function() {
  var value = this.value;

  if(value === ""){
    changeTableLength(rowsToShow);
  }else{
    jQuery('#mytable').remove();
    var retrieved_obj = JSON.parse(localStorage.getItem('object'));
    var result = [];
    var resultID = [];
    
    for(var i=0; i<retrieved_obj.length; i++){
      if(retrieved_obj[i].location.toString().toLowerCase().match(value)){
        result.push(retrieved_obj[i]);
        resultID.push(i);
      }
    }
    getResultHTML(result, resultID);
  }
});

jQuery("#search_phone").keyup(function() {
  var value = this.value;

  if(value === ""){
    changeTableLength(rowsToShow);
  }else{
    jQuery('#mytable').remove();
    var retrieved_obj = JSON.parse(localStorage.getItem('object'));
    var result = [];
    var resultID = [];
    
    for(var i=0; i<retrieved_obj.length; i++){
      if(retrieved_obj[i].phone.toLowerCase().startsWith(value)){
        result.push(retrieved_obj[i]);
        resultID.push(i);
      }
    }
    getResultHTML(result, resultID);
  }
});

jQuery("#search_class").keyup(function() {
  var value = this.value;

  if(value === ""){
    changeTableLength(rowsToShow);
  }else{
    jQuery('#mytable').remove();
    var retrieved_obj = JSON.parse(localStorage.getItem('object'));
    var result = [];
    var resultID = [];
    
    for(var i=0; i<retrieved_obj.length; i++){
      if(retrieved_obj[i].current_class.toLowerCase().startsWith(value)){
        result.push(retrieved_obj[i]);
        resultID.push(i);
      }
    }
    getResultHTML(result, resultID);
  }
});

//Global search whole table
jQuery("#search_global").keyup(function() {
  var value = this.value;

  if(value === ""){
    changeTableLength(rowsToShow);
  }else{
    jQuery('#mytable').remove();
    var retrieved_obj = JSON.parse(localStorage.getItem('object'));
    var result = [];
    var resultID = []
    
    for(var i=0; i<retrieved_obj.length; i++){
      if(retrieved_obj[i].current_class.toLowerCase().startsWith(value) || retrieved_obj[i].firstname.toLowerCase().startsWith(value) || retrieved_obj[i].lastname.toLowerCase().startsWith(value) || retrieved_obj[i].location.toString().toLowerCase().match(value) || retrieved_obj[i].phone.toLowerCase().startsWith(value)){
        result.push(retrieved_obj[i]);
        resultID.push(i);
      }
    }
    getResultHTML(result, resultID);
  }
});


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal_more) {
    modal_more.style.display = "none";
  } else if (event.target == modal_new) {
    modal_new.style.display = "none";
  } else if (event.target == modal_edit) {
    modal_edit.style.display = "none";
  }
}



jQuery(window).scroll(function() {
  
  if(jQuery(window).scrollTop() == jQuery(document).height() - jQuery(window).height()){
    // alert('hello');
    var retrieved_obj = JSON.parse(localStorage.getItem('object'));
    var id = parseInt(jQuery('#mytable').find('tr').last().attr('id').split('_')[1]);
    var new_id = id + 1;
    
    //10 at a time
  
    if(new_id<retrieved_obj.length){
      jQuery('#mytable tbody').append(appendNew(new_id, retrieved_obj[new_id]));
    }else{
      alert('No more data!');
    }

  }
});


function appendNew(new_id, obj){
  html = "<tr id='row_" + new_id + "'><td>" + new_id + "</td><td>"
       + obj.firstname + "</td><td>"
       + obj.lastname + "</td><td>"
       + obj.email + "</td><td>"
       + obj.location + "</td><td>"
       + obj.phone + "</td><td>"
       + obj.current_class + "</td><td>Communication: "
       + obj.address.communication
       + "<br/>Permanent: " + obj.address.permanent 
       + "</td><td>" 
       + "<input type='button' value='More Details' id='more_" + new_id + "'/>" 
       + "<input class='edit' type='button' value='Edit' id='edit_" + new_id + "'/>" 
       + "<input class='save' type='button' value='Save' id='save_" + new_id + "'/>" 
       + "<input type='button' value='Delete' id='delete_" + new_id + "'/> </td></tr>";
  
  return html;
}
