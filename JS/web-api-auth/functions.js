
// testing await keyword.
/* async function doWork () {
    const response = await makeRequest('Google')
    console.log('Response Received')
    const processedResponse = await processRequest(response)
    console.log(processedResponse)
} */

const APIcontroller = (function() {

    const client_id = '49a52023a4f447ce86507bc0e636fed1'; // Your client ID
    const client_secret = '39c63715bd964d58af65657966b99172'; // Your client secrect

    const _getToken = async () => { // OK. Solicitar token. (Dura una hora)
        // Petición al servicio de spotify
        const response = await fetch('https://accounts.spotify.com/api/token', { 
            method : 'POST',
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(client_id + ':' + client_secret)
            },
            body : 'grant_type=client_credentials'
        })
        const data = await response.json()
        return data.access_token;
    }

    const _getCategories = async (token) => { // OK. Solicitar categorias
        const limit = 10;
        const response = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US&limit=${limit}`, {
            method : 'GET',
            headers : {
                'Authorization' : 'Bearer ' + token
            }
        })
        const data = await response.json()
        return data.categories.items
    }
    const _getCategoryPlaylists = async (token, categoryId) => { // OK. Solicitar playlist de un tipo de categoría
        const limit = 10;

        const response = await fetch(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?locale=sv_US&limit=${limit}`, {
            method : 'GET',
            headers : {
                'Authorization' : 'Bearer ' + token
            }
        })

        const data = await response.json()
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => { //OK. Solicita canciones de una playlist.
        const limit = 10;
        const response = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method : 'GET',
            headers : {
                'Authorization' : 'Bearer ' + token
            }
        })
        const data = await response.json();

        return data.items
    }

    const _getTrack = async (token, trackEndPoint) => { // OK. Solicita una canción de una playlist
        const response = await fetch(`${trackEndPoint}`, {
            method : 'GET',
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        })
        const data = await response.json();
        return data;
    }

    const _getListOfNewReleases = async (token) => {
        const response = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=10`, {
            method : 'GET',
            headers : {
                'Authorization' : 'Bearer ' + token
            }
        })

        const data = await response.json()
        return data.albums.items;
    }

    const _getListOfFeaturedPlaylist = async (token) => {
        // This url is only for testing
        const response = await fetch("https://api.spotify.com/v1/browse/featured-playlists?locale=sv_US&limit=10", {
            method : 'GET',
            headers : {
                'Authorization' : 'Bearer ' + token
            }
        })
        const data = await response.json()
        return data.playlists.items
    }

    const _getPlaylist = async (token, api_url_playlist) => {
        const response = await fetch(api_url_playlist, {
            method : 'GET',
            headers : {
                'Authorization' : 'Bearer ' + token
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
        getTrack(token, trackEndPoint){
            return _getTrack(token, trackEndPoint);
        },
        getPlaylist(token, api_url_playlist) {
            return _getPlaylist(token, api_url_playlist);
        } 
    }

})();


const UIController_Overview = (function() {

        //Object to hold references to html selects.

    const DOMElements = {
        parentContainer : '.parent',
    }

    const elements = {
        parents : document.querySelectorAll(DOMElements.parentContainer)
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
            elements.parents[0].insertAdjacentHTML('beforeend',html)
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


const UIController_Main = (function() {

    const DOMElements = {
        titleRecommendAlbum : '#title-recommend-album', // Estatico
        recommendPlaylists : '#recommend-playlists', // Estatico
        userPlaylists : '#user-playlists', // Dinamic
        imagePreviewTrack : '#image-track-preview', // Dinamic
        headerPlaylist : '#header-playlist', // Dinamic
        contentMainPage : '#content-main', // Podria usar solo este id para crear todo el contenido de la playlist.
        extraInfoPlaylist : '#extra-info-playlist', //Dinamic
        tracksTableBody : '#list-tracks',
        hiddenToken : '#hidden_token',
        // podría crear todo lo que va dentro del contenido de cada playlist desde su padre usado el id de content-main
        // Creando primero el header (playlist info), luego la infoextra (more info about playlist) y depués la tabla con las canciones.
    }


    return {
        containerField() {
            return {
                imagePreviewTrack : document.querySelector(DOMElements.imagePreviewTrack),
                headerPlaylist : document.querySelector(DOMElements.headerPlaylist),
                tracksPlaylist : document.querySelector(DOMElements.tracksTableBody),
                contentMainPlaylist : document.querySelector(DOMElements.contentMainPage),
                extraInfoPlaylist : document.querySelector(DOMElements.extraInfoPlaylist),
                recommendPlaylists : document.querySelector(DOMElements.recommendPlaylists),
            }
        },
        createPlaylist(name, api_url_playlist, tracksEndPoint){
            const html = `<li><a href='#' helper=${tracksEndPoint} value=${api_url_playlist}>${name}</a></li>`;
            document.querySelector(DOMElements.recommendPlaylists).insertAdjacentHTML('beforeend', html)
        },
        createTrack(name, artist, duration, album, date_added, url_preview, posicionFila) {
            const track = new Track(name, artist, album, duration);
            const inputCheckbox = document.createElement('input');
            inputCheckbox.type = 'checkbox'
            inputCheckbox.track = track;
            
            const html = `
            <tr class="ng-scope">
                <td>
                    <button class="ng-binding" value=${url_preview}> + </button>
                </td>
                <td>
                    <a class="ng-binding">${name}</a>
                </td>
                <td>
                    <a class="ng-binding">${artist}</a>
                </td>
                <td class="nowrap ng-binding">${duration}</td>
                <td>
                    <a class="ng-binding">${album}</a>
                </td>
                <td class="nowrap ng-binding">${date_added}</td>
            </tr>`;
            // Add to table
            document.querySelector(DOMElements.tracksTableBody).insertAdjacentHTML('beforeend', html)
            // Add to track
            //document.querySelector(DOMElements.tracksTableBody).insertAdjacentElement('beforeend', inputCheckbox)
            document.getElementsByTagName('tr')[posicionFila].insertAdjacentElement('beforeend', inputCheckbox)
        },
        createPlaylistInfo(name, description, img_url, followers){
            const html = `
            <div class="ng-isolate-scope ng-pristine ng-valid">
                <div class="cover"
                    style="background-image:url(${img_url})">
                </div>
            </div>
            <h4 class="ng-hide">COLLABORATIVE PLAYLIST</h4>
            <!--Colaborative or not-->
            <h4 class="">PLAYLIST</h4> <!-- nan -->
            <h1 class="ng-binding">${name}</h1>
            <!--Name of playlist-->
            <p class="ng-binding">${description}</p>
            <!--Description-->
            <div class="follower-count ng-binding">${followers}followers</div>
            `;
            document.querySelector(DOMElements.headerPlaylist).innerHTML = html;
        },
        createPlaylistExtraInfo(owner, total_tracks){
            const html = `
            <hr class="ng-scope">
            <!--More info about playlist-->
            <p class="ng-scope ng-binding">Created by: <a href="#/users/spotify" class="ng-binding">${owner}</a> · ${total_tracks} songs</p>
            <hr class="ng-scope">
            <br class="ng-scope">
            `;
            document.querySelector(DOMElements.extraInfoPlaylist).innerHTML = html;
        },
        resetTracks() {
            this.containerField().tracksPlaylist.innerHTML = '';
        },
        resetPlaylistInfo() {
            this.containerField().headerPlaylist.innerHTML = '';
        },
        addButtonToAddTracksToPlaylist(){
            const html = `<input type='button'value='Add to Playlist' id='addToPlaylist'>`
            document.querySelector(DOMElements.tracksTableBody).insertAdjacentHTML('beforeend', html)
        },
        storeToken(token) {
            document.querySelector(DOMElements.hiddenToken).value = token
        },
        getStoredToken(){
            return {
                token : document.querySelector(DOMElements.hiddenToken).value
            }
        }


    }

})();



export {APIcontroller, UIController_Overview, UIController_Main};

const execute = async () => {
    var token = await APIcontroller.getToken()
    var categories = await APIcontroller.getCategories(token)
    var artists = await APIcontroller.getListOfFeaturedPlaylist(token)
    const info = {
        url : categories[0].icons[0].url,
        name : categories[0].name,
        height : categories[0].icons[0].height,
        width : categories[0].icons[0].width,
        id : categories[0].id
    }



/*     const html = `<img src=${info.url} value='${info.id}' alt="${info.name}" width="${info.width}" height="${info.height}">`;
    document.querySelector('.form-container').insertAdjacentHTML('beforeend', html);

    const categorieId = document.images[0].getAttribute('value') // Sera necesario que guarde la id de la categoria para traer las playlist de la misma.

    var categoryPlaylists = await APIcontroller.getCategoryPlaylists(token, categorieId)
    
    const tracksEndPoint = categoryPlaylists[0].tracks.href;

    var tracks = await APIcontroller.getTracks(token, tracksEndPoint);
    const trackEndPoint = tracks[4].track.href;
    console.log(tracks[0].track.href) // link de una canción (no equivocarse con el preview)

    var track = await APIcontroller.getTrack(token, trackEndPoint);
    const track_previuw_url = track.preview_url; // link para reproducir la canción.

    const song = `<a value="${track_previuw_url}" id='1'></a>`;
    document.querySelector('.form-container').insertAdjacentHTML('beforeend', song);

    console.log(track.preview_url) // Con esto podríamos reproducir canciones. (30 seg)
    
    // https://developers.google.com/web/updates/2016/03/play-returns-promise

    const audio = new Audio(track_previuw_url)
    audio.play().then(function(){

    }).catch(function(error) {

    }) */

}

//execute()



/* const APPController = (function (APICtrl) {

    // get genres on page load
    const loadGenres = async () => {
        //get the token
        const token = await APICtrl.getToken();
        //store the token onto the page 
        //get the genres
        const genres = await APICtrl.getCategories(token);
        // populate our genres select element
    }

    return {
        init() {
            console.log('app is staring')
            loadGenres();
        }
    }
})(APIcontroller);
 */