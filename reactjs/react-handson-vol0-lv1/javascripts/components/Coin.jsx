var React = require("react");

var Coin = React.createClass({
    render: function(){
        return(
          <div className={this.props.coinClass}>
              <img src="images/coin.png" />
          </div>
        )
    }
})

module.exports = Coin;
