import React, { Component } from 'react';

export default class InputFullSalary extends Component {
  handleInputChange = (event) => {
    const newText = event.target.value;
    this.props.onChangeSalary(newText);
  };

  render() {
    const { fullSalaryValue } = this.props;
    return (
      <div>
        <span style={{ fontSize: '10px', color: 'green' }}>Salário Bruto</span>
        <input
          type="number"
          value={fullSalaryValue}
          onChange={this.handleInputChange}
        />
      </div>
    );
  }
}
