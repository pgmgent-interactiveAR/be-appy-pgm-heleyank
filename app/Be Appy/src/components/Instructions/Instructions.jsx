import React from "react";
import styles from "./Instructions.module.scss";

const Instructions = () => {
  return (
    <div className={styles.Instructions}>
      <h1 className={styles.Instructions__title}>Instructions</h1>
      <div className={styles.Instructions__text}>
        <p>1. First scan environment untill you see the bleu circle.</p>
        <p>2. Place your virtual pet by tapping on the circle.</p>
        <p className={styles.Instructions__subtitle}>
          Your pet listens to following commands:
        </p>
        <ul className={styles.Instructions__list}>
          <li>sit (down)</li>
          <li>blink</li>
          <li>wait</li>
          <li>bow</li>
        </ul>
      </div>
    </div>
  );
};

export default Instructions;
