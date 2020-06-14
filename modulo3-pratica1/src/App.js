import React, { Component } from 'react';
import InputFullSalary from './components/inputFullSalary/InputFullSalary';
import InputReadOnly from './components/inputReadOnly/InputReadOnly';
import ProgressBarSalary from './components/progressBarSalary/ProgressBarSalary';
import { calculateSalaryFrom } from './helpers/salary';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      fullSalary: 1000,
      salaryCalculated: calculateSalaryFrom(1000),
    };
  }

  handleChangeSalary = (newText) => {
    const salaryCalculated = calculateSalaryFrom(newText);

    this.setState({
      fullSalary: newText,
      salaryCalculated,
    });
  };
  render() {
    const { fullSalary, salaryCalculated } = this.state;
    const {
      baseINSS,
      discountINSS,
      baseIRPF,
      discountIRPF,
      netSalary,
    } = salaryCalculated;

    return (
      <div className="container">
        <h1 style={styles.centeredTitle}>React Salário</h1>
        <InputFullSalary
          fullSalaryValue={fullSalary}
          onChangeSalary={this.handleChangeSalary}
        />
        <InputReadOnly
          baseINSS={baseINSS}
          discountINSS={discountINSS}
          baseIRPF={baseIRPF}
          discountIRPF={discountIRPF}
          netSalary={netSalary}
        />
        <ProgressBarSalary
          baseINSS={baseINSS}
          discountINSS={discountINSS}
          discountIRPF={discountIRPF}
          netSalary={netSalary}
        />
      </div>
    );
  }
}
const styles = {
  centeredTitle: {
    textAlign: 'center',
  },
};
