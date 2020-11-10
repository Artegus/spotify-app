class User {
    constructor() {
        this._name = 'Default user'
        this._listOfPlaylists = [];
    }

    get playlist() {
        return this._listOfPlaylists;
    }

    addNewPlaylist (playlist) {
        this._listOfPlaylists.push(playlist);
    }
    deletePlaylist (playlistId) {
        
    }

}