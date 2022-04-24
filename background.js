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

chrome.contextMenus.create({
    id: 'mute',
    title: 'mute',
    contexts: ['all'],
    type: "normal",
})



async function contextClick(info, tab) {
    const { menuItemId } = info

    if (menuItemId === 'mute') {
        let muted = !tab.mutedInfo.muted;
        await chrome.tabs.update(tab.id, { muted });
    }
    if (menuItemId === 'center') {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content-script.js']
        });
    }

}

chrome.contextMenus.onClicked.addListener(contextClick)

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type === "audio") {

            getCurrentTab().then(async function(tab) {
                await chrome.tabs.update(tab.id, { muted: request.muted });

                sendResponse(`Audio tab state is just set to ${request.muted ? 'muted':'Un muted'} because events was trigged ${request.triggedBy}`)

            })
            return true;

        } else {
            sendResponse(`An unknown message, nothing was or is done`)
        }

    }
);