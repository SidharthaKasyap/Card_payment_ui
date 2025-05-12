import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

const Card = ({ labels, fields, isFlipped, focused }) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");

  const cardType = (() => {
    const number = labels.cardNumber || "";
    return (
      Object.keys(CARD_TYPES).find((type) => CARD_TYPES[type].test(number)) ||
      "visa"
    );
  })();

  const cardTypeImageUrl = `/assets/${cardType}.png`;

  useEffect(() => {
    setCurrentPlaceholder(PLACEHOLDERS[cardType] || PLACEHOLDERS.default);
  }, [cardType]);

  return (
    <motion.div
      className={`card-item ${isFlipped ? "-active" : ""}`}
      style={{
        backgroundImage: `url(${cardBackgroundImage})`,
        backgroundSize: "cover",
        borderRadius: "15px",
        backgroundPosition: "center",
      }}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
        duration: 1.2,
      }}
    >
      {/* Card Front */}
      <motion.div
        className="card-item__side -front"
        animate={{ opacity: isFlipped ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        style={{ borderRadius: "15px" }}
      >
        <div className="card-item__cover">
          <img
            src={cardBackgroundImage}
            className="card-item__bg"
            alt="Card Background"
          />
        </div>

        <div className="card-item__wrapper">
          <div className="card-item__top">
            <img src={chip} className="card-item__chip" alt="Chip" />
            <div className="card-item__type1">
              <img
                src={cardTypeImageUrl}
                alt="Card Type"
                className="card-item__typeImg1"
              />
            </div>
          </div>

          <motion.label
            htmlFor={fields.cardNumber}
            className={`card-item__number ${
              focused === "cardNumber" ? "focused" : ""
            }`}
            animate={
              focused === "cardNumber"
                ? { border: "2px solid white", borderRadius: "5px" }
                : { border: "2px solid transparent" }
            }
            transition={{ duration: 0.5 }}
          >
            {[...currentPlaceholder].map((n, i) => (
              <div className="card-item__numberItem" key={i}>
                {labels.cardNumber.length > i ? labels.cardNumber[i] : n}
              </div>
            ))}
          </motion.label>

          <div className="card-item__content">
            <motion.label
              htmlFor={fields.cardName}
              className={`card-item__info ${
                focused === "cardName" ? "focused" : ""
              }`}
              animate={
                focused === "cardName"
                  ? { border: "2px solid white", borderRadius: "5px" }
                  : { border: "2px solid transparent" }
              }
              transition={{ duration: 0.5 }}
            >
              <div className="card-item__holder">Card Holder</div>
              <div className="card-item__name">
                {labels.cardName
                  ? labels.cardName.split(" ").map((part, idx) => (
                      <span className="card-item__nameItem" key={idx}>
                        {part}
                      </span>
                    ))
                  : "FULL NAME"}
              </div>
            </motion.label>

            <motion.div
              className={`card-item__date ${
                focused === "cardMonth" || focused === "cardYear"
                  ? "focused"
                  : ""
              }`}
              animate={
                focused === "cardMonth" || focused === "cardYear"
                  ? { border: "2px solid white", borderRadius: "5px" }
                  : { border: "2px solid transparent" }
              }
              transition={{ duration: 0.5 }}
            >
              <label className="card-item__dateTitle">Expires</label>
              <label className="card-item__dateItem">
                {labels.cardMonth || "MM"}
              </label>
              /
              <label className="card-item__dateItem">
                {labels.cardYear ? String(labels.cardYear).slice(2) : "YY"}
              </label>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Card Back */}
      <motion.div
        className="card-item__side -back"
        animate={{ opacity: isFlipped ? 1 : 0 }}
        transition={{ duration: 1 }}
        style={{ borderRadius: "15px" }}
      >
        <div className="card-item__cover">
          <img
            src={cardBackgroundImage}
            className="card-item__bg"
            alt="Card Background"
          />
        </div>
        <div className="card-item__band"></div>
        <motion.div className="card-item__cvv">
          <div className="card-item__cvvTitle">CVV</div>
          <div className="card-item__cvvBand">
            {labels.cardCvv?.split("").map((_, i) => (
              <span key={i}>*</span>
            ))}
          </div>
          <div className="card-item__type">
            <img
              src={cardTypeImageUrl}
              className="card-item__typeImg"
              alt="Card Type"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Card;
