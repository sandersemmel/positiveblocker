chrome.blitzstatus = 0;
chrome.confpageshown = 0;
chrome.isMatchingSite = 0;
console.log("HERE AGAIN")


chrome.runtime.onInstalled.addListener((reason) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.tabs.create({
        url: 'onboarding.html'
      });
    }
  });



chrome.tabs.onUpdated.addListener( async function
    (tabId, changeInfo, tab) {
        console.log("Probably loaded a new page...")


        let is = false;
        // check if the site matches
        chrome.storage.local.get("kek3", (paramObj)=>{
            if(!paramObj.kek3){
                chrome.isMatchingSite = 0;
                return;
            }

            for(let it = 0; it < paramObj.kek3.length; it++){
                console.log("finding for match");
                if(paramObj.kek3[it] == tab.url){
                    is = true;
                    chrome.isMatchingSite = 1;
                    console.log("FOUND A MATCH");
                }
            }
        })



        console.log("changeinfo", changeInfo);
        if(chrome.isMatchingSite == 1){

            // check if tab exists
            let alltabs = await chrome.tabs.query({});
            console.log(`found ${alltabs.length} tabs`);
            let filteredTabs = alltabs.filter(ftab => ftab.id == tabId);
            console.log("filteredTabs", filteredTabs);

            if(filteredTabs.length == 0){
                console.log("The tab does not exist!")
                return;
            }


            chrome.tabs.remove(
                tabId,
                ()=>{
                    chrome.tabs.query({url: "chrome-extension://ekgbbgbcafcpnpffogjagbhdifnldogf/onboarding.html"}).then((tabs)=>{
                    // sometimes this gets triggered twice, so have a value to represent the state
                        console.log("tabs", tabs);    
                        if(tabs.length === 0 && chrome.blitzstatus == 0){
                            console.log("TRIGGERED because tabs ", tabs);
                            chrome.tabs.create({url: "/client/html/onboarding.html"});
                            chrome.blitzstatus = 1;
                            chrome.isMatchingSite = 0;

                        }

                        
                    });
        

                }
              )
        }



        chrome.blitzstatus = 0;
    }
  );



