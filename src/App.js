import React, {useEffect} from 'react';
import './App.css';
import runTest from "./services/interceptors/batchInterceptor/pureTest";

function App() {
    useEffect(() => {
        runTest();
    }, []);
    return (
        <div>
            <div className='app'>
                <p className='messageBox'>
                    Open your console to see result.
                </p>
            </div>
        </div>
    );
}

export default App;
