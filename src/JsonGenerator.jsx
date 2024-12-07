import React, { useState } from 'react'

var counter = 1

const NAMES = [
    "John", "Jane", "Michael", "Emily", "David", "Emma", "Daniel", "Olivia", "Matthew", "Sophia",
    "James", "Isabella", "William", "Mia", "Alexander", "Charlotte", "Benjamin", "Amelia", "Elijah", "Ava",
    "Lucas", "Harper", "Henry", "Evelyn", "Oliver", "Liam", "Noah", "Ethan", "Jack", "Grace",
    "Samuel", "Chloe", "Jackson", "Zoey", "Logan", "Layla", "Mason", "Scarlett", "Sebastian", "Hannah",
    "Carter", "Lily", "Aiden", "Ellie", "Caleb", "Aria", "Nathan", "Abigail", "Andrew", "Madison"
];

function generateRandom(maxLimit, minLimit = 1) {
    return Math.floor(Math.random() * (maxLimit - minLimit+1)) + minLimit
}

function generateNode(n){
    return Array(n).fill().map(() => {
        return {
            id: counter++,
            name: NAMES[generateRandom(50)-1],
            children: []
        }
    })
}

function generateJSON(depth, [maxChild, minChild]) {
    var tree = generateNode(maxChild);
    var nodeWithEmptyChild = [...tree];
    while (depth > 1) {
        let newNodeWithEmptyChild = []
        nodeWithEmptyChild = nodeWithEmptyChild.map((node) => {
            let newNodes = generateNode(generateRandom(maxChild,minChild))
            node.children = newNodes;
            newNodeWithEmptyChild.push(...newNodes)
        })
        nodeWithEmptyChild = newNodeWithEmptyChild
        depth -= 1
    }
    return tree
}

const JsonGenerator = ({ setTree, setShowTree }) => {
    const [error, setError] = useState(false)

    function isValid(depth, maxChild, minChild){
        if(depth<1 || maxChild <1  || minChild<0){
            setError("Enter value greater than 0")
        }
        else if(depth==0){
            setError("Depth cannot be 0")
            return false
        }
        else if(minChild>maxChild){
            setError("Maximum child cannot be less than minimum child")
            return false
        }
        else{
            setError(false);
            return true;
        }
    }

    function handleFormData(e) {
        e.preventDefault();

        const depth = parseInt(document.getElementById('depth').value)
        const maxChild = parseInt(document.getElementById('maxChild').value)
        const minChild = parseInt(document.getElementById('minChild').value) || 1

        if(isValid(depth, maxChild, minChild)){
            const newTree = generateJSON(depth, [maxChild,minChild]);
            setTree(newTree)
        }  
    }

    return (
        <form onSubmit={handleFormData}>
            {error && <div className="error">
                {error}
            </div>}
            <div>
                <label className='form-label' htmlFor="depth">Depth: </label>
                <input className='form-input' type="number" name="depth" id="depth" required />
            </div>
            <div>
                <label className='form-label' htmlFor="maxChild">Maximum Child: </label>
                <input className='form-input' type="number" name='maxChild' id='maxChild' />
            </div>
            <div>
                <label className='form-label' htmlFor="minChild">Minimum Child: </label>
                <input className='form-input' type="number" name="minChild" id="minChild" />
            </div>
            <button className='form-button' type="submit">Generate</button>
        </form>
    )
}

export default JsonGenerator