import data from './data.json';
import GenerateTree from './GenerateTree';

function App() {
  // console.log(data);
  return (
    <>
      <GenerateTree root = {data} parentSelected={false} />
    </>
  );
}

export default App;
