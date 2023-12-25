import { createEffect, createSignal, onMount } from 'solid-js';
import Navbar from './nav/Navbar';
import Canvas from './canvas/Canvas';
import Tools from './canvas/Tools';
import Notifs from './Notifs';

function App() {
  return (
    <div id="app-root">
      <Navbar/>
      {/* {circuit() &&
        <>
          <Canvas/>
          <Tools/>
        </>
      }
      <Notifs/> */}
    </div>
  );
};

export default App;