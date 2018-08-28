var obj = {
	"NumberofDemocrats": 0,
	"NumberofRepublicans": 0,
	"NumberofIndependents": 0,
	"TotalNumber": 0,
	"Democrats": 0,
	"Republicans": 0,
	"Independents": 0,
	"Total": 0
}

var members;
var numberOfMembers;
var leastEngagedM = [];
var mostEngagedM = [];
var mostLoyal = [];
var leastLoyal = [];
var chamber;
var readMore= document.getElementById("readM");

var app = new Vue({
	el: '#app',
	data: {
		theadsGlance: ["Party", "No.of Reps", "% Voted w/party"],
		obj: {},
		theadsA: ["Name","No. Missed Votes","% Missed"],
		theads: ["Name", "No.of Reps", "% Voted w/party"],
		membersME: [],
		membersLE: [],
		membersLL: [],
		membersML: []
	}
});

app.obj = obj;
app.membersME = mostEngagedM;
app.membersLE = leastEngagedM;
app.membersLL = leastLoyal;
app.membersML = mostLoyal;

if (readMore!=null){ // To avoid getting errors while loading other pages, if null doesnt exist, don´t do it. 
readMore.addEventListener("click", function(){
	
if(readMore.textContent=="Read More") {
	readMore.textContent="Read Less";
} else {
	readMore.textContent="Read More";
}
});
}


if (document.body.getAttribute("data-chamber") == "senate") {
	chamber="senate";
	 /*chamber = "https://api.propublica.org/congress/v1/113/senate/members.json";*/
}
	
 else if (document.body.getAttribute("data-chamber")=="house") {
	 	 chamber="house";
	 /*chamber = "https://api.propublica.org/congress/v1/113/house/members.json";*/
	}

	fetch("https://api.propublica.org/congress/v1/113/"+chamber+"/members.json", {
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
		var data = json;
		members = data.results[0].members;
		// number of members needs to be a integer, so math round is applied.  The 10% out of the 105 members will give 11 members
		numberOfMembers = Math.round((members.length * 10) / 100);
		contentGlance(members);
		
			if (document.body.getAttribute("data-LA")=="attendance"){
		sortLeastEngaged(members);
		sortMostEngaged(members);
			}
		if (document.body.getAttribute("data-LA")=="loyalty"){
		sortLeastLoyal(members);
		sortMostLoyal(members);}
		console.log(data);
        
	}).catch(function (error) {
		console.log("Request failed:" + error.message);
	});

function contentGlance(elements) {
	var independents = [];
	var democrats = [];
	var republicans = [];
	var sumRepublicans = 0;
	var sumDemocrats = 0;
	var sumIndependents = 0;
	var averageTotal= 0;

	for (var i = 0; i < elements.length; i++) {
		
		averageTotal += elements[i].votes_with_party_pct;

		if (elements[i].party == "R") {
			republicans.push(elements);
			sumRepublicans += elements[i].votes_with_party_pct;
			//sumRepublicans = sumRepublicans elements[i].votes_with_party_pct;
		}
		if (elements[i].party == "I") {
			independents.push(elements);
			sumIndependents += elements[i].votes_with_party_pct;
		}

		if (elements[i].party == "D") {
			democrats.push(elements);
			sumDemocrats += elements[i].votes_with_party_pct;
		}
	}

	obj["NumberofRepublicans"] = republicans.length;
	obj["NumberofDemocrats"] = democrats.length;
	obj["NumberofIndependents"] = independents.length;
	obj["TotalNumber"] = republicans.length + democrats.length + independents.length;

	obj["Republicans"] = getPercentage(sumRepublicans, republicans.length);
	obj["Democrats"] = getPercentage(sumDemocrats, democrats.length);
	obj["Independents"] = getPercentage(sumIndependents, independents.length);
	obj["Total"] = getPercentage(averageTotal, elements.length);
}

//Create a function that returns all the sums for the % republicans divided by total Members,  showing only 2 decimals

function getPercentage(votes, numberOfMembers) { 
	if (votes == 0) { //When votes are 0, the outcome was an undefined result. This will display 0 in the table. 
		return 0;
	} else {
		return Number((votes / numberOfMembers).toFixed(2));
	}
}

// Get the 10% of the Least engaged members. 
function sortLeastEngaged(members) {
	var missedVotes = members.sort(function (a, b) {
		return b.missed_votes - a.missed_votes
	});
	console.log(missedVotes);
	// A variable named "numberOfMembers" was created above.  Push into an array that list of numbers containing the 10%
	//var leastEngagedM = [];
	for (var i = 0; i < numberOfMembers; i++) {
		leastEngagedM.push(missedVotes[i])
	}
	// In case there are repeated values, they should be taken into account as well. If the position corresponding to the biggest number of the small array (containing the first 10%) equals the missed votes of any position in the big array, push it into the leastEngagedM as well. 
	for (var i = numberOfMembers; i < missedVotes.length; i++) { ////  we start from 11 and then loop 
		if (leastEngagedM[leastEngagedM.length - 1].missed_votes == missedVotes[i].missed_votes) {
			leastEngagedM.push(missedVotes[i]);
		}
	} 
}

// Get the 10% of the Most engaged members.
function sortMostEngaged(members) {
	var missedVotesMajor = members.sort(function (a, b) {
		return a.missed_votes - b.missed_votes
	});
	//var mostEngagedM = [];
	// Number of members is already created above
	for (var i = 0; i < numberOfMembers; i++)  
	{ mostEngagedM.push(missedVotesMajor[i]);
	};
	for (var i = numberOfMembers; i < missedVotesMajor.length; i++) { ////  we start from 11 and then loop 
		if (mostEngagedM[mostEngagedM.length - 1].missed_votes == missedVotesMajor[i].missed_votes) {
			mostEngagedM.push(missedVotesMajor[i]);
		}
	}
	console.log(mostEngagedM);
}

function sortMostLoyal(members) {
	var percVotes = members.sort(function (a, b) {
		return b.votes_with_party_pct - a.votes_with_party_pct
	});

	console.log(percVotes);
	for (var i = 0; i < numberOfMembers; i++) {
		mostLoyal.push(percVotes[i]);
	}
	console.log(mostLoyal);
	for (var i = numberOfMembers; i < percVotes.length; i++) { 
		if (mostLoyal[mostLoyal.length - 1].votes_with_party_pct == percVotes[i].votes_with_party_pct) {
			mostLoyal.push(percVotes[i]);
		}
	}
}

function sortLeastLoyal(members) {
	var percVotes = members.sort(function (a, b) {
		return a.votes_with_party_pct - b.votes_with_party_pct
	});
	console.log(percVotes);
	for (var i = 0; i < numberOfMembers; i++) {
		leastLoyal.push(percVotes[i]);
	}
	console.log(leastLoyal);
	for (var i = numberOfMembers; i < percVotes.length; i++) {  
		if (leastLoyal[leastLoyal.length - 1].votes_with_party_pct == percVotes[i].votes_with_party_pct) {
			leastLoyal.push(percVotes[i]);
		}
	}
}

