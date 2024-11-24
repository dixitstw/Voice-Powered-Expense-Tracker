// src/components/Main/Form/Form.jsx
import React, { useState, useContext, useEffect } from 'react';
import { 
  TextField, 
  Typography, 
  Grid, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  IconButton,
  Collapse,
  Paper
} from '@material-ui/core';
import { Mic, MicOff } from '@material-ui/icons';
import { ExpenseTrackerContext } from '../../../context/context';
import { v4 as uuidv4 } from 'uuid';
import useStyles from './styles';
import formatDate from '../../../utils/formatDate';
import { incomeCategories, expenseCategories } from '../../../constants/categories';
import CustomizedSnackbar from '../../../Snackbar/Snackbar';
import useSpeechRecognition from '../../../hooks/useSpeechRecognition';

const initialState = {
  amount: '',
  category: '',
  type: 'Income',
  date: formatDate(new Date())
};

const Form = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState(initialState);
  const { addTransaction } = useContext(ExpenseTrackerContext);
  const [open, setOpen] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport
  } = useSpeechRecognition(formData, setFormData);

  const createTransaction = async () => {
    if (Number.isNaN(Number(formData.amount)) || !formData.date.includes('-')) return;
  
    const transaction = {
      ...formData,
      amount: Number(formData.amount),
      id: uuidv4()
    };
  
    try {
      await addTransaction(transaction); 
      setOpen(true);           
      setFormData(initialState); 
      setShowTranscript(false);          
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };
  

  useEffect(() => {
    if (transcript) {
      setShowTranscript(true);
      const timer = setTimeout(() => {
        if (formData.amount && formData.category) {
          createTransaction();
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [transcript, formData]);

  const selectedCategories = formData.type === 'Income' ? incomeCategories : expenseCategories;

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Grid container spacing={2}>
      <CustomizedSnackbar open={open} setOpen={setOpen} />
      
      <Grid item xs={12}>
        <Typography align="center" variant="subtitle2" gutterBottom>
          {hasRecognitionSupport 
            ? "" 
            : "Voice recognition is not supported in your browser"}
        </Typography>
      </Grid>

      {/* Voice Command Transcript */}
      <Grid item xs={12}>
        <Collapse in={showTranscript && !!transcript}>
          <Paper className={classes.transcriptPaper}>
            <Typography component = "div" style={{ fontWeight: 800, color: '#386641', fontFamily: 'Merriweather, serif', lineHeight: 1.6}}>
              Recognized: {transcript}
            </Typography>
          </Paper>
        </Collapse>
      </Grid>

      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select 
            value={formData.type} 
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="Income">Income</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select 
            value={formData.category} 
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {selectedCategories.map((c) => (
              <MenuItem key={c.type} value={c.type}>{c.type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6}>
        <TextField 
          type="number" 
          label="Amount" 
          fullWidth 
          value={formData.amount} 
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField 
          type="date" 
          label="Date" 
          fullWidth 
          value={formData.date} 
          onChange={(e) => setFormData({ ...formData, date: formatDate(e.target.value) })}
        />
      </Grid>

      <Grid item xs={12}>
        <Button 
          className={classes.button} 
          variant="outlined" 
          color="primary" 
          fullWidth 
          onClick={createTransaction}
        >
          Create
        </Button>
      </Grid>

      {hasRecognitionSupport && (
        <Grid item xs={12}>
          <IconButton 
            color={isListening ? "secondary" : "primary"}
            onClick={handleVoiceCommand}
            className={classes.voiceButton}
          >
            {isListening ? <MicOff /> : <Mic />}
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
};

export default Form;
