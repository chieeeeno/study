var React = require("react");
var Block = require("./Block.jsx");
var Coin = require("./Coin.jsx");



var App = React.createClass({
    getInitialState : function(){
        return {
            coinClass : "img coin"
        }
    },
    render: function(){
        return(
            <div>
                <Coin coinClass={this.state.coinClass} />
                <Block classChange={this._classChange} />
            </div>
        )
    },
    _classChange: function(){
      var self = this;
      this.setState({ coinClass: "coin img animating" });
      setTimeout(function(){
        self.setState({ coinClass: "coin img" })
      },800)
    }
})

module.exports = App;
