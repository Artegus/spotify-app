import {APIcontroller, UIController_Main, audioPlayer} from './functions.js';
import {LSController} from '../data/local_storage.js';

const APPController = (function(APICtrl, UICtrl, AUDIOCtrl, LocalStorageCtrl){

    // Get containers field
    const DOMcontainers = UICtrl.containerField();
    // Create a default user
    const defaultUser = new User();
    // Save playlists of user default. 
    if(!localStorage.getItem('playlists')){
        LocalStorageCtrl.saverUserPlaylists(defaultUser);
    }
    const loadRecommendedPlaylists = async () => {
        // Get token
        const token = await APICtrl.getToken()
        // Store token
        UICtrl.storeToken(token);
        // Get playlists 'toplists'
        const toplistPlaylists = await APICtrl.getCategoryPlaylists(token, 'toplists')
        // Add the elements to the interface 
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
    const loadUserPlaylists = () => {
        // Get user playlist
        const userPlaylists = LocalStorageCtrl.getUserPlaylists();
        if (userPlaylists.length != 0) {
            userPlaylists.forEach((playlist) => {
                
                const {
                    _amountOftracks : amountOftracks,
                    _listOfTracks : listOfTracks,
                    _name : namePlaylist,
                    _owner : ownerPlaylist,
                    _totalDuration : totalDuration
                } = playlist 

                UICtrl.createNewUserPlaylist(namePlaylist, defaultUser, 1, playlist);
            })
        }
    }
    // Displays the songs from the playlists created by the user
    const mostrarCanciones = (playlist) => {
        // Clear the tracks section
        UICtrl.resetTracks();
        // Get stored token
        //const token = UICtrl.getStoredToken().token

        // Display the tracks in two different ways
        var randomNumber = 1//Math.floor(Math.random() * 2 + 1); // 1 = En forma de tabla; 2 = Imagenes de las canciones como en spotify_overview
        var posicionFila = 0; // Necessary to place the input checkbox
        if(randomNumber == 1) {
            playlist.forEach((track) => {
                // Get info
                const {
                    _album : album,
                    _artist : artist,
                    _dateAdded : dateAdded,
                    _duration : duration,
                    _name : trackName,
                    _trackEndPoint : trackEndPoint,
                    _urlPreview : urlPreview,
                } = track;
                // Get extra info 
                /*
                Para cargar la información extra de canción necesito poner async a la función flecha pero eso conlleva  
                una desincronización con todo el proceso de adición de filas, pero en si el array de canciones está ordenado.
                const extraInfoTrack = await APICtrl.getTrack(token, trackEndPoint);
                const {
                    artists : [{external_urls : {spotify : spotifyArtist}}],
                    external_urls : { spotify : spotifySong}
                } = extraInfoTrack; */
                posicionFila++;
                // Add track to tbody
                UICtrl.createTrack(trackName, artist, duration, album, dateAdded, urlPreview, trackEndPoint, 'spotifySong', 'spotifyArtist', posicionFila);
            })
        } else {
            // Second way. Working...!
        }
    }

    // Create a tbody with tracks and playlist info 
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
        // Get pĺaylistReference
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
        // Add info about playlist
        UICtrl.createPlaylistInfo(name, description, imgPlaylist, followers);
        UICtrl.createPlaylistExtraInfo(owner, totalTracks);
        // Get tracksEndPoint
        const tracksEndPoint = linkSelected.attributes[1].value
        // Get tracks of playlist
        const tracks = await APICtrl.getTracks(token, tracksEndPoint) 
        // Posición checkbox
        var posicionFila = 0; // Apañado para ir poniendo el checkbox en cada una de las filas
        // Add track to tbody
        tracks.forEach((track) => {
            
            // Get info for each track
            const {
                track : {
                    name : nameTrack,
                    href : trackEndPoint,
                    preview_url : url_song,
                    duration_ms : duration,
                    external_urls : {spotify : urlSpotifySong},
                    album : {
                        release_date : date,
                        name : nameAlbum
                    },
                    artists : [{ name : artist, external_urls : { spotify: urlSpotifyArtist} }]
                }
            } = track
            // Iterate position of checkbox.
            posicionFila += 1;
            // Display track in the table
            UICtrl.createTrack(nameTrack, artist, Math.floor(duration * 0.001), nameAlbum, date, url_song, trackEndPoint, urlSpotifySong, urlSpotifyArtist, posicionFila)
        })
        // Add button to add tracks to playlist
        UICtrl.addButtonToAddTracksToPlaylist();


        // Event added to button 'Add to Playlist' to show the window of adding songs to a playlist
        document.getElementById('addToPlaylist').addEventListener('click', (e) => {
            // Get user playlists
            const userPlaylists = defaultUser.playlists;
            // Fixes an error if the window to create a playlist and the window to add songs are open at the same time
            if (document.getElementById('createNewPlaylist')) {
                UICtrl.removeWindowToCreateNewPlaylist()
            }
            // Show window with user playlists
            UICtrl.showWindowToAddTracksToPlaylist(userPlaylists);

            // Get the selected playlist and add the songs to it
            document.querySelector('#listOfPlaylist ul').addEventListener('click', (e) => {
                // Get tracks selected 
                const checkboxSelected = DOMcontainers.tracksPlaylist.querySelectorAll("input[type=checkbox]:checked")
                const tracksSelected = [...checkboxSelected].map((checkbox) => checkbox.track)
                // Get selected playlist
                const selectedElement = document.querySelector('a:focus')
                // Get playlist object
                const playlistSelected = selectedElement.playlist
                // Add tracks to playlist
                playlistSelected.listOfTracks = tracksSelected;
                // Update the User playlist with songs
                LocalStorageCtrl.saverUserPlaylists(defaultUser);
                // Close the window
                UICtrl.removeWindowToAddTracksToPlaylist();
            })

            // Cancel button
            const buttonCancel = UICtrl.buttonField().buttonCancelPlaylist;
            // event is added to cancel button to remove the window has created
            buttonCancel.addEventListener('click', (e) => {
                UICtrl.removeWindowToAddTracksToPlaylist();
            })
        });
    })

    // Create info of user Playlist. Events to the buttons to order, search and remove tracks
    DOMcontainers.userPlaylists.addEventListener('click', (e) => {
        // Prevent reload page
        e.preventDefault()
        // Clear playlist info
        UICtrl.resetPlaylistInfo()
        // Clear tracks
        UICtrl.resetTracks()
        // Get link selected
        const linkSelected  = DOMcontainers.userPlaylists.querySelector('a:focus')
        // Get playlist
        const playlist = linkSelected.playlist;

        // Get info playlist
        const {
            _amountOftracks : numberOfTracks,
            _name : playlistName,
            _listOfTracks : listOfUserTracks,
            _totalDuration : totalDuration,
            _owner : owner
        } = playlist;
        // Create header playlist 
        UICtrl.createUserPlaylistInfo(playlistName,'Standard description', '../img/playlist_default.png', 1, totalDuration)
        UICtrl.createPlaylistExtraInfo(owner, numberOfTracks);
        // Display tracks
        mostrarCanciones(listOfUserTracks);
        // Get options buttons
        const DOMbuttons = UICtrl.buttonFieldControls();
        
        DOMbuttons.orderByNameASC.addEventListener('click', (e) => {
            playlist.orderBy('name', 0)
            mostrarCanciones(listOfUserTracks)
        })

        DOMbuttons.orderByNameDES.addEventListener('click', (e) => {
            playlist.orderBy('name', 1);
            mostrarCanciones(listOfUserTracks)
        })
        DOMbuttons.orderByDurationASC.addEventListener('click', (e) => {
            playlist.orderBy('duration', 0);
            mostrarCanciones(listOfUserTracks)
        })
        DOMbuttons.orderByDurationDES.addEventListener('click', (e) => {
            playlist.orderBy('duration', 1)
            mostrarCanciones(listOfUserTracks)
        })
        DOMbuttons.orderByAlbumASC.addEventListener('click', (e) => {
            playlist.orderBy('album', 0)
            mostrarCanciones(listOfUserTracks);
        })
        DOMbuttons.orderByAlbumDES.addEventListener('click', (e) => {
            playlist.orderBy('album', 1)
            mostrarCanciones(listOfUserTracks);
        })
        DOMbuttons.orderByArtistASC.addEventListener('click', (e) => {
            playlist.orderBy('artist', 0)
            mostrarCanciones(listOfUserTracks)
        })
        DOMbuttons.orderByArtistDES.addEventListener('click', (e) => {
            playlist.orderBy('artist', 1)
            mostrarCanciones(listOfUserTracks)
        })
        DOMbuttons.searchTrack.addEventListener('click', (e) => {
            const trackToSearch = document.getElementById('search').value.toLocaleUpperCase()

            if(trackToSearch.length !== 0 || trackToSearch !== '') {
                const trackFound = playlist.searchTrack(trackToSearch);
                mostrarCanciones(trackFound);
            }
        })
        DOMbuttons.deleteTracks.addEventListener('click', (e) => {
            // Get checkboxs selected
            const checkboxSelected = DOMcontainers.tracksPlaylist.querySelectorAll("input[type=checkbox]:checked")
            if (checkboxSelected != 0) {
                // Get name tracks PRUEBA CON NOMBRE
                const tracks = [...checkboxSelected].map((checkbox) => checkbox.track.name)
                // Remove tracks selected
                playlist.removeTracks(tracks);
                // Update  the User playlist with songs
                LocalStorageCtrl.saverUserPlaylists(defaultUser);
                // Refresh tracks
                mostrarCanciones(listOfUserTracks);
            }
        })


    })

    // Play and display img of song
    DOMcontainers.tracksPlaylist.addEventListener('click', async (e) => {
        // Get stored token
        const token = UICtrl.getStoredToken().token;
        // Get song selected
        const trackSelected = DOMcontainers.tracksPlaylist.querySelector('button:focus')

        if (trackSelected) { // Check if trackSelected != null.
            UICtrl.resetTrackPreview();
            playAudio(trackSelected)
            // Get trackEndPoint
            const trackEndPoint = getSongUrl(trackSelected)
            const track = await APICtrl.getTrack(token, trackEndPoint)
            // Get information of track
            const {
                album : {
                    external_urls : {spotify : urlSpotifyAlbum},
                    images : [{url : imgUrl}]
                },
                artists : [{name : nameArtist, id : artistId}],
                name : nameTrack
            } = track
            // Create track preview
            UICtrl.createTrackPreview(nameTrack, urlSpotifyAlbum, nameArtist, imgUrl, artistId)
        }
    })

    // Show window to create a new playlist
    DOMcontainers.buttonNewPlaylist.addEventListener('click', (e) => {
        // Fixes an error if the window to create a playlist and the window to add songs are open at the same time
        if (document.getElementById('listOfPlaylist')) {
            UICtrl.removeWindowToAddTracksToPlaylist();
        }

        UICtrl.showWindowToCreateNewPlaylist();
        const DOMbuttons = UICtrl.buttonField();

        DOMbuttons.buttonCancelPlaylist.addEventListener('click', (e) => {
            UICtrl.removeWindowToCreateNewPlaylist();
        })

        DOMbuttons.buttonCreatePlaylist.addEventListener('click', (e) => {
            // Get name of playlist
            const namePlaylist = document.getElementById('namePlaylist').value
            // Add new playlist to user
            if (namePlaylist != '') {
                UICtrl.createNewUserPlaylist(namePlaylist, defaultUser, 0);
                // Save new playlists in local Storage
                LocalStorageCtrl.saverUserPlaylists(defaultUser);
            }
            UICtrl.removeWindowToCreateNewPlaylist();
        })

    })



    // Play audio 
    const playAudio = (trackSelected) => {
        // Get url of track  
        const track_preview_url = trackSelected.value
        // Reproduce the song
        AUDIOCtrl.playAudioHTML(track_preview_url)
    }
    // Get url_preview
    const getSongUrl = (trackSelected) => {
        return trackSelected.dataset.song;
    }

    return {
        init() {
            // Initial loading of recommended playlists
            loadRecommendedPlaylists();
            loadUserPlaylists();
            console.log('ok :)');
        }
    }

})(APIcontroller, UIController_Main, audioPlayer, LSController);

APPController.init();