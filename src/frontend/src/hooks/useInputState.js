import {useState} from 'react';

function useInputState(initVal = ""){
    const [value,changeValue] = useState(initVal);
    let handelChange = (e)=>{
        changeValue(e.target.value);
    }
    let reset = ()=>{
        changeValue("");
    }
    return [value,handelChange,reset];
}

export default useInputState;