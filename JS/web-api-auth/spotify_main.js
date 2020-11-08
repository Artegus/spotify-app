import {APIcontroller, UIController_Main, audioPlayer} from './functions.js';

const APPController = (function(APICtrl, UICtrl, AUDIOCtrl){

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
            followers : { total: followers },
            images : [{ url : imgPlaylist }],
            owner : { display_name : owner },
            tracks : { total : totalTracks }
        } = playlistSelected
        // Add info about album
        UICtrl.createPlaylistInfo(name, description, imgPlaylist, followers);
        UICtrl.createPlaylistExtraInfo(owner, totalTracks);
        // Get tracksEndPoint
        const tracksEndPoint = linkSelected.attributes[1].value
        // Get tracks of playlist
        const tracks = await APICtrl.getTracks(token, tracksEndPoint) 
        // Posición checkbox
        var posicionFila = 0; // Apañado para ir poniendo el chekcbox en cada una de las filas
        // Add track to tbody
        console.log(tracks)
        tracks.forEach((track) => {
            
            // Get info for each track
            const {
                track : {
                    name : nameTrack,
                    href : trackEndPoint,
                    preview_url : url_song,
                    duration_ms : duration,
                    external_urls : {urlSpotifySong},
                    album : {
                        release_date : date,
                        name : nameAlbum
                    },
                    artists : [{ name : artist, external_urls : { spotify: urlSpotifyArtist} }]
                }
            } = track
            // Itero la posición.
            posicionFila += 1;
            UICtrl.createTrack(nameTrack, artist, Math.floor(duration * 0.001), nameAlbum, date, url_song, trackEndPoint, urlSpotifySong, urlSpotifyArtist, posicionFila)
        })
        // Add button to add tracks to playlist
        UICtrl.addButtonToAddTracksToPlaylist();
    })
    // Play song and display img of song
    DOMcontainers.tracksPlaylist.addEventListener('click', async (e) => {
        // Get stored token
        const token = UICtrl.getStoredToken().token;
        // Get song selected
        const trackSelected = DOMcontainers.tracksPlaylist.querySelector('button:focus')

        if (trackSelected != null) { // Check if trackSelected != null
            UICtrl.resetTrackPreview();
            playAudio(trackSelected)
            // Get trackEndPoint
            const trackEndPoint = getSongUrl(trackSelected)
            const track = await APICtrl.getTrack(token, trackEndPoint)
            console.log(track)
            // Get information of track
            const {
                album : {
                    external_urls : {spotify : urlSpotifyAlbum},
                    images : [{url : imgUrl}]
                },
                artists : [{name : nameArtist, id : artistId}],
                name : nameTrack
            } = track

            UICtrl.createTrackPreview(nameTrack, urlSpotifyAlbum, nameArtist, imgUrl, artistId)
        }
        // Get song preview and reproduce
        //playAudio(trackSelected);
        // Get trackEndPoint 
        //const trackEndPoint = getSongUrl(trackSelected);
        //console.log(trackEndPoint)
        // Reproduce song
        //AUDIOCtrl.playAudioHTML(track_preview_url)
    })

    
    const playAudio = (trackSelected) => {
        // Get url of track  
        const track_preview_url = trackSelected.value
        // Reproduce the song
        AUDIOCtrl.playAudioHTML(track_preview_url)
    }

    const getSongUrl = (trackSelected) => { 
        return trackSelected.dataset.song;
    }

    return {
        init() {
            loadRecommendedPlaylist();
            console.log('ok :)');
        }
    }

})(APIcontroller, UIController_Main, audioPlayer);

APPController.init();