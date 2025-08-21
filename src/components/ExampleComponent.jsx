import React from 'react';
import styles from './ExampleComponent.module.css';

const ExampleComponent = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CSS Modules 예시</h1>
      <button className={styles.button}>클릭하세요</button>
    </div>
  );
};

export default ExampleComponent;
