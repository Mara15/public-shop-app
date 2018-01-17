import React from 'react';
import logo from '../css/images/waiter.svg'

class StorePicker extends React.Component {
  // constructor() {
  //   super();
  //   this.goToStore = this.goToStore.bind(this);
  // }
  goToStore(event) {
    event.preventDefault();
    // first grab the text from the box
    const storeId = this.storeInput.value;
    // second we're going to transition from / to /store/:storeId
    this.context.router.transitionTo(`/store/${storeId}`);
  }

  componentDidMount() {
    setTimeout(() => {
      this.context.router.transitionTo(`/store/ArtemStore}`);
    }, 5000)
  }

  render() {
    // Any where else
    return (
      <div className="store-selector-page">
        <form className="store-selector" onSubmit={(e) => this.goToStore(e)}>
          <h2>Welcome to Good Food Store</h2>

          <div className="img-wrap">
            <img src={logo} alt="waiter img"/>
          </div>
        </form>
      </div>
    )
  }
}

StorePicker.contextTypes = {
  router: React.PropTypes.object
}

export default StorePicker;
