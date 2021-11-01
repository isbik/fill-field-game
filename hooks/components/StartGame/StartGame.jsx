import clsx from "clsx";
import React, { useState } from "react";
import styles from "./StartGame.module.scss";

const StartGame = (props) => {
  const [players, setPlayers] = useState(2);
  const [size, setSize] = useState(10);
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1>Захватчики</h1>

        <p>Количество игроков</p>

        <div style={{ display: "flex" }}>
          <div
            onClick={() => setPlayers(2)}
            className={clsx(styles.item, { [styles.active]: players === 2 })}
          >
            2
          </div>
          <div
            onClick={() => setPlayers(4)}
            className={clsx(styles.item, { [styles.active]: players === 4 })}
          >
            4
          </div>
        </div>
        <p>Размер поля</p>
        <div style={{ display: "flex" }}>
          <div
            onClick={() => setSize(10)}
            className={clsx(styles.item, { [styles.active]: size === 10 })}
          >
            10
          </div>
          <div
            onClick={() => setSize(15)}
            className={clsx(styles.item, { [styles.active]: size === 15 })}
          >
            15
          </div>
          <div
            onClick={() => setSize(25)}
            className={clsx(styles.item, { [styles.active]: size === 25 })}
          >
            25
          </div>
          <div
            onClick={() => setSize(30)}
            className={clsx(styles.item, { [styles.active]: size === 30 })}
          >
            30
          </div>
        </div>

        <button onClick={() => props.onStart({ size, players })}>
          Начать игру
        </button>
      </div>
    </div>
  );
};

export default StartGame;
