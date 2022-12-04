function twochar(c) {
    c = c.toString();
    if (c.length == "1") {
        c = "0".toString()+c
    }
    return c
}

slider = document.getElementById("slider")
player = document.getElementById("player")
playpause = document.getElementById("playpause")
nextmd = document.getElementById("nextmd")
radio = document.getElementById("radio")
player.volume = 0.2;
isplayed = false;
radiourl = "http://enzomtp.dragonia-pvp.fr:8000/a.mp3"

//get the now playing / next playing

async function np() {
    var np = new XMLHttpRequest();
    np.withCredentials = true;
    np.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText)
        npjson = JSON.parse(this.responseText);
      }
    });
    np.open("GET", "http://enzomtp.dragonia-pvp.fr/Assets/Radio/np.php");
    np.setRequestHeader("cache-control", "no-cache");
    np.send(null);

    let ctitle = npjson.CurrentTrack.Title;

    let cartist = npjson.CurrentTrack.Artist;

    let ntitle = npjson.Playlist[0].Title;

    let nartist = npjson.Playlist[0].Artist;

    document.getElementById("artist").innerHTML = cartist;

    document.getElementById("title").innerHTML = ctitle;

    document.getElementById("nextartist").innerHTML = nartist;

    document.getElementById("nexttitle").innerHTML = ntitle;
}

// //get stats from the url
// async function Stats() {
//     let statsjson = await (await fetch("http://enzomtp.dragonia-pvp.fr/Assets/Radio/Stats.php")).json()

//     let uptime = statsjson.streamuptime;

//     var hours = Math.floor(uptime / 60 / 60);

//     var minutes = Math.floor(uptime / 60) - hours * 60;

//     var seconds = uptime % 60;

//     // $("#time").html(hours + "h" + minutes + "m" + seconds + "s");
// }

function progressbar() {
    let duration = npjson.CurrentTrack.Duration;

    let elapsed = npjson.CurrentTrack.Elapsed;

    var uehours = Math.floor(elapsed / 60 / 60);

    var ueminutes = Math.floor(elapsed / 60) - uehours * 60;

    var ueseconds = Math.floor(elapsed % 60);

    var udhours = Math.floor(duration / 60 / 60);

    var udminutes = Math.floor(duration / 60) - udhours * 60;

    var udseconds = Math.floor(duration % 60);

    var prcnt = (elapsed/duration) * 100;

    document.getElementById("currentt").innerHTML = twochar(uehours) + ":" + twochar(ueminutes) + ":" + twochar(ueseconds);

    document.getElementById("endt").innerHTML = twochar(udhours) + ":" + twochar(udminutes) + ":" + twochar(udseconds);

    document.getElementById("progressbarfill").style.width = prcnt+"%";

    if (prcnt >= 90) {
        nextmd.hidden = false
        nextmd.style['right'] = '0%'
    } else if ( prcnt < 90) {
        nextmd.style['right'] = '-30%'
        setTimeout(nextmd.hidden = true, 600)
    }
}

function cover() {
    let covers = npjson.CurrentTrack.AlbumArt;

    let ncovers = npjson.Playlist[0].AlbumArt;

    aart = document.getElementById("cover");

    naart = document.getElementById("nextcover");

    setTimeout(function () {
        if (npjson.CurrentTrack.AlbumArt == "no_cover_image.jpg") {
            aart.src = "http://enzomtp.dragonia-pvp.fr/Assets/Radio/dcover.png";
        } else {
            aart.src = "http://enzomtp.dragonia-pvp.fr/Assets/Album-Art/" + covers;
        }
    }, 50);

    setTimeout(function () {
        if (npjson.Playlist[0].AlbumArt == "no_cover_image.jpg") {
            naart.src = "/Assets/Radio/dcover.png";
        } else {
            naart.src = "/Assets/Album-Art/" + ncovers;
        }
    }, 50);
}

playpause.addEventListener("click",function() {
    if (isplayed == false) {
        radio.src=radiourl;
        player.load();
        player.play();
        isplayed = true;
        this.style['background-image'] = "url(\'https://cdn.discordapp.com/attachments/1046914734026399775/1048724096030081164/Carre.svg\')"
    } else {
        isplayed = false;
        player.pause();
        player.currentTime = 0;
        radio.src="";
        this.style['background-image'] = "url(\'https://cdn.discordapp.com/attachments/1046914734026399775/1048723034841817098/Nouveau_projet.svg\')"
    }
})

slider.oninput = function() {
    player.volume = this.value/100;
}


// Stats();
np();
setTimeout(function (){
    progressbar();
    cover();
}, 10);

setInterval(function () {
    np();
    // Stats();
    progressbar();
    cover();
}, 500);
