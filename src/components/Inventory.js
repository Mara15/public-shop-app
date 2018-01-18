import React from 'react';
import AddDishForm from './AddDishForm';
import base from '../base';

class Inventory extends React.Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.logout = this.logout.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      uid: null,
      owner: null
    }
  }

  componentDidMount() {
    base.onAuth((user) => {
      if(user) {
        this.authHandler(null, { user });
      }
    });
  }

  handleChange(e, key) {
    const dish = this.props.dishes[key];
    // take a copy of that dish and update it with the new data
    const updatedDish = {
      ...dish,
      [e.target.name]: e.target.value
    }
    this.props.updateDish(key, updatedDish);
  }

  authenticate(provider) {
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  logout() {
    base.unauth();
    this.setState({ uid: null });
  }

  authHandler(err, authData)  {
    if (err) {
      console.error(err);
      return;
    }

    // grab the store info
    const storeRef = base.database().ref(this.props.storeId);

    // query the firebase once for the store data
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      // claim it as our own if there is no owner already
      if(!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        });
      }

      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      });
    });

  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="facebook" onClick={() => this.authenticate('facebook')} >Log In with Facebook</button>
        <button className="twitter" onClick={() => this.authenticate('twitter')} >Log In with Twitter</button>
      </nav>
    )
  }

  renderInventory(key) {
    const dish = this.props.dishes[key];
    return (
      <div className="dish-edit" key={key}>
        <input type="text" name="name" value={dish.name} placeholder="Dish Name" onChange={(e) => this.handleChange(e, key)} />
        <input type="text" name="price" value={dish.price} placeholder="Dish Price"  onChange={(e) => this.handleChange(e, key)}/>

        <select type="text" name="status" value={dish.status} placeholder="Dish Status" onChange={(e) => this.handleChange(e, key)}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>

        <textarea type="text" name="desc" value={dish.desc} placeholder="Dish Desc" onChange={(e) => this.handleChange(e, key)}></textarea>
        <input type="text" name="image" value={dish.image} placeholder="Dish Image" onChange={(e) => this.handleChange(e, key)}/>
        <button onClick={() => this.props.removeDish(key)}>Remove Dish</button>
      </div>
    )
  }

  render() {
    const logout = <button onClick={this.logout}>Log Out!</button>;

    // check if they are no logged in at all
    if(!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    // Check if they are the owner of the current store
    if(this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry you aren't the owner of this store!</p>
          {logout}
        </div>
      )
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logout}
        {Object.keys(this.props.dishes).map(this.renderInventory)}
        <AddDishForm addDish={this.props.addDish}/>
      </div>
    )
  }

  static propTypes = {
    dishes: React.PropTypes.object.isRequired,
    updateDish: React.PropTypes.func.isRequired,
    removeDish: React.PropTypes.func.isRequired,
    addDish: React.PropTypes.func.isRequired,
    storeId: React.PropTypes.string
  };
}

export default Inventory;
