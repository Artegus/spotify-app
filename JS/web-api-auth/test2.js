import {APIcontroller, UIController_Overview} from './test.js'

const buttonRedirect = document.getElementById('button-spotify');

buttonRedirect.addEventListener('click', function() {
    window.location = '../spotify_home.html';
});



const displayImages = (function(APICtrl) {

    const loadImages = async () => {

        const token = await APICtrl.getToken()

        const releases = await APICtrl.getListOfNewReleases(token)
        var number = 1;
        releases.forEach((album) => {

            const informationImage = {
                imageInfo : album.images[1],
                spotifyUrl : album.external_urls.spotify
            }

            const externalurl = informationImage.spotifyUrl;
            const {name : albumName} = album;
            const {height, url, width} = informationImage.imageInfo;

            const container = document.querySelector('.parent')
            const div = document.createElement('div');

            div.classList.add(`div${number}`)
            div.classList.add(`model-album`)

            div.innerHTML = `
            <div class='div${number} model-album'>
                <a href="${externalurl}" target='_blank'>
                    <img 
                        src="${url}" 
                        alt="${albumName}" 
                        height="${height}" 
                        width="${width}"
                    />
                </a>
                <div class='title-album'>
                    <p>${albumName}</p>
                </div>
            </div>
            `;
            container.appendChild(div)
            number += 1;
        })

    }

    return {
        init () {
            console.log('loading images');
            loadImages();
        }
    }

})(APIcontroller);


const APPController = (function(APICtrl, UICtrl) {

    const loadImages = async () => {

        const token = await APIcontroller.getToken();
        const releasesAlbums = await APIcontroller.getListOfNewReleases(token);
        const featuredPlaylists = await APIcontroller.getListOfFeaturedPlaylist(token);
        const playlistsOfTopListCategory = await APIcontroller.getCategoryPlaylists(token, 'toplists') // Esto se haría de otra forma, solo meto el valor 'toplist' para está página

        var number = 1; // This number is necesary because order of grid.

        releasesAlbums.forEach((album) => {
            const informationImage = {
                imageInfo : album.images[1],
                spotifyUrl : album.external_urls.spotify
            }

            const spotify_url = informationImage.spotifyUrl;
            const {name : albumName} = album;
            const {height, url, width} = informationImage.imageInfo;

            UICtrl.createAlbum(albumName, url, width, height, spotify_url, number)
            number += 1;
        }) 

        number = 1;
        featuredPlaylists.forEach((playlist) => {
            const information = {
                url : playlist.images[0].url,
                spotifyUrl : playlist.external_urls.spotify
            }
            const spotify_url = information.spotifyUrl;
            const {name: playlistName} = playlist;

            UICtrl.createPlaylist(playlistName, information.url, null, null, spotify_url, number);
            number +=1;
        })

        playlistsOfTopListCategory.forEach((playlist) => {
            const information = {
                url : playlist.images[0].url,
                spotifyUrl : playlist.external_urls.spotify
            }
            const spotify_url = information.spotifyUrl;
            const {name: playlistName} = playlist;

            UICtrl.createPlaylistOfTopList(playlistName, information.url, null, null, spotify_url, number);
            number +=1;
        })

    }

    return {
        init() {
            console.log(`loading images`);
            loadImages();
        }
    }


})(APIcontroller, UIController_Overview);


APPController.init();





//displayImages.init();