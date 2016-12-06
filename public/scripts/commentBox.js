var ImageBox = React.createClass({
  loadImagesFromServer: function () {
    $.ajax({
      url: this.props.url,	
      dataType: 'json', 
      success: function (data, textStatus, jqXHR) {
	this.setState({data: data});
      }.bind(this),
      error: function (jqXHR, textStatus, errorThrown) {
	console.error(this.props.url, textStatus, errorThrown.toString());
      }.bind(this)
    });
  },
  handleImageSubmit: function (image) {
    var images = this.state.data;
    image.id = Date.now();
    var newImages = images.concat([image]);
    this.setState({data: newImages});
    $.ajax({
      url: this.props.url,
      type: 'POST',
      dataType: 'json',
      data: image,
      success: function (data, textStatus, jqXHR) {
        this.setState({data: data})
      }.bind(this),
      error: function (jqXHR, textStatus, errorThrown) {
	this.setState({data: images});
        console.error(this.props.url, textStatus, errorThrown.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function () {
    this.loadImagesFromServer();
    setInterval(this.loadImagesFromServer, this.props.pollInterval);
  },
  render: function () {
    return (
      <div className="imageBox">
	<h1>Images</h1>
	<ImageList data={this.state.data} />
	<ImageForm onImageSubmit={this.handleImageSubmit} />
      </div>
    )
  }
});

var ImageList = React.createClass({
  render: function () {
    // this variable is rendered in the top functions return statement as a 
    // variable being passed through
    var imageNodes = this.props.data.map(function(image) {
      return (
	  <Image author={image.author} key={image.id} text={image.text}>
	  </Image> 
	  )
    });
    // this bit actually gets rendered
    return (
	<div className="imageList">
	{imageNodes}
	</div>

	)
  }
});

var ImageForm = React.createClass({
  getInitialState: function () {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function (e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onImageSubmit({author: author, text: text});
    this.setState({author: '', text: ''})
  },
  render: function () {
    return (
      <form className="imageForm" onSubmit={this.handleSubmit}>
	<input 
	  type="text"  
	  placeholder="You name" 
	  value={this.state.author} 
	  onChange={this.handleAuthorChange} 
	/>
	<input 
	  type="text" 
	  placeholder="Say something..." 
	  value={this.state.text}
	  onChange={this.handleTextChange}
	/>
	<input type="submit" value="Post" /> 
      </form>
    )
  }
});

// var Image = React.createClass({
//   rawMarkup: function () {
    // this function replaces the line:
    //   { md.render(this.props.children.toString()) }
    // which incorrectly renders html as text
    // var md = new Remarkable();
    // var rawMarkup = md.render(this.props.children.toString());
    // return {__html: rawMarkup };
//   },
//   render: function () { 
//     return (
// 	<div className="image">
// 	  <h2 className="imageAuthor">
// 	    { this.props.author }
// 	  </h2>
// 	  <img src={ this.props.text } alt="" />
//
// 	</div>
// 	)
//   }
// });

const Image = (props) => React.DOM.div({
    className: 'image'
  }, [ 
  React.DOM.h2({
    className: 'imageName' }, props.author),
  React.DOM.img({
    src: props.text,
    alt: props.author
  })]
);

ReactDOM.render(
    <ImageBox url='/api/comments' pollInterval={200000} />,
      document.getElementById('content')
    );
