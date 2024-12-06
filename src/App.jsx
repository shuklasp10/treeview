import data from './data.json';
import GenerateTree from './GenerateTree';
import './App.css'
import JsonGenerator from './JsonGenerator';
import { useState } from 'react';

function App() {
  const [tree, setTree] = useState(data);
  // const [showTree, setShowTree] = useState(false);
  console.log(tree);
  return (
    <>
      <JsonGenerator setTree={setTree} />
      {tree.map((root) => <GenerateTree
        key={root.id}
        root={root}
        parentSelected={false}
        depth={0}
        syncParent={() => { }} />)}
      {/* <Test /> */}
    </>
  );
}

export default App;
