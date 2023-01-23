import React from "react";
import DancingLector from "../DancingLector/DancingLector";
import VirtualPet from "../VirtualPet/VirtualPet";
import styles from "./Intro.module.scss";
import { useContext } from "react";
import { ErrorContext } from "../../App";
const Intro = () => {
  //const [error, setError] = useContext(ErrorContext);
  return (
    <div className={styles.intro}>
      <h1 className={styles.intro__title}>Be Appy</h1>
      <p>Rock bottom is the solid foundation on which this app is built.</p>
      <div className={styles.intro__subtitle}>
        <h2>Cheer up</h2>
        <p className={styles.intro__subtitle_comment}>
          or not... it's up to you
        </p>
      </div>
      <div>
        <VirtualPet />
        <DancingLector />
      </div>
    </div>
  );
};

export default Intro;
