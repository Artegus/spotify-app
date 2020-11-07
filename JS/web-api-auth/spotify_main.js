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
        const toplistPlaylists = await APICtrl.getCategoryPlaylists(token, 'rock')
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
        
        // Create information of playlist selected
        const {
            name,
            description,
            followers : {total: followers},
            images : [{url : img_playlist}],
            owner : {display_name : owner},
            tracks : {total : totalTracks}
        } = playlistSelected
        UICtrl.createPlaylistInfo(name, description, img_playlist, followers);
        UICtrl.createPlaylistExtraInfo(owner, totalTracks);
        // Get tracksEndPoint
        const tracksEndPoint = linkSelected.attributes[1].value
        // Get tracks of playlist
        const tracks = await APICtrl.getTracks(token, tracksEndPoint) 
        // Posición checkbox
        var posicionFila = 0; // Apañado para ir poniendo el chekcbox en cada una de las filas
        // Add track to tbody
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

             // Itero la posición.
            posicionFila += 1;
            UICtrl.createTrack(nameTrack, artist, Math.floor(duration * 0.001), 'single', date, url_song, posicionFila)
        })

        // Add button to add tracks to playlist
        UICtrl.addButtonToAddTracksToPlaylist();
        // Add image of album
        


    })

    


    return {
        init() {
            loadRecommendedPlaylist();
            console.log('ok :)');
        }
    }

})(APIcontroller, UIController_Main);

APPController.init();