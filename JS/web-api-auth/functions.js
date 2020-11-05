
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
        const limit = 5;
        const response = await fetch(`${tracksEndPoint}?limit=${5}`, {
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



export {APIcontroller, UIController_Overview};

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