function logURL(requestDetails) {
	if (requestDetails.url.endsWith('master.m3u8')){
		fetch(requestDetails.url + "#").then((response) => {
			const reader = response.body.getReader();
			return reader.read()
		})
		.then(data=>{
			var string = new TextDecoder().decode(data.value);
			chrome.tabs.sendMessage(requestDetails.tabId, {
				url: requestDetails.url,
				data: string
			});
		})
	}
}

chrome.webRequest.onBeforeRequest.addListener(logURL, {
	urls: ["<all_urls>"],
});
