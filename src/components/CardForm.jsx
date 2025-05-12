import { useMemo, useState } from "react";
import "../App.scss";

import Card from "./Card";

const CardForm = () => {
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    cardMonth: "",
    cardYear: "",
    cardCvv: "",
  });

  const [isCardFlipped, setIsCardFlipped] = useState(false); // Track flip state

  const currentYear = new Date().getFullYear();

  const fields = {
    cardNumber: "v-card-number",
    cardName: "v-card-name",
    cardMonth: "v-card-month",
    cardYear: "v-card-year",
    cardCvv: "v-card-cvv",
  };

  const minCardMonth = useMemo(
    () =>
      formData.cardYear === currentYear.toString()
        ? new Date().getMonth() + 1
        : 1,
    [formData.cardYear, currentYear]
  );

  // Handle card number input and formatting
  const handleCardNumberInput = (e) => {
    let rawValue = e.target.value.replace(/\D/g, "");
    let formatted = rawValue;

    // American Express logic
    if (/^3[47]\d{0,13}$/.test(rawValue)) {
      formatted = rawValue.replace(
        /(\d{4})(\d{6})?(\d{0,5})?/,
        (_, p1, p2 = "", p3 = "") => [p1, p2, p3].filter(Boolean).join(" ")
      );
    } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(rawValue)) {
      // Diner's Club logic
      formatted = rawValue.replace(
        /(\d{4})(\d{6})?(\d{0,4})?/,
        (_, p1, p2 = "", p3 = "") => [p1, p2, p3].filter(Boolean).join(" ")
      );
    } else {
      // Default Visa, MasterCard, etc.
      formatted = rawValue.replace(
        /(\d{4})(\d{4})?(\d{4})?(\d{0,4})?/,
        (_, p1, p2 = "", p3 = "", p4 = "") =>
          [p1, p2, p3, p4].filter(Boolean).join(" ")
      );
    }

    // Handle backspace and remove the space if needed
    if (
      e.nativeEvent.inputType === "deleteContentBackward" &&
      formatted.endsWith(" ")
    ) {
      formatted = formatted.slice(0, -1);
    }

    setFormData({ ...formData, cardNumber: formatted });
  };

  // Validate card number (Luhn algorithm)
  const validateCard = () => {
    const digits = formData.cardNumber.replace(/\D/g, "");
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let val = parseInt(digits[i], 10);
      if (i % 2 === 0) {
        val *= 2;
        if (val > 9) val -= 9;
      }
      sum += val;
    }
    if (sum % 10 !== 0) alert("Invalid card number");
  };

  // Generate options for years (next 12 years)
  const generateYearOptions = () =>
    Array.from({ length: 12 }, (_, i) => currentYear + i);

  // Generate options for months based on the minimum month for the selected year
  const generateMonthOptions = () =>
    Array.from({ length: 12 }, (_, i) => i + 1).map((n) => ({
      value: n < 10 ? `0${n}` : `${n}`,
      disabled: n < minCardMonth,
    }));

  // Handle changes to other input fields
  const handleInputChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  // Handle CVV input focus
  const handleCvvFocus = () => {
    setIsCardFlipped(true); // Flip the card when CVV field is focused
  };

  // Handle CVV input blur (optional to revert card flip after CVV blur)
  const handleCvvBlur = () => {
    setIsCardFlipped(false); // Flip the card back when CVV field is blurred (optional)
  };

  return (
    <div className="card-form">
      <div className="card-list">
        <Card
          fields={fields}
          labels={formData}
          isFlipped={isCardFlipped} // Pass the flip state to the Card component
          setIsCardFlipped={setIsCardFlipped}
        />
      </div>

      <div className="card-form__inner">
        {/* Card Number */}
        <div className="card-input">
          <label htmlFor={fields.cardNumber} className="card-input__label">
            Card Number
          </label>
          <input
            type="tel"
            id={fields.cardNumber}
            value={formData.cardNumber}
            maxLength={19}
            onInput={handleCardNumberInput}
            autoComplete="off"
            className="card-input__input"
          />
        </div>

        {/* Cardholder Name */}
        <div className="card-input">
          <label htmlFor={fields.cardName} className="card-input__label">
            Card Name
          </label>
          <input
            type="text"
            id={fields.cardName}
            value={formData.cardName}
            onInput={handleInputChange("cardName")}
            autoComplete="off"
            className="card-input__input"
          />
        </div>

        {/* Expiry Date */}
        <div className="card-form__row">
          <div className="card-form__col">
            <div className="card-form__group">
              <label className="card-input__label">Expiration Date</label>
              <select
                id={fields.cardMonth}
                className="card-input__input -select"
                value={formData.cardMonth}
                onChange={handleInputChange("cardMonth")}
              >
                <option value="" disabled>
                  Month
                </option>
                {generateMonthOptions().map(({ value, disabled }) => (
                  <option key={value} value={value} disabled={disabled}>
                    {value}
                  </option>
                ))}
              </select>

              <select
                id={fields.cardYear}
                className="card-input__input -select"
                value={formData.cardYear}
                onChange={handleInputChange("cardYear")}
              >
                <option value="" disabled>
                  Year
                </option>
                {generateYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CVV */}
          <div className="card-form__col -cvv">
            <div className="card-input">
              <label htmlFor={fields.cardCvv} className="card-input__label">
                CVV
              </label>
              <input
                type="tel"
                id={fields.cardCvv}
                value={formData.cardCvv}
                maxLength={4}
                onInput={handleInputChange("cardCvv")}
                onFocus={handleCvvFocus} // Flip when focused
                onBlur={handleCvvBlur} // Optionally revert flip when blurred
                autoComplete="off"
                className="card-input__input"
              />
            </div>
          </div>
        </div>

        <button className="card-form__button" onClick={validateCard}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default CardForm;
