import { createEffect, createSignal, onMount } from 'solid-js';
import Navbar from './nav/Navbar';
import Canvas from './canvas/Canvas';
import Tools from './canvas/Tools';
import Notifs from './Notifs';
import { LiveCircuit } from '../script/stores/live_circuit';

function App() {
  return (
    <div id="app-root">
      <Navbar/>
      {LiveCircuit.gateIds.get() &&
        <>
          <Canvas/>
          <Tools/>
        </>
      }
      <Notifs/> 
    </div>
  );
};

export default App;