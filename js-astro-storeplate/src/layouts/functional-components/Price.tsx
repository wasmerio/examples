import React from "react";

interface PriceProps {
  amount: string;
  className?: string;
  currencyCode?: string;
  currencyCodeClassName?: string;
}

const Price: React.FC<PriceProps> = ({
  amount,
  className = "",
  currencyCode = "USD",
  currencyCodeClassName = "",
}) => {
  const formattedAmount = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(parseFloat(amount));

  const combinedClassName = `${className} ${
    currencyCodeClassName ? "ml-1 inline" : ""
  }`.trim();

  return (
    <p className={className}>
      {formattedAmount}
      <span className={combinedClassName}>{currencyCode}</span>
    </p>
  );
};

export default Price;
