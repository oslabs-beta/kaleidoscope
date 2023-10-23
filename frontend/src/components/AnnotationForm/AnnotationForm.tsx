// Component to render the form which accepts user input to create annotation

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export const AnnotationForm = ({ x, y, onSave, onCancel }) => {
  const [annotationText, setAnnotationText] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(annotationText);
  };
  
  // Style for the form. Position it absolutely and set the x/y coordinates based on the props
  // passed down from the users' click event.
  const formStyle = {
    position: 'absolute',
    top: `${y}px`,
    left: `${x}px`,
    zIndex: 100,
    width: 300,
    height: 300,
    backgroundColor: 'white',
    padding: '1rem',
  };

  return (
    <Card variant="outlined" sx={{ ...formStyle }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Add Annotation
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            id="outlined-multiline-static"
            label="Annotation"
            multiline
            rows={4}
            value={annotationText}
            onChange={(e) => setAnnotationText(e.target.value)}
          />
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '1rem' }}>
            <Button type="submit" variant="contained">Save</Button>
            <Button onClick={onCancel} variant="contained">Cancel</Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
