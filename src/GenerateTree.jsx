import {useEffect, useState} from 'react';

const GenerateTree = ({ root, parentSelected }) => {
  const [isSelected, setIsSelected] = useState(false);
  useEffect(()=>{
    setIsSelected(parentSelected);
  },[parentSelected])
  return (
    <div>
      <input type="checkbox" onChange={()=>setIsSelected(!isSelected)} 
      checked={isSelected} name={root.name} id={root.name}/>
      <label htmlFor={root.name}>{root.name}</label>
      {root.children && root.children.map((child)=>(
        <GenerateTree root = {child} parentSelected = {isSelected}/>
      ))}
    </div>
  )
}

export default GenerateTree;