import data from './data.json';
import GenerateTree from './GenerateTree';

function App() {
  // console.log(data);
  return (
    <>
      <GenerateTree root = {data} parentSelected={false} depth={0} />
    </>
  );
}

export default App;
