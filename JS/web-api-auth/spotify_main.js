import {APIcontroller, UIController_Main} from './functions.js';

const APPController = (function(APICtrl, UICtrl){

    // Get container field
    const DOMcontainers = UICtrl.containerField();

    const loadRecommendedPlaylist = async () => {
        // Get token
        const token = await APICtrl.getToken()
        // Store token
        UICtrl.storeToken(token);
        // Get playlists 'toplist'
        const toplistPlaylists = await APICtrl.getCategoryPlaylists(token, 'toplists')
        // Add the elements to thhe interface 
        toplistPlaylists.forEach((playlist) => {
            // Get info for each playlist
            const {
                name : playlistName,
                tracks : {href : tracksEndPoint},
                href : api_url_playlist,
            } = playlist

            /* const {
                name : playlistName,
                tracks : {href : tracksEndPoint, total : amountOfTracks},
                description : infoAlbum,
                href : api_url_playlist,
                images : [{height, url : url_img, width}],
            } = playlist */

            UICtrl.createPlaylist(playlistName, api_url_playlist, tracksEndPoint);
        })

    }
    // Create a tracks tbody, image of track and playlist info 
    DOMcontainers.recommendPlaylists.addEventListener('click', async (e) => {
        // Prevent reload page
        e.preventDefault()
        // Clear playlist info
        UICtrl.resetPlaylistInfo()
        // Clear tracks
        UICtrl.resetTracks()
        // Get link selected
        const linkSelected  = DOMcontainers.recommendPlaylists.querySelector('a:focus')
        // Get stored token
        const token = UICtrl.getStoredToken().token;
        // Get paylistReference
        const playlistReference = linkSelected.attributes[2].value
        // Get playlist
        const playlistSelected = await APICtrl.getPlaylist(token, playlistReference)
        // Get tracksEndPoint
        const tracksEndPoint = linkSelected.attributes[1].value
        // Get tracks of playlist
        const tracks = await APICtrl.getTracks(token, tracksEndPoint) 
        // Posición checkbox
        var posicionFila = 0; // Apañado para ir poniendo el chekcbox en cada una de las filas
        tracks.forEach((track) => {
            // Get info for each track
            const {
                track : {
                    name: nameTrack,
                    preview_url : url_song,
                    duration_ms : duration,
                    album : {
                        images : [, {height : height_img, url : url_img, width : width_url}],
                        release_date : date
                    },
                    artists : [{ name : artist }]
                }
            } = track
            posicionFila += 1;
            UICtrl.createTrack(nameTrack, artist, Math.floor(duration * 0.001), 'single', date, url_song, posicionFila)
             // Itero la posición.
        })
        // Add button to add tracks to playlist
        UICtrl.addButtonToAddTracksToPlaylist();

    })

    


    return {
        init() {
            console.log('loading')
            loadRecommendedPlaylist();
        }
    }

})(APIcontroller, UIController_Main);

APPController.init();