const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
if (darkThemeMq.matches) {
  document.body.className = "dark"
  theme = "dark"
}
else{
  theme = "light"
}

function obserse(element, arr){
  let els = document.getElementById("main-wraper").getElementsByTagName("label")
  var enabled = false;
  for (let i = 0; i < els.length; i++){
    let inpt = els[i].getElementsByTagName("input")[0]
    if (inpt.checked != arr[inpt.id]){
      enabled = true;
      break;
    }
  }
  if(enabled){
    document.getElementById("save").classList.remove("disabled")
  }
  else{
    document.getElementById("save").classList.add("disabled")
  }
}

chrome.storage.sync.get({ downloader: "self" }, results => {
  let labels = document.getElementById("main-wraper").getElementsByTagName("label")
  Object.keys(labels).forEach(function(e){
    let input = labels[e].getElementsByTagName("input")[0]
    if (input.type == "checkbox"){
      input.checked = results[input.id]
    }
    else if (input.type == "radio"){
      if (input.value == results[input.name]){input.checked=true}
    }
    labels[e].onclick = function(){obserse(labels[e], results)}
  })

  document.getElementById("save").onclick = _ => {
    let labels = document.getElementById("main-wraper").getElementsByTagName("label")
    let settings = {};
    Object.keys(labels).forEach(function(e){
      let input = labels[e].getElementsByTagName("input")[0]
      if (input.type == "checkbox"){
        settings[input.id] = input.checked;
      }
      else if (input.type == "radio" && input.checked){
        settings[input.name] = input.value;
      }
    })

    chrome.storage.sync.set(settings, _ => {
      window.close();
    });
  };
});