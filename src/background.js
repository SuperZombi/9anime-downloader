function logURL(requestDetails) {
	if (requestDetails.url.endsWith('master.m3u8')){
		chrome.tabs.sendMessage(requestDetails.tabId, {
			url: requestDetails.url
		});
	}
}

chrome.webRequest.onBeforeRequest.addListener(logURL, {
	urls: ["<all_urls>"],
});
