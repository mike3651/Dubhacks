
var url = "http://st.depositphotos.com/1000315/4169/i/450/depositphotos_41698135-stock-photo-pretty-young-woman-multiple-portrait.jpg";

var offset = 5;

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