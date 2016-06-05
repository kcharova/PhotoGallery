/*
 * The Photo Gallery component represents an album of photos.
 * It tiles Photo Blocks and is responsible for navigation and the fullscreen photo view.
 */
var PhotoGallery = React.createClass({
  getInitialState: function() {
    return {fullScreenPhotoIndex: -1};
  },

  // Close the full screen view when full photo is clicked
  handleFullPhotoClick: function() {
    this.setState({fullScreenPhotoIndex: -1});
  },

  // Display full screen photo when thumbnail is clicked
  handlePhotoClick: function (photoIndex) {
    this.setState({fullScreenPhotoIndex: photoIndex});
  },

  // Determines which photo is clicked within photo block
  handleBlockClick: function(blockStartIndex, cellIndex) {
    this.handlePhotoClick(blockStartIndex + cellIndex);
  },

  // Change the full screen photo when navigation arrows are clicked
  handlePhotoNavClick: function(delta, evt) {
    var newImageIndex = this.state.fullScreenPhotoIndex + delta;

    // Loop to the beginning or end of the gallery when the user reaches the last photo.
    if(newImageIndex < 0) {
      newImageIndex = this.props.photoURLs.length - 1;
    } else if (newImageIndex >= this.props.photoURLs.length) {
      newImageIndex = 0;
    }

    this.setState({fullScreenPhotoIndex: newImageIndex});

    evt.preventDefault();
    evt.stopPropagation();
  },

  render: function() {
    var photoBlocks = [];

    // Construct Photo Block components
    var numImages = this.props.photoURLs.length;
    var currentImageIndex = 0;

    while(currentImageIndex < numImages)
    {
      var photoBlockImages = [];
      var photoBlockClickCallback = this.handleBlockClick.bind(this, currentImageIndex);

      var numImagesInBlock = this.getNumImagesInPhotoBlock(photoBlocks.length);
      for(var i = 0; i < numImagesInBlock && currentImageIndex < numImages; i++)
      {
        photoBlockImages.push(this.props.photoURLs[currentImageIndex++]);
      }
      photoBlocks.push( <PhotoBlock images={photoBlockImages} onPhotoClick={photoBlockClickCallback}/> );
    }

    // Construct Full Photo component
    var fullPhotoURL = null;
    var fullPhotoImageIndex = this.state.fullScreenPhotoIndex;
    if (fullPhotoImageIndex >= 0 && fullPhotoImageIndex < numImages) {
      fullPhotoURL = this.props.photoURLs[fullPhotoImageIndex];
    }

    return (
      <div className="photoGallery">
        { photoBlocks }
        <FullPhoto photoURL={fullPhotoURL} onClick={this.handleFullPhotoClick}>
          <PhotoNav className="photoNav leftArrow" onClick={this.handlePhotoNavClick.bind(this, -1)}/>
          <PhotoNav className="photoNav rightArrow" onClick={this.handlePhotoNavClick.bind(this, 1)}/>
        </FullPhoto>
      </div>
    );
  },

  // Returns the number of photos that will be displayed in a given Photo Block.
  getNumImagesInPhotoBlock: function(blockIndex) {
    // Sample layout config. This config can be passed to the gallery for further customization.
    var layoutConfig = [1,2,3,4];
    return layoutConfig[blockIndex % layoutConfig.length];
  }

});

/*
 * A Photo Block contains between 1 to 4 images and uses a different layout
 * depending on the number of images it receives.
 */
var PhotoBlock = React.createClass({
  render: function() {
    var numImages = this.props.images.length;

    // A Photo Block has 4 layouts represented by cells of different sizes. the
    // type of layout used depends on the number of images taht it needs to display.
    if( numImages == 1 ) {
      return (
        <div className="photoBlock">
          <Photo onClick={this.props.onPhotoClick.bind(this, 0)} className="cell_1" photoURL={ this.props.images[0] } />
        </div>
        );
    } else if ( numImages == 2 ) {
      return (
        <div className="photoBlock">
          <Photo onClick={this.props.onPhotoClick.bind(this, 0)} className="cell_2h" photoURL={ this.props.images[0] } />
          <Photo onClick={this.props.onPhotoClick.bind(this, 1)} className="cell_2h" photoURL={ this.props.images[1] } />
        </div>
      );
    } else if ( numImages == 3 ) {
      return (
        <div className="photoBlock">
          <Photo onClick={this.props.onPhotoClick.bind(this, 0)} className="cell_2v" photoURL={ this.props.images[0] } />
          <Photo onClick={this.props.onPhotoClick.bind(this, 1)} className="cell_4" photoURL={ this.props.images[1] } />
          <Photo onClick={this.props.onPhotoClick.bind(this, 2)} className="cell_4" photoURL={ this.props.images[2] } />
        </div>
        );
    } else {
      return (
        <div className="photoBlock">
          <Photo onClick={this.props.onPhotoClick.bind(this, 0)} className="cell_4" photoURL={ this.props.images[0] } />
          <Photo onClick={this.props.onPhotoClick.bind(this, 1)} className="cell_4" photoURL={ this.props.images[1] } />
          <Photo onClick={this.props.onPhotoClick.bind(this, 2)} className="cell_4" photoURL={ this.props.images[2] } />
          <Photo onClick={this.props.onPhotoClick.bind(this, 3)} className="cell_4" photoURL={ this.props.images[3] } />
        </div>);
    }
  }
});

/*
 * A Photo component represents a single photo. For the purposes of this demo,
 * Photo uses the full sized image URL. If you have large photos, I suggest replacing
 * this with a thumbnail URL and reserving the actual photo url for the Full Photo view
 * (you will have to pass in both to the gallery).
 */
var Photo = React.createClass({
  render: function() {
    var divStyle = {
      backgroundImage: 'url(' + this.props.photoURL + ')'
    };
    return (
      <div className={"photoPreview "+this.props.className} style={divStyle} onClick={this.props.onClick} />
    );
  }
});

/*
 * The Full Photo component represents a full screen view of the photo.
 * It also contains the navigation arrow components.
 */
var FullPhoto = React.createClass({
  render: function() {
    if (!this.props.photoURL) {
      return (<div />);
    }

    return (
      <div className="fullPhoto" onClick={this.props.onClick}>
        <img src={ this.props.photoURL } />
        {this.props.children}
      </div>
    );
  }
});

// Navigation arrows for the full size photo views
var PhotoNav = React.createClass({
  render: function() {
    return (
      <div className={this.props.className} onClick={this.props.onClick} />
    );
  }
});

// Workaround for Babel's limited scoping after migration from JSXTransformer
window.PhotoGallery = PhotoGallery;
window.PhotoBlock = PhotoBlock;
window.Photo = Photo;
window.FullPhoto = FullPhoto;
window.PhotoNav = PhotoNav;
