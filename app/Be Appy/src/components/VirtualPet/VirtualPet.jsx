import React from "react";
import Fox from "../fox/fox";
import styles from "./VirtualPet.module.scss";
const VirtualPet = () => {
  return (
    <a className={styles.button} href="/virtual-pet">
      <span>Virtual Pet</span>
      <Fox />
    </a>
  );
};

export default VirtualPet;
