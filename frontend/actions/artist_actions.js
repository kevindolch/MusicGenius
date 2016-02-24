
var AppDispatcher = require('../dispatcher/dispatcher');
var ArtistConstants = require('../constants/artist_constants');


var ArtistActions = {
  receiveOne: function(artist) {
    AppDispatcher.dispatch({
      actionType: ArtistConstants.ARTIST_RECEIVED,
      artist: artist
    });
  }
};

module.exports = ArtistActions;
