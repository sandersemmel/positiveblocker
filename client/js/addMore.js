function showeNoneBlocked(){
    /* Sets the visiblity of message indicating that you have no websites blocked yet*/
    let noneBlockedElement = document.getElementById("noneblocked");
    if(noneBlockedElement){
        noneBlockedElement.style.visibility = "visible";
    }
}

function hideNoneBlocked(){
        /* Sets the visiblity of message indicating that you have no websites blocked yet*/
        let noneBlockedElement = document.getElementById("noneblocked");
        if(noneBlockedElement){
            noneBlockedElement.style.visibility = "hidden";
        }
}
async function isEmptyDB(){
    return new Promise((resolve,reject)=>{
        chrome.storage.local.get("kek3", async (param)=>{
            if(param.kek3){
                resolve(param.kek3)
            }
                resolve(false);
        })
    })
 
}
async function addItemToList(item){

    let currentlyBlockedDiv = document.getElementById("currentlyblocked");
    console.log("Adding new item to list")
        let pElement = document.createElement("p");
        pElement.innerHTML = item
        pElement.className = "blockedItem"
        currentlyBlockedDiv.append(pElement);


}
async function saveToNew(value){
    return new Promise((resolve,reject)=>{
        chrome.storage.local.set({"kek3": [value]}, ()=>{
            console.log(`Saved site ${value} to completely empty db`);
            hideNoneBlocked();
            successButton("savebutton")
            addItemToList(value);
            resolve(true)
        })
    })
}

async function updateValues(values){
    return new Promise((resolve,reject)=>{
        chrome.storage.local.set({"kek3": values}, ()=>{
            console.log(`saved new values ${values}`);
            showAll();
            successButton("savebutton")
            resolve(true);
        })
    })

}
async function getValue(elementName){
    let element = document.getElementById(elementName);
    return element.value;
}
async function save(){

    return new Promise( async (resolve,reject)=>{
        let data = await isEmptyDB();
        let value = await getValue("addMoreInput");
    
        if(!data){
            await saveToNew(value);
            resolve(true)
            //await showNewList(value);
            // TODO re-implement re-draw of elements in list because right now when it is in this if clause, nothing shows up
    
            // TODO implement that when you no longer press a button then it changes the class back
            //return;
        }
    
    
    
        data.push(value);
        await updateValues(data);
        resolve(true);
    })


   


    console.log("kek");
}


async function showNewList(value){

    let currentlyBlockedDiv = document.getElementById("currentlyblocked");
    console.log(`Adding new value ${value}`)

        let pElement = document.createElement("p");
        pElement.innerHTML = value
        pElement.className = "blockedItem"
        currentlyBlockedDiv.append(pElement);
  
}

async function showAll(){
    /* Appends all  all currently blocked sites to the DOM */

    let currentlyBlockedDiv = document.getElementById("currentlyblocked");
    //div does not exist
    if(!currentlyBlockedDiv){
        console.error("div does not exist");
        return;
    }

    // remove blocked items to refresh the list
    let elements = document.getElementsByClassName("blockedItem");
    for (let index = 0; index < elements.length; index++) {
        elements[index].remove();
        
    }


    chrome.storage.local.get("kek3", (param)=>{
        if(!param.kek3 || param.kek3.length == 0 || !param){
            // no sites blocked yet
            showeNoneBlocked();
            return;
        }

        // there are blocked items
        let currentlyBlockedDiv = document.getElementById("currentlyblocked");
        let old = document.querySelectorAll("#currentlyblocked > p");

        for(let i = 0; i < old.length; i++){
            old[i].remove();
        }


        console.log("")
        param.kek3.forEach(element => {
            let pElement = document.createElement("p");
            pElement.innerHTML = element
            pElement.className = "blockedItem"
            currentlyBlockedDiv.append(pElement);
        });
    })

}



document.getElementById("savebutton").addEventListener("click", save);



/*Sound and Image changing*/ 


async function saveSound(soundUrl){
    return new Promise( (resolve, reject) =>{
        
    if(!soundUrl){
        console.log(`Unable to save sound because the sound is ${soundUrl}`);
        reject(false);
    }     


    chrome.storage.local.set({"currentSound": soundUrl}, ()=>{
        console.log(`Sound set as ${soundUrl}`);
        resolve(true);

    })
    
    })
}

async function getSoundUrlFromUser(){
    let newLinkToAudio = document.getElementById("audiosourceinput").value;

    return newLinkToAudio;
}

async function getImageUrlFromInput(){
    return document.getElementById("imagesourceinput").value;
}

async function saveImage(imageUrl){
    return new Promise((resolve)=>{
        chrome.storage.local.set({"currentImage": imageUrl}, ()=>{
            console.log(`New image set!`);
            resolve(true);
        })


    })

}

/*duplicate :[[[[[  */ 
async function fetchImageFromDB2(){
    return new Promise((resolve)=>{

        chrome.storage.local.get("currentImage", (param)=>{
            if(!param.currentImage || !param){
                console.log("user has not defined image yet, using predined fallback image");
                resolve("/client/resources/fallback.png")
            }
            resolve(param.currentImage);
        })


    })

}

// duplicate :[[     
async function fetchSoundFromDB2(){
    return new Promise(resolve => {
        chrome.storage.local.get("currentSound", (param)=>{
            console.log(`Found ${param.currentSound} from database..`);
            resolve(param.currentSound);
        })
    })
}



async function showCurrentStatus(){
    let image = await fetchImageFromDB2();
    let sound = await fetchSoundFromDB2();

    console.log(`image ${image}`)
    console.log(`sound ${sound}`)


    if(image && image != "/client/resources/fallback.png"){
        changeInnerHtml("currentimage",image)
    }    
        
    changeInnerHtml("currentimage", "not set");

    if(sound){
        changeInnerHtml("currentaudio", sound);

    }
    changeInnerHtml("currentaudio", "not set");


}
async function successButton(button){
    let bttn = document.getElementById(button);
    bttn.setAttribute("class","btn btn-success");
}

async function emptyInput(elementName){
    let element = document.getElementById(elementName);
    element.value = "";
}
async function changeInnerHtml(elementName, text){
    let element = document.getElementById(elementName);
    element.innerHTML = text;
}



document.getElementById("submitaudiosource").addEventListener("click", async ()=>{
    let newSound = await getSoundUrlFromUser();
    let result = await saveSound(newSound);


    if(result){
        await emptyInput("audiosourceinput");
        successButton("submitaudiosource");
        changeInnerHtml("currentaudio", newSound);
    }
    //await replaceSoundInDom(newSound); // TODO this might be a problem when this is called from another file ERROR

})

document.getElementById("submitimagesource").addEventListener("click", async ()=>{
    let imageUrl = await getImageUrlFromInput();
    let result = await saveImage(imageUrl);


    if(result){
        await emptyInput("imagesourceinput");
        successButton("submitimagesource");
        changeInnerHtml("currentimage", imageUrl);
    }

})

showAll();
showCurrentStatus();

