import { useEffect, useRef, useState } from 'react';

const status = { CHECKED: 'checked', UNCHECKED: 'unchecked', INDETERMINATE: 'indeterminate' }

const GenerateTree = ({ root, parentState, depth, syncParent }) => {
  const sessionData = JSON.parse(sessionStorage.getItem(root.id))
  // console.log(sessionData)
  // debugger  
  const nodeState = useRef(sessionData?.nodeState || status.UNCHECKED);
  const childCountRef = useRef(sessionData?.childCountRef || { selected: 0, indeterminate: 0 })
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(nodeState.current==status.CHECKED);
  const checkboxRef = useRef(null);

  useEffect(() => {
    if (parentState == status.CHECKED || parentState == status.UNCHECKED) {
      toggleCheckbox(parentState);
    }
  }, [parentState])

  useEffect(()=>{
    checkboxRef.current.indeterminate = nodeState.current == status.INDETERMINATE
    return (()=>{
      sessionStorage.setItem(root.id, JSON.stringify({nodeState: nodeState.current, childCountRef: childCountRef.current}))
    })
  },[])

  function checkIndeterminate() {
    const { selected, indeterminate } = childCountRef.current
    if (selected == root.children.length) {
      console.log(root.name)
      toggleCheckbox(status.CHECKED)
    }
    else if (indeterminate > 0 || selected > 0) {
      toggleCheckbox(status.INDETERMINATE)
    }
    else {
      toggleCheckbox(status.UNCHECKED)
    }
  }

  function syncChild(prevState, nextState) {
    if (prevState == status.INDETERMINATE) {
      if (nextState == status.CHECKED) {
        childCountRef.current.selected += 1;
        childCountRef.current.indeterminate -= 1
      }
      else if (nextState == status.UNCHECKED) {
        childCountRef.current.indeterminate -= 1
      }
    }
    else if (prevState == status.CHECKED) {
      if (nextState == status.INDETERMINATE) {
        childCountRef.current.selected -= 1;
        childCountRef.current.indeterminate += 1
      }
      else if (nextState == status.UNCHECKED) {
        childCountRef.current.selected -= 1
      }
    }
    else {
      if (nextState == status.INDETERMINATE) {
        console.log('root.name')
        childCountRef.current.indeterminate += 1
      }
      else if (nextState == status.CHECKED) {
        childCountRef.current.selected += 1
      }
    }
    checkIndeterminate();
  }

  function toggleCheckbox(newState) {
    // debugger
    if (newState !== nodeState.current) {
      syncParent(nodeState.current, newState)
      nodeState.current = newState;
      setChecked(newState == status.CHECKED)
      checkboxRef.current.indeterminate = newState == status.INDETERMINATE
      setShow(nodeState.current == status.CHECKED ? true : show)
    }
  }

  function handleCheckbox(e) {
    toggleCheckbox(e.target.checked ? status.CHECKED : status.UNCHECKED)
  }

  return (
    <div>
      {<button onClick={() => setShow(!show)}>{show ? "-" : "+"}</button>}

      <div className='node' style={{ marginLeft: 10 * depth }}>
        <input
          type="checkbox"
          name={root.name}
          id={root.name}
          checked={checked}
          onChange={handleCheckbox}
          ref={checkboxRef} />
        <label htmlFor={root.name}>{root.name}</label>
      </div>
      {(root.children && show) && root.children.map((child) => (
        <GenerateTree
          key={child.id}
          root={child}
          parentState={nodeState.current}
          syncParent={syncChild}
          depth={depth + 1} />
      ))}
    </div>
  )
}

export default GenerateTree;