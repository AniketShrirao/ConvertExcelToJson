import './App.css';
import DownloadJsons from './components/DownloadJsons';
import UploadExcel from './components/UploadExcel';
import Wrapper from './components/Wrapper';

function App() {
  return (
    <div className="App">
      <Wrapper width='86%'>
        <UploadExcel />
        <DownloadJsons />
      </Wrapper>
    </div>
  );
}

export default App;
