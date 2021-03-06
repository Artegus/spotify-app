
const APIcontroller = (function () {

    const client_id = '49a52023a4f447ce86507bc0e636fed1'; // Your client ID
    const client_secret = '39c63715bd964d58af65657966b99172'; // Your client secrect

    const _getToken = async () => { // La validez de la token es de una hora.
        // Petición al servicio de spotify
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
            },
            body: 'grant_type=client_credentials'
        })

        const data = await response.json()
        return data.access_token;
    }

    const _getCategories = async (token) => { // OK. Solicitar categorias
        const limit = 10;
        const response = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json()
        return data.categories.items
    }

    const _getCategoryPlaylists = async (token, categoryId) => { // OK. Solicitar playlist de un tipo de categoría
        const limit = 15;

        const response = await fetch(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?locale=sv_US&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })

        const data = await response.json()
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => { //OK. Solicita canciones de una playlist.
        const limit = 25;
        const response = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json();

        return data.items
    }

    const _getTrack = async (token, trackEndPoint) => { // OK. Solicita una canción de una playlist
        const response = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json();
        return data;
    }

    const _getListOfNewReleases = async (token) => {
        const response = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=10`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })

        const data = await response.json()
        return data.albums.items;
    }

    const _getListOfFeaturedPlaylist = async (token) => {
        // This url is only for testing
        const response = await fetch("https://api.spotify.com/v1/browse/featured-playlists?locale=sv_US&limit=10", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json()
        return data.playlists.items
    }

    const _getPlaylist = async (token, api_url_playlist) => {
        const response = await fetch(api_url_playlist, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json()
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getCategories(token) {
            return _getCategories(token);
        },
        getCategoryPlaylists(token, categoryId) {
            return _getCategoryPlaylists(token, categoryId);
        },
        getListOfFeaturedPlaylist(token) {
            return _getListOfFeaturedPlaylist(token);
        },
        getListOfNewReleases(token) {
            return _getListOfNewReleases(token);
        },
        getArtists(token) {
            return _getArtists(token);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        },
        getPlaylist(token, api_url_playlist) {
            return _getPlaylist(token, api_url_playlist);
        }
    }

})();

// Controller for spotify_overview
const UIController_Overview = (function () {

    //Object to hold references to html selects.
    const DOMElements = {
        parentContainer: '.parent'
    }

    const elements = {
        parents: document.querySelectorAll(DOMElements.parentContainer)
    }

    return {
        createAlbum(name, img_url, img_width, img_height, spotify_url, number) { // Esta función se repite tres veces. Debe haber otra manera para arreglarlo
            const html = `
            <div class='div${number} model-album'>
                <a href="${spotify_url}" target='_blank'>
                    <img 
                        src="${img_url}" 
                        alt="${name}" 
                        height="${img_height}" 
                        width="${img_width}"
                    />
                </a>
                <div class='title-album'>
                    <p>${name}</p>
                </div>
            </div>
            `;
            elements.parents[0].insertAdjacentHTML('beforeend', html)
        },

        createPlaylist(name, img_url, img_width, img_height, spotify_url, number) {
            const html = `
            <div class='div${number} model-album'>
                <a href="${spotify_url}" target='_blank'>
                    <img 
                        src="${img_url}" 
                        alt="${name}" 
                        height="${img_height}" 
                        width="${img_width}"
                    />
                </a>
                <div class='title-album'>
                    <p>${name}</p>
                </div>
            </div>

            `;
            elements.parents[1].insertAdjacentHTML('beforeend', html)
        },
        createPlaylistOfTopList(name, img_url, img_width, img_height, spotify_url, number) {
            const html = `
            <div class='div${number} model-album'>
                <a href="${spotify_url}" target='_blank'>
                    <img 
                        src="${img_url}" 
                        alt="${name}" 
                        height="${img_height}" 
                        width="${img_width}"
                    />
                </a>
                <div class='title-album'>
                    <p>${name}</p>
                </div>
            </div>
            `;
            elements.parents[2].insertAdjacentHTML('beforeend', html)
        }

    }
})();

// Controller for spotify_home
const UIController_Main = (function () {

    const DOMElements = {
        titleRecommendAlbum: '#title-recommend-album',
        recommendPlaylists: '#recommend-playlists',
        userPlaylists: '#user-playlists',
        imagePreviewTrack: '#image-track-preview',
        headerPlaylist: '#header-playlist',
        contentMainPage: '#content-main', // Podria usar solo este id para crear todo el contenido de la playlist.
        extraInfoPlaylist: '#extra-info-playlist',
        tracksTableBody: '#list-tracks',
        hiddenToken: '#hidden_token',
        createANewPlaylist: '#newPlaylist',
        buttonCreatePlaylist: 'createPlaylist',
        buttonCancelPlaylist: 'cancelPlaylist',
        buttonAddToPlaylist: 'addToPlaylist'
        // podría crear todo lo que va dentro del contenido de cada playlist desde su padre usado el id de content-main
        // Creando primero el header (playlist info), luego la infoextra (playlist más info), track preview y por último la tabla con las canciones.
    }
    const DOMbuttons = {
        nameASC: '#orderByTrackNameASC',
        nameDES: '#orderByTrackNameDES',
        search: '#searchTrack',
        durationASC: '#orderByDurationASC',
        durationDES: '#orderByDurationDES',
        albumASC: '#orderByAlbumASC',
        albumDES: '#orderByAlbumDES',
        artistASC: '#orderByArtistASC',
        artistDES: '#orderByArtistDES',
        deleteSelected: '#deleteSelected'
    }

    const formatDurationOfPlaylist = (seconds) => {
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    }
    const formatDurationOfTrack = (seconds) => {
        return new Date(seconds * 1000).toISOString().substr(14, 5);
    }

    return {
        containerField() {
            return {
                imagePreviewTrack: document.querySelector(DOMElements.imagePreviewTrack),
                headerPlaylist: document.querySelector(DOMElements.headerPlaylist),
                tracksPlaylist: document.querySelector(DOMElements.tracksTableBody),
                contentMainPlaylist: document.querySelector(DOMElements.contentMainPage), // Sin uso
                extraInfoPlaylist: document.querySelector(DOMElements.extraInfoPlaylist),
                recommendPlaylists: document.querySelector(DOMElements.recommendPlaylists),
                buttonNewPlaylist: document.querySelector(DOMElements.createANewPlaylist),
                userPlaylists: document.querySelector(DOMElements.userPlaylists)
            }
        },
        buttonField() {
            return {
                buttonCreatePlaylist: document.getElementById(DOMElements.buttonCreatePlaylist),
                buttonCancelPlaylist: document.getElementById(DOMElements.buttonCancelPlaylist)
            }
        },
        buttonFieldControls() {
            return {
                orderByNameASC: document.querySelector(DOMbuttons.nameASC),
                orderByNameDES: document.querySelector(DOMbuttons.nameDES),
                searchTrack: document.querySelector(DOMbuttons.search),
                orderByDurationASC: document.querySelector(DOMbuttons.durationASC),
                orderByDurationDES: document.querySelector(DOMbuttons.durationDES),
                orderByAlbumASC: document.querySelector(DOMbuttons.albumASC),
                orderByAlbumDES: document.querySelector(DOMbuttons.albumDES),
                orderByArtistASC: document.querySelector(DOMbuttons.artistASC),
                orderByArtistDES: document.querySelector(DOMbuttons.artistDES),
                deleteTracks: document.querySelector(DOMbuttons.deleteSelected)
            }
        },
        createPlaylist(name, api_url_playlist, tracksEndPoint) { // Display recommend playlists 
            const html = `<li><a href='#' helper=${tracksEndPoint} value=${api_url_playlist}>${name}</a></li>`;
            document.querySelector(DOMElements.recommendPlaylists).insertAdjacentHTML('beforeend', html)
        },
        // Create track object and display tracks in table
        createTrack(name, artist, duration, album, dateAdded, url_preview, trackEndPoint, urlSpotifySong, urlSpotifyArtist, posicionFila) {
            const track = new Track(name, artist, album, duration, dateAdded, url_preview, trackEndPoint);
            const inputCheckbox = document.createElement('input'); // Creación del checkbox para poder introducir en el el objecto track. 
            inputCheckbox.type = 'checkbox'
            inputCheckbox.track = track;
            // Duration in min:ss
            const formatedDuration = formatDurationOfTrack(duration)
            const html = `
            <tr>
                <td>
                    <button class="button-play" value=${url_preview} data-song=${trackEndPoint}></button>
                </td>
                <td>
                    <a target='_blank' href=${urlSpotifySong}>${name}</a>
                </td>
                <td>
                    <a target='_blank' href=${urlSpotifyArtist}>${artist}</a>
                </td>
                <td class="nowrap ">${formatedDuration}</td>
                <td>
                    <a>${album}</a>
                </td>
                <td class="nowrap">${dateAdded}</td>
            </tr>`;
            // Add to table
            document.querySelector(DOMElements.tracksTableBody).insertAdjacentHTML('beforeend', html)
            // Add to track
            document.getElementsByTagName('tr')[posicionFila].insertAdjacentElement('beforeend', inputCheckbox)
        },
        createTrackPreview(name, urlSpotifyAlbum, nameArtist, imageUrl, artistId) {
            const html = `
            <a target='_blank' href="${urlSpotifyAlbum}">
                <img class="img-album-track" src=${imageUrl} />
            </a>
            <p>
                <b>${name}</b>
                <a target='_blank' href="https://open.spotify.com/artist/${artistId}">${nameArtist}t</a>
            </p>
            `;
            document.querySelector(DOMElements.imagePreviewTrack).innerHTML = html;
        },
        createPlaylistInfo(name, description, imageUrl, followers) {
            const html = `
            <div>
                <div
                    style="background-image:url(${imageUrl})">
                </div>
            </div>
            <h4>COLLABORATIVE PLAYLIST</h4>
            <h4>PLAYLIST</h4>
            <h1>${name}</h1>
            <p>${description}</p>
            <div class="follower-count">${followers} followers</div>
            `;
            document.querySelector(DOMElements.headerPlaylist).innerHTML = html;
        },
        createPlaylistExtraInfo(owner, total_tracks) {
            const html = `
            <hr>
            <p>Created by: <a href="#">${owner}</a> · ${total_tracks} songs</p>
            <hr>
            <br>
            `;
            document.querySelector(DOMElements.extraInfoPlaylist).innerHTML = html;
        },
        createUserPlaylistInfo(name, description, imageUrl, followers, totalDuration) {
            const duration = formatDurationOfPlaylist(totalDuration)
            const html = `
            <div>
                <div class="cover"
                    style="background-image:url(${imageUrl})">
                </div>
            </div>
            <h4>PRIVATE PLAYLIST</h4>
            <h4>PLAYLIST</h4>
            <h1>${name}</h1>
            <p>${description}</p>
            <div class="follower-count">${followers} followers · Duration ${duration}</div>
            <div class='buttons-options-table'>
                <input class='search-input' id='search' type='text' placeholder='Search track...'>
                <input id='searchTrack' class='button-default' type='button' value='Buscar'>
            </div>
            <div class='buttons-options-table'>
                <input id='orderByTrackNameASC' class='button-default' type='button' value='Name Track ASC'>
                <input id='orderByTrackNameDES' class='button-default' type='button' value='Name Track DES'>
                <input id='orderByDurationASC' class='button-default' type='button' value='Duration ASC'>
                <input id='orderByDurationDES' class='button-default' type='button' value='Duration DES'>
                <input id='orderByAlbumASC' class='button-default' type='button' value='Album ASC'>
                <input id='orderByAlbumDES' class='button-default' type='button' value='Album DES'>
                <input id='orderByArtistASC' class='button-default' type='button' value='Artist ASC'>
                <input id='orderByArtistDES' class='button-default' type='button' value='Artist DES'>
                <input id='deleteSelected' class='button-default' type='button' value='Delete selected'>
            </div>
            `;
            document.querySelector(DOMElements.headerPlaylist).innerHTML = html;
        },
        /**
         * 
         * @param {string} name name of Playlist
         * @param {User} user default User
         * @param {number} status  1 for created or 0 for new
         * @param {array} listOfTracks array of track objects
         * @param {number} totalDuration total duration of playlist
         */
        createNewUserPlaylist(name, user, status, listOfTracks = [], totalDuration = 0) { // Crea una nueva playlist del usuario. EL nombre de la función puede confundir
            if (status == 1) { // Playlist from localStorage
                // Create a new object of playlist from the stored
                const playlist = new Playlist(name, listOfTracks, totalDuration)
                // Create item list 
                const itemList_playlist = document.createElement('li')
                // Create content
                const a_playlist = document.createElement('a')
                a_playlist.href = `#${name}`
                a_playlist.innerHTML = name;
                a_playlist.playlist = playlist
                // Include content in item list
                itemList_playlist.appendChild(a_playlist)
                // Add to playlists user
                user.addNewPlaylist(playlist)
                // Add to playlists user 
                document.querySelector(DOMElements.userPlaylists).insertAdjacentElement('beforeend', itemList_playlist)
            } else { // If the playlist is new
                // Create a playlist object
                const playlist = new Playlist(name)
                // Create item list 
                const itemList_playlist = document.createElement('li')
                // Create content
                const a_playlist = document.createElement('a')
                a_playlist.href = `#${name}`
                a_playlist.innerHTML = name;
                a_playlist.playlist = playlist
                // Include content in item list
                itemList_playlist.appendChild(a_playlist)
                // Add playlist to user
                user.addNewPlaylist(playlist)
                // Add to playlists user
                document.querySelector(DOMElements.userPlaylists).insertAdjacentElement('beforeend', itemList_playlist)
            }
        },
        showMessageSongNotAvailable() {
            const html = `
            <div id='songNotAvailable'>
                <p>Sorry, the song is not available.</p>
            </div>
            `;
            document.querySelector('.midgroup').insertAdjacentHTML('beforeend', html)
        },
        showWindowToCreateNewPlaylist() {
            const html = `
            <div id='createNewPlaylist' class='window-alert'>
                <p>Enter a name for your playlist</p>
                <input type="text" id='namePlaylist'>
                <div class="createNewPlaylist-options">
                    <input class='button-newPlaylist' id='cancelPlaylist' type="button" value="Cancel">
                    <input class='button-newPlaylist' id='createPlaylist' type="button" value="Create">
                </div>
            </div>
            `;
            document.querySelector('.midgroup').insertAdjacentHTML('beforeend', html)
        },
        showWindowToAddTracksToPlaylist(userPlaylists = []) {

            const html = `
            <div id='listOfPlaylist'>
                <p>Select one of your playlist</p>
                <ul>

                </ul>
                <div class="createNewPlaylist-options">
                    <input class='button-newPlaylist' id='cancelPlaylist' type="button" value="Cancel">
                </div>
            </div>
            `;
            // show window 
            document.querySelector('.midgroup').insertAdjacentHTML('beforeend', html)
            // Add playlist elements to unordered list
            userPlaylists.forEach((playlist) => {
                const namePlaylist = playlist.name
                const listElement = document.createElement('li')
                const link = document.createElement('a')
                link.href = `#${namePlaylist}`
                link.innerHTML = namePlaylist
                link.playlist = playlist;
                listElement.appendChild(link)
                document.querySelector('#listOfPlaylist ul').insertAdjacentElement("beforeend", listElement)  // Nota, antes he usado outerHTML pero solo devuelve el fragmento html serializado.
            })

        },
        removeWindowToAddTracksToPlaylist() {
            document.querySelector('#listOfPlaylist').remove();
        },
        removeWindowToCreateNewPlaylist() {
            document.querySelector('#createNewPlaylist').remove();
        },
        removeMessageSongNotAvailable() {
            document.getElementById('songNotAvailable').remove();
        },
        resetTrackPreview() {
            this.containerField().imagePreviewTrack.innerHTML = '';
        },
        resetTracks() {
            this.containerField().tracksPlaylist.innerHTML = '';
        },
        resetPlaylistInfo() {
            this.containerField().headerPlaylist.innerHTML = '';
        },
        addButtonToAddTracksToPlaylist() {
            const html = `<input type='button'value='Add to Playlist' class='button-addToPlaylist button-default' id='addToPlaylist'>`
            document.querySelector(DOMElements.tracksTableBody).insertAdjacentHTML('beforeend', html)
        },
        storeToken(token) {
            document.querySelector(DOMElements.hiddenToken).value = token
        },
        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hiddenToken).value
            }
        }
    }

})();


// Audio Controller
const audioPlayer = (function (UICtrl) {

    // Private methods
    const _playAudioHTML = (track_previuw_url) => {
        if (track_previuw_url != 'null') {  // Check if the track has a preview
            const audio = document.getElementById('audio')
            audio.src = track_previuw_url;
            audio.play();
        } else { // Show a message if the track not have a preview
            UICtrl.showMessageSongNotAvailable();
            window.setTimeout(UICtrl.removeMessageSongNotAvailable, 2500) // Remove message after 2.5 seconds
        }
    }

    return {
        playAudioHTML(track_previuw_url) {
            return _playAudioHTML(track_previuw_url);
        }
    }

})(UIController_Main);

export { APIcontroller, UIController_Overview, UIController_Main, audioPlayer };