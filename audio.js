function bindEvents() {
    videos = document.getElementsByTagName("video");
    audios = document.getElementsByTagName("audio");
    [...videos, ...audios].forEach(function(ele) {
        ele.addEventListener('play', unMuteRequest)
        ele.addEventListener('pause', muteRequest)
        ele.addEventListener('playing', unMuteRequest)
        ele.addEventListener('waiting', muteRequest)
        ele.addEventListener('ended', muteRequest)
    })
}


function muteRequest(event) {
    chrome.runtime.sendMessage({ type: 'audio', muted: true, triggedBy: event.type }, function(response) {
        console.log(response);
    });

}

function unMuteRequest(event) {
    chrome.runtime.sendMessage({ type: 'audio', muted: false, triggedBy: event.type }, function(response) {
        console.log(response);
    });

}
bindEvents();