import data from './data.json';
import GenerateTree from './GenerateTree';
import './App.css'
import JsonGenerator from './JsonGenerator';
import { useEffect, useState } from 'react';

function App() {
  const [tree, setTree] = useState(data);
  
  useEffect(()=>{
    return ()=>{
      sessionStorage.clear()
    }
  })

  return (
    <>
      <JsonGenerator setTree={setTree} />
      {tree.map((root) => <GenerateTree
        key={root.id}
        root={root}
        parentSelected={false}
        depth={0}
        syncParent={() => { }} />)}
    </>
  );
}

export default App;
