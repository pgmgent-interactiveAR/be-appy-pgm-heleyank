import React from "react";
import styles from "./Fox.module.scss";
const Fox = () => {
  return (
    <div className={styles.fox_container}>
      <iframe
        className={styles.fox}
        src="https://embed.lottiefiles.com/animation/33017"
      ></iframe>
    </div>
  );
};

export default Fox;
