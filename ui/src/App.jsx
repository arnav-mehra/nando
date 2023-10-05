import { createEffect, createSignal } from 'solid-js';
import styles from './App.module.css';
import Navbar from './nav/Navbar';
import Canvas from './canvas/Canvas';
import Tools from './canvas/Tools';

function App() {
  const [ circuit, setCircuit ] = createSignal(null);

  return (
    <div class={styles.App}>
      <Navbar
        setCircuit={setCircuit}
      />
      {circuit() &&
        <>
          <Canvas
            circuit={circuit}
            setCircuit={setCircuit}
          />
          <Tools
            circuit={circuit}
            setCircuit={setCircuit}
          />
        </>
      }
    </div>
  );
}

export default App;
