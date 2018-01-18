import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Dish from './Dish';
import base from '../base';

class App extends React.Component {
  constructor() {
    super();

    this.addDish = this.addDish.bind(this);
    // this.removeDish = this.removeDish.bind(this);
    // this.updateDish = this.updateDish.bind(this);
    // this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);

  }

  state = {
    dishes: {},
    order: {}
  };

  componentWillMount() {
    this.ref = base.syncState(`${this.props.params.storeId}/dishes`, {
      context: this,
      state: 'dishes'
    });

    // check if there is any order in localStorage
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

    if(localStorageRef) {
      // update our App component's order state
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }

  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }

  addDish(dish) {
    // update our state
    const dishes = {...this.state.dishes};
    // add in our new dish
    const timestamp = Date.now();
    dishes[`dish-${timestamp}`] = dish;
    // set state
    this.setState({ dishes });
  }

  updateDish = (key, updatedDish) => {
    const dishes = {...this.state.dishes};
    dishes[key] = updatedDish;
    this.setState({ dishes });
  };

  removeDish = (key) => {
    const dishes = {...this.state.dishes};
    dishes[key] = null;
    this.setState({ dishes });
  };

  addToOrder(key) {
    // take a copy of our state
    const order = {...this.state.order};
    // update or add the new number of dish ordered
    order[key] = order[key] + 1 || 1;
    // update our state
    this.setState({ order });
  }

  removeFromOrder(key) {
    const order = {...this.state.order};
    delete order[key];
    this.setState({ order });
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Food Market" />
          <ul className="list-of-dishes">
            {
              Object
                .keys(this.state.dishes)
                .map(key => <Dish key={key} index={key} details={this.state.dishes[key]} addToOrder={this.addToOrder}/>)
            }
          </ul>
        </div>
        <Order
          dishes={this.state.dishes}
          order={this.state.order}
          params={this.props.params}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory
          addDish={this.addDish}
          removeDish={this.removeDish}
          dishes={this.state.dishes}
          updateDish={this.updateDish}
          storeId={this.props.params.storeId}
        />
      </div>
    )
  }
}

App.propTypes = {
  params: React.PropTypes.object.isRequired
}

export default App;
