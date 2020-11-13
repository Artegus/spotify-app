import {APIcontroller, UIController_Overview} from './functions.js'; // Import APIController and UIController_overview

// Function added to a button to redirect to next page.
const buttonRedirect = document.getElementById('button-spotify');
buttonRedirect.addEventListener('click', function() {
    window.location = '../spotify_home.html';
});


// Function to control both the API and the user interface.
const APPController = (function(APICtrl, UICtrl) {

    const loadImages = async () => { // Function to get and display all data.
        // Get the token
        const token = await APICtrl.getToken();
        // Get Releases Albums
        const releasesAlbums = await APICtrl.getListOfNewReleases(token);
        // Get Features Playlists
        const featuredPlaylists = await APICtrl.getListOfFeaturedPlaylist(token);
        // Get a specidy playlist (top list)
        const playlistsOfTopListCategory = await APICtrl.getCategoryPlaylists(token, 'toplists') // 'top list is only for test'

        var number = 1; // This number is needed to assign a different class to each component of the grid
        releasesAlbums.forEach((album) => {
            // Collect the information that i need

            const {
                name : albumName,
                external_urls : {spotify : spotify_url},
                images : [, {height, url, width}]
            } = album;

            UICtrl.createAlbum(albumName, url, width, height, spotify_url, number)
            
            number += 1;
        }) 

        featuredPlaylists.forEach((playlist) => {

            const {
                name : playlistName,
                external_urls : {spotify : spotify_url},
                images : [{height, url, width}]
            } = playlist;

            UICtrl.createPlaylist(playlistName, url, height, width, spotify_url, number);
            number +=1;
        })

        playlistsOfTopListCategory.forEach((playlist) => {

            const {
                name : playlistName,
                external_urls : {spotify : spotify_url},
                images : [{height, url, width}]
            } = playlist;

            UICtrl.createPlaylistOfTopList(playlistName, url, height, width, spotify_url, number);
            number +=1;
        })

    }

    return {
        init() {
            loadImages();
            console.log('ok :)')
        }
    }


})(APIcontroller, UIController_Overview);


APPController.init();