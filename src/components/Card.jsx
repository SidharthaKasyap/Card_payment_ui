import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import "../App.scss";
import cardBackgroundImage from "/assets/6.jpeg";
import chip from "/assets/chip.png";

const PLACEHOLDERS = {
  amex: "#### ###### #####",
  dinersclub: "#### ###### ####",
  default: "#### #### #### ####",
};

const CARD_TYPES = {
  visa: /^4/,
  amex: /^(34|37)/,
  mastercard: /^5[1-5]/,
  discover: /^6011/,
  unionpay: /^62/,
  troy: /^9792/,
  dinersclub: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
  jcb: /^35(2[89]|[3-8])/,
};

const Card = ({ labels, fields, isFlipped, setIsCardFlipped }) => {
  const [focusStyle, setFocusStyle] = useState(null);
  const [currentFocus, setCurrentFocus] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");

  const refs = {
    focusElement: useRef(null),
    cardDate: useRef(null),
    cardNumber: useRef(null),
    cardName: useRef(null),
  };

  const cardType = (() => {
    const number = labels.cardNumber || "";
    return (
      Object.keys(CARD_TYPES).find((type) => CARD_TYPES[type].test(number)) ||
      "visa"
    );
  })();

  const cardTypeImageUrl = cardType ? `/assets/${cardType}.png` : "";

  const updateFocus = () => {
    const target = refs[currentFocus]?.current;
    if (target) {
      setFocusStyle({
        width: `${target.offsetWidth}px`,
        height: `${target.offsetHeight}px`,
        transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`,
      });
    } else {
      setFocusStyle(null);
    }
  };

  const updatePlaceholder = () => {
    setCurrentPlaceholder(PLACEHOLDERS[cardType] || PLACEHOLDERS.default);
  };

  // Focus handler
  const handleFocus = (field) => {
    setIsFocused(true);
    const id = field.id;
    setCurrentFocus(
      id === fields.cardMonth || id === fields.cardYear ? "cardDate" : id
    );
    setIsCardFlipped(id === fields.cardCvv); // Flip the card when CVV is focused
  };

  // Blur handler
  const handleBlur = () => {
    setTimeout(() => {
      if (!isFocused) setCurrentFocus(null);
    }, 300);
    setIsFocused(false);
    if (refs.cardDate.current === document.activeElement) {
      setIsCardFlipped(false); // Flip the card back when other fields are focused
    }
  };

  useEffect(() => {
    updatePlaceholder();
  }, [cardType]);

  useEffect(() => {
    updateFocus();
  }, [currentFocus]);

  // Setup event listeners
  useEffect(() => {
    const fields = document.querySelectorAll("[data-card-field]");
    fields.forEach((field) => {
      field.addEventListener("focus", () => handleFocus(field));
      field.addEventListener("blur", handleBlur);
    });

    // Cleanup event listeners on unmount
    return () => {
      fields.forEach((field) => {
        field.removeEventListener("focus", () => handleFocus(field));
        field.removeEventListener("blur", handleBlur);
      });
    };
  }, []);
  // console.log(focusStyle,"");
  return (
    <motion.div
      className={`card-item ${isFlipped ? "-active" : ""}`}
      style={{
        backgroundImage: `url(${cardBackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "15px", // Rounded corners
      }}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 50, duration: 2 }} // Slow down flip
    >
      {/* Card Front */}
      <motion.div
        className="card-item__side -front"
        initial={{ opacity: 1 }}
        animate={{ opacity: isFlipped ? 0 : 1 }}
        transition={{ duration: 2 }}
        style={{
          borderRadius: "15px", // Apply rounded corners
        }}
      >
        <div
          ref={refs.focusElement}
          className={`card-item__focus ${focusStyle ? "-active" : ""}`}
          style={focusStyle}
        />
        <div className="card-item__cover">
          <img
            src={cardBackgroundImage}
            className="card-item__bg"
            alt="Card Background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "15px", // Make sure image has rounded corners too
            }}
          />
        </div>

        <div className="card-item__wrapper">
          <div className="card-item__top">
            <img src={chip} className="card-item__chip" alt="Chip" />
            <div className="card-item__type1">
              {cardType && (
                <img
                  src={cardTypeImageUrl}
                  alt="Card Type"
                  className="card-item__typeImg1"
                />
              )}
            </div>
          </div>

          <label
            htmlFor={fields.cardNumber}
            className="card-item__number"
            ref={refs.cardNumber}
          >
            {[...currentPlaceholder].map((n, i) => (
              <div className="card-item__numberItem" key={i}>
                {labels.cardNumber.length > i ? labels.cardNumber[i] : n}
              </div>
            ))}
          </label>

          <div className="card-item__content">
            <label
              htmlFor={fields.cardName}
              className="card-item__info"
              ref={refs.cardName}
            >
              <div className="card-item__holder">Card Holder</div>
              <div className="card-item__name">
                {labels.cardName
                  ? labels.cardName
                      .replace(/\s\s+/g, " ")
                      .split(" ")
                      .map((char, idx) => (
                        <span className="card-item__nameItem" key={idx}>
                          {char}
                        </span>
                      ))
                  : "Full Name"}
              </div>
            </label>

            <div className="card-item__date" ref={refs.cardDate}>
              <label
                htmlFor={fields.cardMonth}
                className="card-item__dateTitle"
              >
                Expires
              </label>
              <label htmlFor={fields.cardMonth} className="card-item__dateItem">
                {labels.cardMonth || "MM"}
              </label>
              /
              <label htmlFor={fields.cardYear} className="card-item__dateItem">
                {labels.cardYear ? String(labels.cardYear).slice(2, 4) : "YY"}
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card Back */}
      <motion.div
        className="card-item__side -back"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFlipped ? 1 : 0 }}
        transition={{ duration: 2 }}
        style={{
          borderRadius: "15px", // Apply rounded corners
        }}
      >
        <div className="card-item__cover">
          <img
            src={cardBackgroundImage}
            className="card-item__bg"
            alt="Card Background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "15px", // Image should also have rounded corners
            }}
          />
        </div>
        <div className="card-item__band"></div>
        <div className="card-item__cvv">
          <div className="card-item__cvvTitle">CVV</div>
          <div className="card-item__cvvBand">
            {labels.cardCvv?.split("").map((_, i) => (
              <span key={i}>*</span>
            ))}
          </div>
          <div className="card-item__type">
            {cardType && (
              <img
                src={cardTypeImageUrl}
                className="card-item__typeImg"
                alt="Card Type"
              />
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Card;
