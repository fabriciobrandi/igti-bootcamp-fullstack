import React, { Component } from 'react';
import { formatNumber, returnPercentage } from '../../helpers/formatNumber';
import css from './inputReadOnly.module.css';
export default class InputReadOnly extends Component {
  render() {
    const {
      baseINSS,
      discountINSS,
      baseIRPF,
      discountIRPF,
      netSalary,
    } = this.props;

    return (
      <div>
        <div className={css.flexRow}>
          <div>
            <span>Base INSS:</span>
            <input readOnly value={formatNumber(baseINSS)} />
          </div>
          <div>
            <span>Desconto INSS:</span>
            <input
              type="text"
              className={css.inssDiscount}
              readOnly
              value={` R$${formatNumber(discountINSS)} (${returnPercentage(
                baseINSS,
                discountINSS
              )}%)`}
            />
          </div>
          <div className={css.flexItem}>
            <span>Base IRPF:</span>
            <input type="text" readOnly value={formatNumber(baseIRPF)} />
          </div>
          <div className={css.flexItem}>
            <span>Desconto IRPF:</span>
            <input
              type="text"
              readOnly
              className={css.irpfDiscount}
              value={`R$ ${formatNumber(discountIRPF)}( ${returnPercentage(
                baseINSS,
                discountIRPF
              )}%)`}
            />
          </div>
        </div>
        <div>
          <span>Salario Liquido:</span>
          <input
            type="text"
            readOnly
            className={css.netSalary}
            value={`${formatNumber(netSalary)} ${returnPercentage(
              baseINSS,
              netSalary
            )} %`}
          />
        </div>
      </div>
    );
  }
}
