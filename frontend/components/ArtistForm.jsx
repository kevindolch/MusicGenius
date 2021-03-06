var React = require('react');
var ApiUtil = require('../util/api_util');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var hashHistory = require('react-router').hashHistory;
var ArtistStore = require('../stores/artist');
var ErrorStore = require('../stores/error');
var SongStore = require('../stores/song');

var ArtistForm = React.createClass({
  mixins: [LinkedStateMixin],

  getInitialState: function(){
    return {
      name: "",
      description: "",
      errors: [],
      songs: SongStore.all()
    };
  },

  componentDidMount: function() {
    ErrorStore.clear();
    this.errorToken = ErrorStore.addListener(this._onError);
    this.songToken = SongStore.addListener(this._onChange);
    ApiUtil.fetchSomeSongs({flag: "For Splash"});
    if(this.state.songs.length !== 0) {
      if (!this.state.songs[0][0].logged_in) {
        window.location.href= "/session/new";
      }
    }

  },

  _onChange: function() {
    this.setState({ songs: SongStore.all()});
    if (!this.state.songs[0][0].logged_in) {
      window.location.href= "/session/new";
    }
  },

  _onError: function() {
    this.setState({ errors: ErrorStore.all()});
  },

  componentWillUnmount: function() {
    this.errorToken.remove();
    this.songToken.remove();
  },

  handleSubmit: function(e){
    e.preventDefault();
    var artist = {name: this.state.name, decription: this.state.description};
    var that = this;
    ApiUtil.createArtist(artist, function() {
      hashHistory.push({
        pathname: '/songs/new',
        query: {name: that.state.name}
      });
    });


  },

  render: function(){
    var errors = this.state.errors.map(function(error, idx) {
      return <div key={idx}> {error} </div>;
      });
    return (
      <div>
        <div className="form-header">Create an Artist!</div>
        <div className="form-box">
        <div className="song-errors">{errors}</div>
        <form className="form" onSubmit={this.handleSubmit} >
          <label className="artist-name-label">Name
          <input className="artist-name-input" type="text" valueLink={this.linkState('name')}/>
          </label>
          <label className="artist-description-label">About the Artist
          <textarea className="artist-description-input" valueLink={this.linkState('description')}/>

          <input type="submit" value="Create Artist!" className="artist-submit" />
          </label>
        </form>
      </div>
    </div>
    );
  }
});

module.exports = ArtistForm;
