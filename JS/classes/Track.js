class Track {
    
    constructor (name, artist, album, duration, dateAdded, urlPreview, trackEndPoint) {
        this._name = name;
        this._artist = artist;
        this._album = album;
        this._duration = duration;
        this._dateAdded = dateAdded;
        this._urlPreview = urlPreview;
        this._trackEndPoint = trackEndPoint;
    }

    // Getters
    get name () {
        return this._name;
    }
    get artist () {
        return this._artist;
    }
    get album () {
        return this._album;
    }
    get duration () {
        return this._duration;
    }

}