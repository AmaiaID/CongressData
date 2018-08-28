var listStates = [];
var selectedMembers = [];
var members = [];

var app = new Vue({
	el: '#app',
	data: {
		theads: ["Member", "Party", "State", "Seniority", "Votes"],
		members: []
	}
});

//Create a variable named "chamber" to select the data corresponding to Senate or House adn then 

var chamber;

if (document.body.getAttribute("data-congress") == "senate") {
	chamber = "senate"
}

if (document.body.getAttribute("data-congress") == "house") {
	chamber = "house"
}

fetch("https://api.propublica.org/congress/v1/113/" + chamber + "/members.json", {
	method: "GET",
	headers: {
		'X-API-Key': 'cwFOQTT7yLTXQIbskM7SMpxqXZoC131v5yyk2jt7'
	}
}).then(function (response) {
	if (response.ok) {
		return response.json();
	}
	throw new Error(response.statusText);

}).then(function (json) {
	members = json.results[0].members;
	app.members = json.results[0].members;

	filtered(members);
	filterDropdown(members);
	createDropdownSort(members);

	console.log(data);
}).catch(function (error) {
	console.log("Request failed:" + error.message);
});


//  Get the HTML element corresponding to each Checkbox 

var checkboxR = document.getElementById("checkboxR");
var checkboxD = document.getElementById("checkboxD");
var checkboxI = document.getElementById("checkboxI");

//filtered();   //  If I call this function without nothing selected, it is gonna create an empty createbody function and show no initial table

function filtered(members) { // quiero que me devuelva una rray con los members que pasan bien por los filtros, declarar un nuevo array
	console.log(members);

	selectedMembers = []; // It needs to be empty every time we change the checkbox values, it needs to be before the loop 

	for (var i = 0; i < members.length; i++) {
		if (checkboxR.checked && members[i].party === "R" && (members[i].state == FilterByState.value || FilterByState.value == "All")) {
			selectedMembers.push(members[i]);
		}

		if (checkboxD.checked && members[i].party === "D" && (members[i].state == FilterByState.value || FilterByState.value == "All")) {
			selectedMembers.push(members[i]);
		}

		if (checkboxI.checked && members[i].party === "I" && (members[i].state == FilterByState.value || FilterByState.value == "All")) {
			selectedMembers.push(members[i]);
		}

		if (!checkboxR.checked && !checkboxD.checked && !checkboxI.checked && (members[i].state == FilterByState.value || FilterByState.value == "All")) {
			selectedMembers.push(members[i]);
		}
	}
	createNoData(selectedMembers);
}
/*	createBody(selectedMembers);*/


console.log(selectedMembers.length);

function createNoData(selectedMembers) {

	if (selectedMembers.length == 0) { // If there are no members 
		if (!document.getElementsByClassName('noData')[0]) { // If noData does not exist
			var noData = document.getElementById("data");
			var tr = document.createElement("tr");
			var td = document.createElement("td");
			td.textContent = "No data available";
			tr.appendChild(td);
			noData.appendChild(tr);
			tr.classList.add("noData");
			/*noData.innerHTML="<tr class='noData'><td>No data available</td></tr>";
			 */
		}
	} else { //  If noData available exists, when the function is loaded again it will remove it. 
		if (document.getElementsByClassName('noData')[0]) // If no data exists
		{
			document.getElementById("data").removeChild(document.getElementsByClassName('noData')[0]);

		}
	}
	app.members = selectedMembers;
}

// Create event listener

checkboxR.addEventListener("click", function () {
	filtered(members);
});

checkboxD.addEventListener("click", function () {
	filtered(members);
});
checkboxI.addEventListener("click", function () {
	filtered(members);
});


// filterDropDown function is going to avoid repeating the states. If the state is not already included, push it into the listStates array.  It avoids duplication of information.

function filterDropdown(members) {
	for (var i = 0; i < members.length; i++) {
		if (!listStates.includes(members[i].state)) {
			listStates.push(members[i].state);
		}
	}
}

function createDropdownSort() {
	var filterState = document.getElementById("FilterByState");
	var orderedList = listStates.sort();

	for (i = 0; i < orderedList.length; i++) {
		var states = document.createElement("option");
		states.textContent = orderedList[i];
		FilterByState.appendChild(states);
	}
	//var states = document.createElement("option");
	//states.textContent = membersHouse[i].state;
	//filterState.appendChild(states);
}

FilterByState.addEventListener("change", function () {
	filtered(members);
});
