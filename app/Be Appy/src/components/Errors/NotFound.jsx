import React from "react";
import Homebtn from "../HomeBtn/Homebtn";
import styles from "./NotFound.module.scss";

const NotFound = () => {
  return (
    <div className={styles.not_found}>
      <Homebtn />
      <iframe src="https://embed.lottiefiles.com/animation/70793"></iframe>
      <h1>404</h1>
      <p className={styles.not_found__text}>Why are you here?</p>
      <p className={styles.not_found__text}>I don't exist!</p>
    </div>
  );
};

export default NotFound;
