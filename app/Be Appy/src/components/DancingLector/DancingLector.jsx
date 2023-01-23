import React from "react";
import DanceAn from "../dance/DanceAn";
import styles from "./DancingLector.module.scss";
const DancingLector = () => {
  return (
    <a className={styles.button} href="/dancing-lector">
      <span>Dancing Lector</span>
      <DanceAn />
    </a>
  );
};

export default DancingLector;
