
console.log('Lets write Javascript');
let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {

    currFolder = folder;
    let a = await fetch(`/songs/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

    // Show all the songs in the playlist
    let songUL = document.querySelector(".song-lists").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
                                        
                                        <div class="my-songs">
                                            <div class="song-info">
                                                <img src="images/music.svg" alt="music icon">
                                                <div class="song-name">

                                                    <h4>${song.replaceAll("%20", " ")}</h4>
                                                    <p>Prince</p>
                                                </div>
                                                
                                            </div>
                                            <img src="images/circle-play-button.svg" alt="">
                                        </div> </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".song-lists").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".song-name").firstElementChild.innerHTML.trim())

        })
    })

    return songs

}

const playMusic = (track, pause = false) => {
    currentSong.src = `/songs/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "images/pause-button.svg"

    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}





async function displayArtists() {
    console.log("displaying artists")
    let a = await fetch(`/artists/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".carousel")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
            if (e.href.includes("/artists") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0].replaceAll("%20", " ")
            // Get the metadata of the folder
            let a = await fetch(`/artists/${folder}/info.json`)
            let response = await a.json();
            console.log(response)

            cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card-artist">
            <div class="artist-image">
                <img src="artists/${folder}/cover.jpeg" alt="${response.title} Image">
            </div>
            <div class="artist-name-title">
                <h3>${response.title}</h3>
                <p>${response.description}</p>
            </div>
            <div class="card-play-button">
                <img src="images/card-play-button.svg" alt="card-play-button">
            </div>
        </div>`
        }
    }

        // Load the playlist whenever card is clicked
        Array.from(document.getElementsByClassName("card-artist")).forEach(e => {
            e.addEventListener("click", async item => {
                console.log("Fetching Artists")
                songs = await getSongs(`${item.currentTarget.dataset.folder}`)
                playMusic(songs[0])
    
            })
        })

}




async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".carousel-albums")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
            if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0].replaceAll("%20", " ")
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card-albums">
            <div class="album-image"><img src="/songs/${folder}/cover.jpeg" alt="${response.title} Image"></div>
            <div class="album-name-title">
                <h3>${response.title}</h3>
                <p>${response.description}</p>
            </div>
            <div class="card-play-button">
                <img src="images/card-play-button.svg" alt="card-play-button">
            </div>
        </div>`
        }
    }

        // Load the playlist whenever card is clicked
        Array.from(document.getElementsByClassName("card-albums")).forEach(e => {
            e.addEventListener("click", async item => {
                console.log("Fetching Songs")
                songs = await getSongs(`${item.currentTarget.dataset.folder}`)
                playMusic(songs[0])
    
            })
        })

}


async function main() {

    // Get the list of all the songs
    await getSongs("I")
    playMusic(songs[0], true)

    //Display all the artists on the page
    await displayArtists() 

    // Display all the albums on the page
    await displayAlbums()


    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "images/pause-button.svg"
        }
        else {
            currentSong.pause()
            play.src = "images/play-button.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".seekbar-circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".bar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".seekbar-circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent / 100;
    })

    //Add an event listener for menu button
    document.querySelector(".menu-button").addEventListener("click", e => {
        document.querySelector(".left").style.left = "0"
    })

    //Add an event listener for menu- close button
    document.querySelector(".close-button").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-100" + "%"
    })


    //Add an event listener to previous and next button
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous Clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

        else {
            currentSong.play()
        }


    })
    //Add an event listener to previous and next button
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next Clicked")
        console.log("currentSong.src.split(" / ").slice(-1) [0]")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

        else {
            currentSong.play()
        }


    })

    // Add an event to volume
    document.querySelector(".volume-button").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
    })

    //Add an event listener to mute the track
    volumeIcon.addEventListener("click", e => {
        console.log(e.target)
        console.log("changing", e.target.src)
        if (e.target.src.includes("images/volume-icon.svg")) {
            e.target.src = e.target.src.replace("images/volume-icon.svg", "images/mute-icon.svg")
            currentSong.volume = 0;
            document.querySelector(".volume-button").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("images/mute-icon.svg", "images/volume-icon.svg")
            currentSong.volume = .20;
            document.querySelector(".volume-button").getElementsByTagName("input")[0].value = 20;
        }

    })








}

main()

