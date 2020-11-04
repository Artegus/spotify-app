// ES6

const APIController = (function () {

    const client_id = '49a52023a4f447ce86507bc0e636fed1'; // Your client ID
    const client_secret = '39c63715bd964d58af65657966b99172'; // Your client secrect

    // private methods
    const _getToken = async () => {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(client_id + ':' + client_secret)
            },
            body : 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    const _getGenres = async (token) => {

        const result = await fetch('https://api.spotify.com/v1/browse/categories?locale=sv_US',{
            method : 'GET',
            headers : {
                'Authorization' : 'Bearer ' + token
            }
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenre = async (token, genreId) => {

        const limit = 10;
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method : 'GET',
            headers : {
                'Authorization' : 'Bearer ' + token
            }
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {
        const limit = 10;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`,{
            method : 'GET',
            headers : {
                'Authorization' : 'Bearer ' + token
            }
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {
        
        const result = await fetch(`${trackEndPoint}`, {
            method : 'GET',
            headers : {
                'Authorization' : 'Bearer ' + token
            }
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        }, 
        getGenres(token) {
            return _getGenres(token);
        }, 
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }


})(); // the last parenthesis say that the function execute immediatly



const UIController = (function () {

    //Objects to hold references to html selectors
    const DOMElements = {
        selectGenre : '#select_genre',
        selectPlaylist : '#select_playlist',
        buttonSubmit : '#btn_submit',
        hiddenToken : '#hidden_token'
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                genre : document.querySelector(DOMElements.selectGenre),
                playlist : document.querySelector(DOMElements.selectPlaylist),
                submit : document.querySelector(DOMElements.buttonSubmit),
            }
        },

        // need methods to create select list option 
        createGender (text, value) {
            const html = `<option value=${value}>${text}<option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        },

        createPlaylist(text, value) {
            const html = `<option value=${value}>${text}<option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html)
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
        },

        storeToken(value) {
            document.querySelector(DOMElements.hiddenToken).value = value
        },

        getStoredToken(){
            return {
                token : document.querySelector(DOMElements.hiddenToken).value
            }
        }
    }

})();


const APPController = (function (UICtrl, APICtrl) {

    // Get input field object ref
    const DOMinputs = UICtrl.inputField();

    // get genres on page load
    const loadGenres = async () => {
        //get the token
        const token = await APICtrl.getToken();
        //store the token onto the page 
        UICtrl.storeToken(token);
        //get the genres
        const genres = await APICtrl.getGenres(token);
        // populate our genres select element
        genres.forEach(element => UICtrl.createGender(element.name, element.id));
    }

    // create genre change event listener
    DOMinputs.genre.addEventListener('change', async () => {

        // when user changes genres, we need to reset the subsequent fields
        UICtrl.resetPlaylist()
        // get the token. add method to stroe the token on the page so we don't have to keep hitting the api for the token
        const token = UICtrl.getStoredToken().token;
        // get the genre select field
        const genreSelect = UICtrl.inputField().genre; 
        //get the selectec genreId
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;
        // get the plaulist based on a genre
        const playlist = await APICtrl.getPlaylistByGenre(token, genreId);
        //create a playlist list item for every playlist returned
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
    });
    // create submit button click event listener
    DOMinputs.submit.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        // get the token
        const token = UICtrl.getStoredToken().token;
        // get the playlist field
        const playlistSelect = UICtrl.inputField().playlist;
        // get track endpoint based on the selected playlist
        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
        // get the list of tracks
        //const tracks = await APICtrl.getTracks(token, tracksEndPoint);
        // create a track list item
        //tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
    })
    /*
    // create song selection click event listener
    DOMInputs.tracks.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        UICtrl.resetTrackDetail();
        // get the token
        const token = UICtrl.getStoredToken().token;
        // get the track endpoint
        const trackEndpoint = e.target.id;
        //get the track object
        const track = await APICtrl.getTrack(token, trackEndpoint);
        // load the track details
        UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
    });   

    */

    return {
        init() {
            console.log('app is starting');
            loadGenres();
        }
    }

})(UIController, APIController);

// will need to call a method to load the genres on page load 
APPController.init();


