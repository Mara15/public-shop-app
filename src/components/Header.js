import React from 'react';
import logo from '../css/images/online-store.svg'

const Header = (props) => {
  return (
    <header className="top">
      <h1>
        Good
        <span className="ofThe">
          <img src={logo} alt="logo"/>
        </span>
        Food
      </h1>
      <h3 className="tagline"><span>{props.tagline}</span></h3>
    </header>
  )
}

Header.propTypes = {
  tagline: React.PropTypes.string.isRequired
};

export default Header;
