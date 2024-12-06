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
    return Math.floor(Math.random() * (maxLimit - minLimit + 1)) + minLimit
}

function generateJson(maxDepth, noOfChildNodes,) {
    if (maxDepth == 0) {
        return []
    }
    return Array(generateRandom(noOfChildNodes[1], noOfChildNodes[0])).fill().map(() => {
        return {
            id: counter++,
            name: NAMES[generateRandom(50)-1],
            children: generateJson(maxDepth - 1, noOfChildNodes)
        }
    })
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
        console.log('running')
        e.preventDefault();
        // console.log(parseInt(document.getElementById('depth').value))
        const depth = parseInt(document.getElementById('depth').value)
        const maxChild = parseInt(document.getElementById('maxChild').value)
        const minChild = parseInt(document.getElementById('minChild').value) || 1
        if(isValid(depth, maxChild, minChild)){
            const newTree = generateJson(depth, [maxChild+1,minChild]);
            setTree(newTree)
        }
        
    }

    return (
        <form onSubmit={handleFormData}>
            {error && <div className="error">
                {error}
            </div>}
            <div>
                <label htmlFor="depth">Depth: </label>
                <input type="number" name="depth" id="depth" required />
            </div>
            <div>
                <label htmlFor="maxChild">Maximum Child: </label>
                <input type="number" name='maxChild' id='maxChild' />
            </div>
            <div>
                <label htmlFor="minChild">Minimum Child: </label>
                <input type="number" name="minChild" id="minChild" />
            </div>
            <button className='form-button' type="submit">Generate</button>
        </form>
    )
}

export default JsonGenerator