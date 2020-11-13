
const LocaleStorageController = (function() {

    const _saveUserPlaylists = (user) => {
        localStorage.setItem('Playlists', user.playlist)
    }

    const _updateUserPLaylist = (playlist) => {
        localStorage.setItem('Playlists', playlist)
    }
    
    const _getUserPlaylist = () => {
        const playlists = localStorage.getItem('Playlists')
        console.log(playlists)
    }

    return{
        saveUserPlaylists (user) {
            return _saveUserPlaylists(user)
        },
        getUserPlaylist(){
            return _getUserPlaylist();
        },
        updateUserPlaylist (playlist) {
            _updateUserPLaylist(playlist)
        }
    }

})();

export {LocaleStorageController};
