
var url = "http://st.depositphotos.com/1000315/4169/i/450/depositphotos_41698135-stock-photo-pretty-young-woman-multiple-portrait.jpg";

var offset = 5;

var data_object = {
    MAX_SIZE: 25,
    
    // a set of queues of emotion data
    scores: {},   
    
    // Run once on construction. Fills an object with k:v 
    // e.g. 
    // scores: {
    //     "anger": {"queue": [], "avg" : 10}, ...
    construct_scores: function(data) {
        for (var key in data["scores"]) {
            if (data.hasOwnProperty(key)) {
                scores[key]["queue"] = [ data["scores"][key] ];
                scores[key]["avg"] = data["scores"][key];
            }
        }   
    },
    
    // updates scores
    update: function(data) {
        for (var key in data["scores"]) {
            if (data.hasOwnProperty(key)) {
                // update queues
                scores[key]["queue"].push(data["scores"][key]);
                
                // and averages
                scores[key]["avg"] = get_average(key, data["scores"][key]);
            }
        }
    },

    // gets the average value from a score's queue
    get_average: function(key) {
        sum = scores[key]["queue"].reduce((p, c) => c += p);
        return sum / scores[key]["queue"].length;
    },

    // gets the average value from a score's queue
    get_n_average: function(key, nframes) {
        var len = scores[key]["queue"].length;
        var sum = scores[key]["queue"].slice(len - nframes, len+1).reduce((p, c) => c += p);
        return sum / len;
    },

    // Gets an n-frame immediate change in emotion score from current average
    get_change: function(data, key, nframes="all") {
        if (nframes == "all") {
            return scores[key]["avg"] - data[key];
        } else {
            return get_n_average(key, nframes) - data[key];
        }
    },
}

window.onready = function() {
	$(function() {
		$.ajax({ 
			url: "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?", 
			beforeSend: function(xhrObj) {
				// request the headers
				xhrObj.setRequestHeader("Content-Type", "application/json");
				xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "a2114e526456432da2152247f9e512af");
			},
			type: "POST",
			data: '{"url":"' + url + '"}',

		}).done(function(data) {			
			$("#main-photo").attr("src", url);
			for(var i = 0; i < data.length; i++) {
				// draw a box around each recognized person
				var item = data[i];
				var feeling = emotion(item["scores"]);
				var box = document.createElement("div");
				box.title = feeling;				
				box.className = "box";
				box.style.left = item["faceRectangle"].left 
								+ $("#main-photo").offset().left - offset + "px";
				box.style.top = item["faceRectangle"].top
								+ $("#main-photo").offset().top - offset + "px";
				console.log("top: " + box.style.top + "\nleft: " + box.style.left);					
				box.style.height = item["faceRectangle"].height;
				box.style.width = item["faceRectangle"].width;
				$("body").append(box);
			}
		}).fail(function() {
			alert("bad");
		});
	});
}

// runs through the emotions that were returned and selects the biggest one
function emotion(person) {
	var feeling = "";
	var max_emotional_value = 0;
	for(var key in person) {
		var current_emotional_value = parseFloat(person[key]);
		// console.log("current emotion: " + key);
		// console.log("current emotional value: " + current_emotional_value);
		if (current_emotional_value > max_emotional_value) {
			feeling = key;
			max_emotional_value = current_emotional_value;
		}
	}
	return feeling + ": " + Math.round(max_emotional_value * 100) + "%";
}