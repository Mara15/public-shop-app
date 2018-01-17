import React from 'react';
import logo from '../css/images/waiter.svg'

class StorePicker extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.context.router.transitionTo(`/store/ArtemStore`);
    }, 3000)
  }

  render() {
    // Any where else
    return (
      <div className="store-selector-page">
        <div className="store-selector">
          <h2>Welcome to Good Food Store</h2>

          <div className="img-wrap">
            <img src={logo} alt="waiter img"/>
          </div>
        </div>
      </div>
    )
  }
}

StorePicker.contextTypes = {
  router: React.PropTypes.object
}

export default StorePicker;
