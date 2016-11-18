var React = require("react");
var count = 0;
var MAX_COUNT = 10;

var Block = React.createClass({
    getInitialState: function(){
      return{
        isAnimating: false
      }
    },
    render: function(){
        return(
            <div className="img block" onClick={this._onClick}>
              <img ref="block_image" src="images/block.png"/>
            </div>
        )
    },
    _onClick:function(){
      if(this.state.isAnimating) return;

      if(count < MAX_COUNT){
        var self = this;
        this.setState({ isAnimating: true });
        this.props.classChange();
        setTimeout(function(){
          self.setState({ isAnimating: false });
        },800)
        count++;
      }else{
        this.refs.block_image.src = "images/block_close.png";
        alert("コインはもう出ません");
      }

    }
})

module.exports = Block;
