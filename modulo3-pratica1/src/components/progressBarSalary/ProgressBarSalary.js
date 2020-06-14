import React, { Component } from 'react';
import { returnPercentage } from '../../helpers/formatNumber';
import css from './progressBarSalary.module.css';
export default class ProgressBarSalary extends Component {
  render() {
    const { baseINSS, discountINSS, discountIRPF, netSalary } = this.props;
    return (
      <div className={css.flexRow}>
        <div
          style={{
            background: ' #e67e22',
            width: `${returnPercentage(baseINSS, discountINSS)}%`,
          }}
        >
          INSS
        </div>

        <div
          style={{
            background: ' #c0392b',
            width: `${returnPercentage(baseINSS, discountIRPF)}%`,
          }}
        >
          IRPF
        </div>
        <div
          style={{
            background: ' #16a085',
            width: `${returnPercentage(baseINSS, netSalary)}%`,
          }}
        >
          Salario
        </div>
      </div>
    );
  }
}
