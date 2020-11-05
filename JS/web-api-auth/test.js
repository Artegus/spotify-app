function makeRequest (location) {
    return new Promise((resolve, reject) => {
        console.log(`Making Request to ${location}`)
        if (location == 'Google') {
            resolve('Google says hi')
        } else {
            reject('WE can only talk to Google')
        }
    }) 
}

function processRequest (response) {
    return new Promise((resolve, reject) => {
        console.log('Processing response')
        resolve(`Extra information + ${response}`)
    }) 
}

/* makeRequest('Google').then(response => {
    console.log('Response Received')
    return processRequest(response)
}).then(processedResponse => {
    console.log(processedResponse)
}).catch(err => {
    console.log(err)
}) */


async function doWork () {
    const response = await makeRequest('Google')
    console.log('Response Received')
    const processedResponse = await processRequest(response)
    console.log(processedResponse)
}

const APIcontroller = (function() {

    const client_id = '49a52023a4f447ce86507bc0e636fed1'; // Your client ID
    const client_secret = '39c63715bd964d58af65657966b99172'; // Your client secrect

    const _getToken = async () => {

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(client_id + ':' + client_secret)
            },
            body : 'grant_type=client_credentials'
        })
        const data = await response.json()
        console.log(data.access_token) // Token
        return data.access_token;
    }

    const _getCategories = async (token) => {
        const response = await fetch('https://api.spotify.com/v1/browse/categories?locale=sv_US&limit=10', {
            method : 'GET',
            headers : {
                'Authorization' : 'Bearer ' + token
            }
        })
        const data = await response.json()
        console.log(data.categories.items) // Lista con las categorias
        return data.categories.items
    }
    const _getCategoryPlaylists = async (token, categoryId) => {
        const limit = 5;

        const response = await fetch(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?locale=sv_US&limit=${limit}`, {
            method : 'GET',
            headers : {
                'Authorization' : 'Bearer ' + token
            }
        })

        const data = await response.json()
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {
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

    const _getTrack = async (token, trackEndPoint) => {
        const response = await fetch(`${trackEndPoint}`, {
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        })
        const data = await response.json();
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
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint){
            return _getTrack(token, trackEndPoint);
        }
    }

})();

const execute = async () => {
    var token = await APIcontroller.getToken()
    var categories = await APIcontroller.getCategories(token)

    const info = {
        url : categories[0].icons[0].url,
        name : categories[0].name,
        height : categories[0].icons[0].height,
        width : categories[0].icons[0].width,
        id : categories[0].id
    }

    const html = `<img src=${info.url} value='${info.id}' alt="${info.name}" width="${info.width}" height="${info.height}">`;
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
    
    const audio = new Audio(track_previuw_url)
    audio.play().then(function(){

    }).catch(function(error) {

    })

}

execute()



/* var audio = new Audio(song);
    audio.play()
    console.log(song)  */


const APPController = (function (APICtrl) {

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
