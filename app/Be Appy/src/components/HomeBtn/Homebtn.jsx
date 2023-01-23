import React from "react";
import styles from "./Homebtn.module.scss";

const Homebtn = ({ corner }) => {
  return (
    <a
      className={`${styles.home_btn} ${corner ?? styles.home_btn__corner}`}
      href="/"
    >
      <svg
        id="Component_1_1"
        data-name="Component 1 – 1"
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 103 106"
      >
        <ellipse
          id="Ellipse_2"
          data-name="Ellipse 2"
          cx="51.5"
          cy="53"
          rx="51.5"
          ry="53"
          fill="#f9cfd0"
        />
        <path
          id="Icon_awesome-home"
          data-name="Icon awesome-home"
          d="M28.63,14.12,9.8,29.626V46.361a1.634,1.634,0,0,0,1.634,1.634l11.443-.03a1.634,1.634,0,0,0,1.626-1.634V36.558a1.634,1.634,0,0,1,1.634-1.634h6.535a1.634,1.634,0,0,1,1.634,1.634v9.766a1.634,1.634,0,0,0,1.634,1.639l11.439.032a1.634,1.634,0,0,0,1.634-1.634V29.615L30.192,14.12A1.245,1.245,0,0,0,28.63,14.12ZM58.368,24.659l-8.537-7.037V3.479a1.225,1.225,0,0,0-1.225-1.225H42.888a1.225,1.225,0,0,0-1.225,1.225v7.414L32.52,3.372a4.9,4.9,0,0,0-6.229,0L.444,24.659A1.225,1.225,0,0,0,.28,26.385l2.6,3.165a1.225,1.225,0,0,0,1.727.166L28.63,9.933a1.245,1.245,0,0,1,1.562,0l24.02,19.783a1.225,1.225,0,0,0,1.726-.163l2.6-3.165a1.225,1.225,0,0,0-.174-1.729Z"
          transform="translate(23.09 27.876)"
          fill="#fef0d6"
        />
      </svg>
    </a>
  );
};

export default Homebtn;
