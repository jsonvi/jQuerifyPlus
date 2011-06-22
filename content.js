chrome.extension.onRequest.addListener(

	function(request, sender, sendResponse) {
		if (request.action == "embed") {

			var embeded				= is_embeded();
			var jq_embeded			= embeded.je;
			var prototype_embeded	= embeded.pe;

			if (jq_embeded) {
				sendResponse({result: "ignore"});
			} else {
				if (!prototype_embeded) {
					embed_jquery();
					sendResponse({result: "embeded"});
				} else {
					safe_embed_jquery(sendResponse);
					sendResponse({result: "embeded_safe"});
				}
			}
		}
		else if (request.action == "is_embeded") {

			var embeded				= is_embeded();
			var jq_embeded			= embeded.je;
			var prototype_embeded	= embeded.pe;

			if (jq_embeded && !prototype_embeded) {
				sendResponse({result: "embeded"});
			}
			else if (jq_embeded && prototype_embeded) {
				sendResponse({result: "embeded_safe"});
			} else {
				sendResponse({result: "not_embeded"});
			}
		}
		else {
			sendResponse({}); // snub them.
		}
	}
);

function is_embeded () {

	// Get head elemtent of content tab
	var head = document.getElementsByTagName('HEAD')[0];

	// Check if jquery is already embeded.
	// Child nodes.
	var childs = head.childNodes;
	var jq_exists = false;

	var pe = prototype_embeded(childs);

	// Run through child nodes.
	for (var i=0; i<childs.length; i++) {
		if (
			childs[i].src &&
			childs[i].src.match(/jquery/i)
		) {
			jq_exists = true;
		}
	}

	return {
		'je': jq_exists,
		'pe': pe
	};
}

function embed_jquery () {

	// Get head elemtent of content tab
	var head = document.getElementsByTagName('HEAD')[0];
	var script = document.createElement('script');
	script.src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js";
	script.type = 'text/javascript';
	head.appendChild(script);
}

function safe_embed_jquery (resp) {

	// Get head elemtent of content tab
	var head = document.getElementsByTagName('HEAD')[0];

	var script = document.createElement('script');
	script.src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js";
	script.type = 'text/javascript';
	head.appendChild(script);

	var script_safe = document.createElement('script');
	script_safe.type = 'text/javascript';
	script_safe.innerHTML = 'var $j = jQuery.noConflict();';

	var intervalNoConflict = setInterval(
		function () {
			try {
				head.appendChild(script_safe);
				clearInterval(intervalNoConflict);
			} catch (err) {
				console.log('ERR: ',err);
			}
		}
	,1000);
}

function prototype_embeded (childs) {
	// Run through child nodes.
	var pe = false;
	for (var i=0; i<childs.length; i++) {
		if (
			childs[i].src &&
			childs[i].src.match(/prototype/i)
		) {
			pe = true;
		}
	}
	return pe;
}

