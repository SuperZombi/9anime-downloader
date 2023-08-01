window.onload = _=>{
	let parrent = document.querySelector('.player-controls');
	let div = document.createElement('div');
	div.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve">
						<path fill="green" d="m212 157-32 32v-84a15 15 0 1 0-30 0v84l-32-32a15 15 0 0 0-21 21l57 58a15 15 0 0 0 22 0l57-58a15 15 0 0 0-21-21Z"/>
					</svg>`
	div.id = "downloadButton"
	div.style.height = "38px";
	div.style.width = "38px";
	div.style.float = "right";
	div.style.cursor = "pointer";
	div.style.position = "relative";
	div.onmouseover = function(){
		div.style.background = "#141414"
	}
	div.onmouseout = function(){
		div.style.background = ""
	}
	div.onclick = show_download_menu
	parrent.insertBefore(div, parrent.querySelector(".clearfix"))
}

function createDownloadMenu(array){
	let loader = `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" height="50px" style="margin:auto;display:block;" >
			<g transform="translate(25 50)">
			<circle cx="0" cy="0" r="6" fill="lightblue"><animateTransform attributeName="transform" type="scale" begin="-0.3333333333333333s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform></circle></g>
			<g transform="translate(50 50)">
			<circle cx="0" cy="0" r="6" fill="lightblue"><animateTransform attributeName="transform" type="scale" begin="-0.16666666666666666s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform></circle></g>
			<g transform="translate(75 50)">
			<circle cx="0" cy="0" r="6" fill="lightblue"><animateTransform attributeName="transform" type="scale" begin="0s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform></circle></g>
		</svg>
	`
	if (!document.querySelector("#downloadMenu")){
		let div = document.createElement("div")
		div.id = "downloadMenu"
		div.style.minHeight = "50px"
		div.style.minWidth = "120px"
		div.style.background = "rgba(93, 93, 93, 0.5)"
		div.style.backdropFilter = "blur(5px)"
		div.style.position = "absolute"
		div.style.borderRadius = "8px"
		div.style.padding = "2px"
		div.style.filter = "drop-shadow(black 2px 4px 6px)"
		div.style.zIndex = "100"
		div.style.right = "0"
		div.style.top = "100%"
		div.style.display = "flex"
		div.style.flexDirection = "column"
		div.style.gap = "2px"
		div.style.opacity = 0
		div.style.visablility = "hidden"
		div.style.transform = "scale(0)"
		div.style.transformOrigin = "right top"
		div.style.transition = "0.5s"
		div.innerHTML = loader;
		document.querySelector("#downloadButton").appendChild(div)
	}
	else{
		document.querySelector("#downloadMenu").innerHTML = loader;
	}

	if (array.length > 0){
		let div_target = document.querySelector("#downloadMenu")
		let elements = []
		for (const e of array) {
			let title = `${e.resolution.height}p${e.fps}`
			let element = makeLink(title, e.url);
			elements.push(element);
		}
		div_target.innerHTML = ""
		div_target.append(...elements)
	}
}

function makeLink(title, href){
	let a = document.createElement("a")
	a.href = href
	a.target = '_blank'

	a.style.display = "block"
	a.style.color = "white"
	a.style.textDecoration = "none"
	a.style.padding = "4px 5px"
	a.style.borderRadius = "6px"
	a.style.transition = "0.2s"
	a.style.cursor = "pointer"
	a.style.textAlign = "center"

	a.onmouseover = _=>{
		a.style.background = "#5a2e98"
	}
	a.onmouseout = _=>{
		a.style.background = ""
	}

	let span = document.createElement("span")
	span.innerHTML = title

	a.appendChild(span)
	return a;
}

var timer;
function show_download_menu(){
	let div = document.querySelector("#downloadMenu")
	setTimeout(function(){
		document.body.onclick = hide_download_menu
	}, 50)
	if (div.style.visablility = "hidden"){
		div.style.visablility = "visible"
		setTimeout(function(){
			div.style.transform = "scale(1)"
			div.style.opacity = 1
		}, 10)
	}
	else{
		if (timer) {
			clearTimeout(timer);
			div.style.transform = "scale(1)"
			div.style.opacity = 1
		}
	}
}
function hide_download_menu(event){
	let div = document.querySelector("#downloadMenu")
	let path = event.path || (event.composedPath && event.composedPath());
	if (!path.includes(div)){
		div.style.transform = "scale(0)"
		div.style.opacity = 0
		setTimeout(function(){
			document.body.onclick = ""
		}, 50)
		timer = setTimeout(function(){
			div.style.visablility = "hidden"
		}, 400)
	}
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	var parser = new m3u8Parser.Parser();
	parser.push(message.data);
	parser.end();
	let arr = [];
	for (const video of parser.manifest.playlists) {
		let absoluteUrl = new URL(video.uri, message.url)
		let temp = {
			"fps": video.attributes['FRAME-RATE'],
			"resolution": video.attributes.RESOLUTION,
			"url": absoluteUrl.href
		}
		arr.push(temp)
	}
	createDownloadMenu(arr)
});
