import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
`;

const UploadArea = styled.div`
  border: 2px dashed #3498db;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  background: ${props => props.isDragging ? '#f0f8ff' : '#fff'};

  &:hover {
    border-color: #2980b9;
    background: #f0f8ff;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileName = styled.p`
  color: #3498db;
  margin: 1rem 0;
  font-weight: 500;
`;

const UploadButton = styled.button`
  background: ${props => props.disabled ? '#bdc3c7' : '#3498db'};
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: block;
  margin: 0 auto 1.5rem;

  &:hover {
    background: ${props => props.disabled ? '#bdc3c7' : '#2980b9'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const ResultsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ecf0f1;
  }

  th {
    background: #3498db;
    color: white;
  }

  tr:hover {
    background: #f5fafe;
  }
`;

function UploadFile() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sameFile,setSameFile]=useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert('Please upload a CSV or Excel file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("employeeFile", file);
      setSameFile(file); 

      const res = await axios.post("https://retentiontoolbackend.vercel.app/api/enrich", formData);
      setResult(res.data);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file');
    } finally {
      setIsLoading(false);
    }
  };

  const sameFileRun = async () => {
    if (!sameFile) {
      alert('No previous file available');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("employeeFile", sameFile);

      const res = await axios.post("https://socialenrichmentbackend.vercel.app/api/enrich", formData);
      setResult(res.data);
    } catch (error) {
      console.error('Re-run error:', error);
      alert('Error re-processing file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>Employee engagement insights</Title>
      
      <UploadArea isDragging={isDragging}>
        <HiddenInput 
          type="file" 
          id="fileInput" 
          onChange={handleFileChange} 
          accept=".csv, .xlsx"
        />
        <label htmlFor="fileInput">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="50" 
            height="50" 
            viewBox="0 0 24 24"
            fill="#3498db"
            style={{ marginBottom: '1rem' }}
          >
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
          </svg>
          <p>Drag and drop your CSV/Excel file here or click to browse</p>
          {file && <FileName>Selected file: {file.name}</FileName>}
        </label>
      </UploadArea>

      <UploadButton 
        onClick={handleUpload} 

        disabled={!file || isLoading}
      >
        {isLoading ? 'Processing...' : 'Upload & Analyze'}
      </UploadButton>
 
      {result.length > 0 && (
        <ResultsTable>
          <thead>
            <tr>
              {Object.keys(result[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </ResultsTable>
      )}
    </Container>
  );
}

export default UploadFile;