import Navbar from './nav/Navbar';
import Canvas from './canvas/Canvas';
import Tools from './canvas/Tools';
import Notifs from './Notifs';
import { LiveActions, LiveCircuit } from '../script/stores/live_circuit';
import { GateFunctions } from '../script/stores/functions';
import Functions from './Functions';
import GateEditor from './canvas/GateEditor';

function App() {
  return (
    <div id="app-root">
      <Navbar/>
      {LiveCircuit.loaded.get() &&
        <>
          <Canvas/>
          <Tools/>
          {LiveActions.editor.get() &&
            <GateEditor/>
          }
        </>
      }
      {GateFunctions.visible.get() &&
        <Functions/>
      }
      <Notifs/> 
    </div>
  );
};

export default App;