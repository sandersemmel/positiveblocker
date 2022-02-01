

async function fetchSoundFromDB(){
    return new Promise(resolve => {
        chrome.storage.local.get("currentSound", (param)=>{
            console.log(`Found ${param.currentSound} from database..`);
            resolve(param.currentSound);
        })
    })
}



async function replaceSoundInDom(newSound){
    // find the old audio element,
    // remove old audio element
    // put new audio element

    if(!newSound){
        newSound = "/client/resources/fallback.mp3"
    }

    let audioElement = document.getElementById("audioelement");

    if(!audioElement){
        console.log("Old audio element does not work.. just going to create a new one then.");
    }

    audioElement.remove();

    let newAudioElement = document.createElement("audio");
    newAudioElement.setAttribute("autoplay", "true");
    newAudioElement.setAttribute("hidden", "true");

    let sourceElement = document.createElement("source");
    sourceElement.setAttribute("src", newSound)
    sourceElement.setAttribute("id","audiosource")
    sourceElement.setAttribute("type", "audio/mpeg");

    newAudioElement.append(sourceElement);

    let audiodiv = document.getElementById("audiodiv");
    audiodiv.append(newAudioElement);

}




async function fetchImageFromDB(){
    return new Promise((resolve,reject)=>{

        chrome.storage.local.get("currentImage", (param)=>{
            if(!param.currentImage || !param){
                console.log("user has not defined image yet, using predined fallback image");
                resolve("/client/resources/fallback.png")
            }
            resolve(param.currentImage);
        })


    })

}

async function replaceImageInDom(image){
    let imageElement = document.getElementById("blitzgif");
    if(!imageElement){
        console.log("Image does not exist, creating a new one..");
        imageElement = document.createElement("img");
    }

    imageElement.setAttribute("src", image);

    let imagedivelement =  document.getElementById("imagediv");
    imagedivelement.append(imageElement);
}



async function changeImageOnLoad(){
    let dbImage = await fetchImageFromDB();
    console.log(`changing to image ${dbImage}`)
    await replaceImageInDom(dbImage);
}


async function changeSoundOnLoad(){
    console.log("starting to change sound")
    let soundPromise = await fetchSoundFromDB();
    await replaceSoundInDom(soundPromise);
    console.log("changed sound");


    /*Gets the current sound from DB and puts it in DOM*/ 
/*     chrome.storage.local.get("currentSound",(param)=>{
        console.log(`param.currentSound ${param.currentSound}`)
        let audioSourceElement = document.getElementById("audiosource");



        audioSourceElement.setAttribute("src", param.currentSound, ()=>{
            console.log("DOM updated with new sound");
        })
    }) */


}

async function onLoadFuncs(){
    changeSoundOnLoad();
    changeImageOnLoad()
}



window.onload = onLoadFuncs