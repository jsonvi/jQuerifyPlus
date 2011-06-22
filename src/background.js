// Collect jquery embeded flag for every tab (it's local cache)
var flags = {};

// Set style.
chrome.browserAction.setBadgeBackgroundColor({color:[0, 200, 0, 100]});

// Find out if jQuery is already embeded in just updated page
chrome.tabs.onUpdated.addListener(is_jq_embeded);

// Find out if jQuery is already embeded in just selected page
chrome.tabs.onSelectionChanged.addListener(function(tabId, changeInfo, tab){
	if (get_flag(tabId)) {
		chrome.browserAction.setBadgeText({text: get_flag(tabId)});
	}
	else {
		chrome.browserAction.setBadgeText({text: ""});
	}
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.sendRequest(tab.id, {action: "embed"}, function(response) {
		if (response.result == 'embeded') {
			save_flag(tab.id, "$");
			chrome.browserAction.setBadgeText({text: "$"});
			chrome.browserAction.setTitle({title: '"jQuery" is embeded as "$".'});
		}
		else if (response.result == 'embeded_safe') {
			save_flag(tab.id,"$j");
			chrome.browserAction.setBadgeText({text: "$j"});
			chrome.browserAction.setTitle({title: '"jQuery" is embeded as "$j" to prevent conflict with "Prototype framework".'});
		}
		else if (response.result == 'ignore') {}
		else {
			save_flag(tab.id,0);
			chrome.browserAction.setBadgeText({text: ""});
			chrome.browserAction.setTitle({title: '"jQuery" is NOT embeded.'});
		}
	});
});

function is_jq_embeded (tabId, info, tab) {
	chrome.tabs.sendRequest(tabId, {action: "is_embeded"}, function(response) {
		if (response.result == 'embeded') {
			save_flag(tabId,"$");
			chrome.browserAction.setBadgeText({text: "$"});
			chrome.browserAction.setTitle({title: '"jQuery" is embeded as "$".'});
		}
		else if (response.result == 'embeded_safe') {
			save_flag(tabId,"$j");
			chrome.browserAction.setBadgeText({text: "$j"});
			chrome.browserAction.setTitle({title: '"jQuery" has already embeded possibly as "$j" to prevent conflict with "Prototype framework".'});
		}
		else {
			save_flag(tabId,0);
			chrome.browserAction.setBadgeText({text: ""});
			chrome.browserAction.setTitle({title: '"jQuery" is NOT embeded.'});
		}
	});
}

function save_flag (tabId,state) {
	flags[tabId] = state;
}

function get_flag (tabId) {
	return flags[tabId];
}