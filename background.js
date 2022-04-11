chrome.action.onClicked.addListener(function(tab) {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-script.js']
    });

})
chrome.commands.onCommand.addListener(async command => {
    switch (command) {
        case "mute_tab_current":
            const currentTab = await getCurrentTab()
            await toggleMuteState(currentTab.id)
            break;
        default:
            break;
    }
})
const filter = {
    url: [{
        urlMatches: 'https://twitter.com/*',
    }, ],
};

chrome.webNavigation.onCompleted.addListener(async({ tabId }) => {
    let muted = true;
    await chrome.tabs.update(tabId, { muted });
}, filter);


async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

function toggleMuteState(tabId) {
    chrome.tabs.get(tabId, async(tab) => {
        let muted = !tab.mutedInfo.muted;
        await chrome.tabs.update(tabId, { muted });
        console.log(`Tab ${tab.id} is ${ muted ? 'muted' : 'unmuted' }`);
    });
}