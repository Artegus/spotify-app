class Playlist {
    constructor (name) {
        this._name = name;
        this._amountOftracks = 0;
        this._listOfTracks = [];// Será un array con canciones
        this._totalDuration = 0;
    }
    // Getter
    get name() { // get playlist name
        return this._name;
    }
    // Setter
    set name(updatedName) { // Change name of playlist
        this._name = updatedName;
    }

    set listOfTracks(listOfTracks) { // Add tracks
        this._listOfTracks.push(...listOfTracks);
        this._totalDuration = this.calculateDuration();
        this._amountOftracks = this.calculateAmountOfTracks();
    }
    
    // Functions
    calculateDuration() {
            return this._listOfTracks.reduce((accumulator, {duration} = track) => accumulator + duration, 0) 
    }

    calculateAmountOfTracks() {
        return this._listOfTracks.length;
    }

    showPlaylist () {
        console.log(this._listOfTracks);
    }

    orderByDuration () {
        this._listOfTracks.sort((track1, track2) => track1.duration - track2.duration);
    }

    orderByName () {
        this._listOfTracks.sort((track1, track2) => track1.name.localeCompare(track2.name))
    }

    orderByAlbum () {
        this._listOfTracks.sort((track1, track2) => track1.album.localeCompare(track2.album))
    }
}