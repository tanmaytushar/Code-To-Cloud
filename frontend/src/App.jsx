import { useEffect, useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { ThemeProvider } from './components/theme-provider'
import { Input } from './components/ui/input'
import axios from 'axios';
import { Progress } from "@/components/ui/progress"



function App() {
  const [url, setURL] = useState('');
  const [finalURL, setFinalURL] = useState('');
  const [flag, setFlag] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log(url);
  }, [url]);

  const onSubmitHandler = async () => {
    try {
      const response = await axios.post("http://localhost:9000/project", {
        gitURL: url
      });
      console.log(response.data.data.url);
      setFinalURL(response.data.data.url);
      setFlag(false);
      updateProgress();
    } catch (error) {
      console.error('Error submitting URL:', error);
    }
  };

  const updateProgress = () => {
    if (progress < 100) {
      setTimeout(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 20;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 6000);
    }
  };

  useEffect(() => {
    if (progress > 0 && progress < 100) {
      updateProgress();
    }
  }, [progress]);


  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      {flag ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", width: '50vw' }}>
          <Input placeholder='ENTER YOUR PROJECTS GIT URL' style={{ marginBottom: '40px', width: '300px' }} onChange={(e) => { setURL(e.target.value); }} />
          <Button variant='secondary' onClick={onSubmitHandler}>Submit</Button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", width: '50vw' }} >
          
          {progress >= 100 ? <div>You many visit your webpage at <br></br><a href={finalURL}><p style={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>{finalURL}</p></a>
          </div> : <Progress value={progress} />}
        </div>
      )}
    </ThemeProvider>
  );
}



export default App
