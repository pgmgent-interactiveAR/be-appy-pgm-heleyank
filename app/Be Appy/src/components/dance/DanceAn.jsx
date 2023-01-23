import React from "react";
import styles from "./DanceAn.module.scss";
const DanceAn = () => {
  return (
    <div className={styles.dance_container}>
      <iframe
        className={styles.dance}
        src="https://lottie.host/?file=c8f6eba4-ef2c-4eb4-8755-64bf95e3a21a/TSCSLYxp39.json"
      ></iframe>
    </div>
  );
};

export default DanceAn;
