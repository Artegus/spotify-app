class Playlist {
    constructor (name) {
        this._name = name;
        this._amountOftracks = 0;
        this._listOfTracks = [];// Será un array con canciones
        this._totalDuration = 0;
        this._owner = 'Default User'
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

    removeTrack() {

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

    orderByDurationASC () {
        this._listOfTracks.sort((track1, track2) => track1.duration - track2.duration);
    }
    orderByDurationDES() {
        this._listOfTracks.sort((track1, track2) => track2.duration - track1.duration);
    }

    orderByNameASC () {
        this._listOfTracks.sort((track1, track2) => track1.name.localeCompare(track2.name))
    }
    orderByNameDES() {
        this._listOfTracks.sort((track1, track2) => track2.name.localeCompare(track1.name))
    }
    orderByAlbumASC () {
        this._listOfTracks.sort((track1, track2) => track1.album.localeCompare(track2.album))
    }
    orderByAlbumDES () {
        this._listOfTracks.sort((track1, track2) => track2.album.localeCompare(track1.album))
    }
    orderByAlbumASC () {

    }
    /**
     * 
     * @param {string} property 
     * @param {number} typeOfOrder 0 for ascending order and 1 for descending order 
     */
    orderBy (property, typeOfOrder) {
        property == 'name' ? typeOfOrder === 0 ? 
            this._listOfTracks.sort((track1, track2) => track1.name.localeCompare(track2.name)) 
            : this._listOfTracks.sort((track1, track2) => track2.name.localeCompare(track1.name)) 
        : property == 'duration' ? typeOfOrder === 0 ?
            this._listOfTracks.sort((track1, track2) => track1.duration - track2.duration)
            : this._listOfTracks.sort((track1, track2) =>track2.duration - track1.duration)
        : property == 'album' ? typeOfOrder === 0 ? 
            this._listOfTracks.sort((track1, track2) => track1.album - track2.album)
            : this._listOfTracks.sort((track1, track2) => track2.album - track1.album)
        : typeOfOrder === 0 ? // Last is for artist
            this._listOfTracks.sort((track1, track2) => track1.artist - track2.artist)
            : this._listOfTracks.sort((track1, track2) => track2.artist - track1.artist)
    }


}