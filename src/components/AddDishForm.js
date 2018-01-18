import React from 'react';

class AddDishForm extends React.Component {
  createDish(event) {
    event.preventDefault();
    const dish = {
      name: this.name.value,
      price: this.price.value,
      status: this.status.value,
      desc: this.desc.value,
      image: this.image.value,
    }
    this.props.addDish(dish);
    this.dishForm.reset();
  }

  render() {
    return (
      <form ref={(input) => this.dishForm = input} className="dish-edit" onSubmit={(e) => this.createDish(e)}>
        <input ref={(input) => this.name = input} type="text" placeholder="Dish Name" />
        <input ref={(input) => this.price = input} type="text" placeholder="Dish Price" />
        <select ref={(input) => this.status = input}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea ref={(input) => this.desc = input} placeholder="Dish Desc" ></textarea>
        <input ref={(input) => this.image = input} type="text" placeholder="Dish Image" />
        <button type="submit">+ Add Item</button>
      </form>
    )
  }
}

AddDishForm.propTypes = {
  addDish: React.PropTypes.func.isRequired
}

export default AddDishForm;
