/*

Make these two components work like a normal <select><option/></select>
component.

First, don't worry about accessibility, we want to illustrate controlled v.
uncontrolled components first.

First, make the uncontrolled usage work. This means it will keep the value in
state.

1. Get the label to display correctly based on state.
2. When you click the component it opens/closes
3. When you click an option the component closes and updates the value in
   state, and the label displays correctly

Now, make the uncontrolled version work. Instead of reading from state, you'll
read from props, and instead of setting state, you'll need to do something
else!

Once you've got that done, get started on making it accessible.

Here are some guides, but we'll be doing it together as a class, too.

https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox
https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-collapsible.html

*/

import "./index.css";
import React, { Component, Children, cloneElement } from "react";
import PropTypes from "prop-types";

class Select extends Component {
  state = {
    isOpen: false,
    selectedValue: this.props.defaultValue
  }

  onSelect = value => this.setState({ selectedValue: value }, console.log(value))

  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    defaultValue: PropTypes.any
  };

  isControlled() {
    const { value } = this.props

    return (value !== undefined)
  }

  render() {
    const  { isOpen, selectedValue } = this.state;
    const { children } = this.props

    const cloned = Children.map(children, (child, i) => {
      return cloneElement(child, {
        onSelect: () => this.isControlled() ? this.props.onChange(child.props.value) : this.onSelect(child.props.value)
      })
    })

    const selectValue = this.isControlled() ? this.props.value : selectedValue

    return (
      <div className="select" onClick={() => this.setState(({ isOpen }) => ({ isOpen: !isOpen }))}>
        <button className="label">
          {selectValue === null ? 'label' : selectValue} <span className="arrow">▾</span>
        </button>
        {isOpen && (
          <ul className="options">
            {
              cloned
            }
          </ul>
        )}
      </div>
    );
  }
}

class Option extends React.Component {
  render() {
    return <li className="option" onClick={this.props.onSelect}>{this.props.children}</li>;
  }
}

class App extends React.Component {
  state = {
    selectValue: "dosa"
  };

  setToMintChutney = () => {
    this.setState({
      selectValue: "mint-chutney"
    });
  };

  render() {
    return (
      <div className="app">
        <div className="block">
          <h2>Uncontrolled</h2>
          <Select defaultValue="tikka-masala">
            <Option value="tikka-masala">Tikka Masala</Option>
            <Option value="tandoori-chicken">Tandoori Chicken</Option>
            <Option value="dosa">Dosa</Option>
            <Option value="mint-chutney">Mint Chutney</Option>
          </Select>
        </div>

        <div className="block">
          <h2>Controlled</h2>
          <p>
            <button onClick={this.setToMintChutney}>Set to Mint Chutney</button>
          </p>
          <Select
            value={this.state.selectValue}
            onChange={selectValue => {
              this.setState({ selectValue });
            }}
          >
            <Option value="tikka-masala">Tikka Masala</Option>
            <Option value="tandoori-chicken">Tandoori Chicken</Option>
            <Option value="dosa">Dosa</Option>
            <Option value="mint-chutney">Mint Chutney</Option>
          </Select>
        </div>
      </div>
    );
  }
}

export default App;
