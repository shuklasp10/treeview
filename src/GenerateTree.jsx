import { useEffect, useState } from 'react';

const GenerateTree = ({ root, parentSelected, depth }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    setIsSelected(parentSelected);
  }, [parentSelected])

  return (
    <div>
      {<button onClick={() => setShow(!show)}>{show ? "-" : "+"}</button>}

      <div className='node' style={{ marginLeft: 10 * depth }}>
        <input type="checkbox" onChange={() => setIsSelected(!isSelected)}
          checked={isSelected} name={root.name} id={root.name} />
        <label htmlFor={root.name}>{root.name}</label>
      </div>
        {(root.children && show) && root.children.map((child) => (
          <GenerateTree root={child} parentSelected={isSelected} depth={depth + 1} />
        ))}
    </div>
  )
}

export default GenerateTree;