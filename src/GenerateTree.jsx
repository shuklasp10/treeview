import { useEffect, useRef, useState } from 'react';

const state = { CHECKED: 'checked', UNCHECKED: 'unchecked', INDETERMINATE: 'indeterminate' }

const GenerateTree = ({ root, parentState, depth, syncParent }) => {
  // refs
  const nodeState = useRef(state.UNCHECKED);
  const childCountRef = useRef({ selected: 0, indeterminate: 0 })
  const checkboxRef = useRef(null);
  // states for UI inputs
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);

  // store and retrieve node state from session data when node is mounted and unmounted 
  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem(root.id))
    if(sessionData){
      nodeState.current = sessionData.nodeState
      childCountRef.current = sessionData.childCountRef
      setChecked(nodeState.current == state.CHECKED)
      setShow(sessionData.show)
    }
    checkboxRef.current.indeterminate = nodeState.current == state.INDETERMINATE
    return (() => {
      sessionStorage.setItem(root.id, JSON.stringify({
        nodeState: nodeState.current,
        childCountRef: childCountRef.current,
        show: show
      }))
    })
  }, [])

   // sync child node checked state with parent node
   useEffect(() => {
    if (parentState == state.CHECKED || parentState == state.UNCHECKED) {
      changeNodeState(parentState);
    }
  }, [parentState])

  // check for indeterminate after child node is changed
  function checkIndeterminate() {
    const { selected, indeterminate } = childCountRef.current
    if (selected == root.children.length) {
      changeNodeState(state.CHECKED)
    }
    else if (indeterminate > 0 || selected > 0) {
      changeNodeState(state.INDETERMINATE)
    }
    else {
      changeNodeState(state.UNCHECKED)
    }
  }

  // track child node states in parent node
  function syncChild(prevState, nextState) {
    if (prevState == state.INDETERMINATE) {
      if (nextState == state.CHECKED) {
        childCountRef.current.selected += 1;
        childCountRef.current.indeterminate -= 1
      }
      else if (nextState == state.UNCHECKED) {
        childCountRef.current.indeterminate -= 1
      }
    }
    else if (prevState == state.CHECKED) {
      if (nextState == state.INDETERMINATE) {
        childCountRef.current.selected -= 1;
        childCountRef.current.indeterminate += 1
      }
      else if (nextState == state.UNCHECKED) {
        childCountRef.current.selected -= 1
      }
    }
    else {
      if (nextState == state.INDETERMINATE) {
        childCountRef.current.indeterminate += 1
      }
      else if (nextState == state.CHECKED) {
        childCountRef.current.selected += 1
      }
    }
    checkIndeterminate();
  }

  //handle node state changes and trigger parent sync
  function changeNodeState(newState) {
    if (newState !== nodeState.current) {
      syncParent(nodeState.current, newState)
      nodeState.current = newState;
      setChecked(newState == state.CHECKED)
      checkboxRef.current.indeterminate = newState == state.INDETERMINATE
      setShow(nodeState.current == state.CHECKED ? true : show)
    }
  }

  // handle checkbox UI change
  function handleCheckbox(e) {
    changeNodeState(e.target.checked ? state.CHECKED : state.UNCHECKED)
  }

  return (
    <div>
      {<button className='expand-button' onClick={() => setShow(!show)}>{show ? "-" : "+"}</button>}

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