class Usuario {
    constructor(listOfPlaylists = []) {
        this._name = 'Default user'
        this._listaPlaylist = listOfPlaylists;
    }

    addNewPlaylist (playlist) {
        this._listaPlaylist.push(playlist);
    }
    deletePlaylist (playlistId) {
        this._listaPlaylist.findIndex(playlist => playlist.id == playlistId)
    }

}