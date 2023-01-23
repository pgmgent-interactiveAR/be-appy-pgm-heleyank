import React from "react";
import Homebtn from "../HomeBtn/Homebtn";
import styles from "./Error.module.scss";

const Error = () => {
  return (
    <div>
      <div className={styles.error}>
        <Homebtn corner="true" />
        <h1 className={styles.error__title}>What did you do?</h1>
        <iframe
          className={styles.error__iframe}
          src="https://embed.lottiefiles.com/animation/120637"
        ></iframe>
        <p className={styles.error__description}>
          No idea what is going on, but it is probably you. Try q different
          browser.
        </p>
      </div>
    </div>
  );
};

export default Error;
