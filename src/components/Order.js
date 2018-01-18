import React from 'react';
import { formatPrice } from '../helpers';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import StripeCheckout from './StripeCheckout'

class Order extends React.Component {
  constructor() {
    super();
    this.renderOrder = this.renderOrder.bind(this);
  }
  renderOrder(key) {
    const dish = this.props.dishes[key];
    const count = this.props.order[key];
    const removeButton = <button onClick={() => this.props.removeFromOrder(key)}>&times;</button>

    if(!dish || dish.status === 'unavailable') {
      return <li key={key}>Sorry, {dish ? dish.name : 'dish'} is no longer available!{removeButton}</li>
    }

    return (
      <li key={key}>
        <span>
          <CSSTransitionGroup
            component="span"
            className="count"
            transitionName="count"
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}
          >
            <span key={count}>{count}</span>
          </CSSTransitionGroup>

          lbs {dish.name} {removeButton}
        </span>
        <span className="price">{formatPrice(count * dish.price)}</span>

      </li>
    )
  }

  goToThankYouPage() {
    this.context.router.transitionTo(`/thank-you`);
  }

  render() {
    const orderIds = Object.keys(this.props.order);
    const total = orderIds.reduce((prevTotal, key) => {
      const dish = this.props.dishes[key];
      const count = this.props.order[key];
      const isAvailable = dish && dish.status === 'available';
      if(isAvailable) {
        return prevTotal + (count * dish.price || 0)
      }
      return prevTotal;
    }, 0);
    return (
      <div className="order-wrap">
        <h2>Your Order</h2>

        <CSSTransitionGroup
          className="order"
          component="ul"
          transitionName="order"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {formatPrice(total)}
          </li>
        </CSSTransitionGroup>

        {
          total > 0 && <div className="checkout-btn">
            <StripeCheckout
              name="GOOD FOOD" // the pop-in header title
              description="Best dishes for you! // the pop-in header subtitle"
              ComponentClass="div"
              panelLabel="Give Money" // prepended to the amount in the bottom pay button
              amount={formatPrice(total)} // cents
              currency="USD"
              stripeKey="..."
              locale="pl"
              email="marakua15@gmail.com"
              // Note: Enabling either address option will give the user the ability to
              // fill out both. Addresses are sent as a second parameter in the token callback.
              shippingAddress
              billingAddress={false}
              // Note: enabling both zipCode checks and billing or shipping address will
              // cause zipCheck to be pulled from billing address (set to shipping if none provided).
              zipCode={false}
              alipay // accept Alipay (default false)
              bitcoin // accept Bitcoins (default false)
              allowRememberMe // "Remember Me" option (default true)
              token={() => this.goToThankYouPage()} // submit callback
              opened={() => console.log('opened')} // called when the checkout popin is opened (no IE6/7)
              closed={() => console.log('closed')} // called when the checkout popin is closed (no IE6/7)
              // Note: `reconfigureOnUpdate` should be set to true IFF, for some reason
              // you are using multiple stripe keys
              reconfigureOnUpdate={false}
              // Note: you can change the event to `onTouchTap`, `onClick`, `onTouchStart`
              // useful if you're using React-Tap-Event-Plugin
              triggerEvent="onTouchTap"
            >
              <button className="btn btn-primary">
                Pay with card!
              </button>
            </StripeCheckout>
          </div>
        }
      </div>
    )
  }
}

Order.propTypes = {
  dishes: React.PropTypes.object.isRequired,
  order: React.PropTypes.object.isRequired,
  removeFromOrder: React.PropTypes.func.isRequired,
};

export default Order;
