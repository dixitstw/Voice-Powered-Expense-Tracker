import React, { useState, useContext, useEffect } from "react";
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
  Paper,
} from "@material-ui/core";
import { Mic, MicOff } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { ExpenseTrackerContext } from "../../../context/context";
import { v4 as uuidv4 } from "uuid";
import formatDate from "../../../utils/formatDate";
import {
  incomeCategories,
  expenseCategories,
} from "../../../constants/categories";
import CustomizedSnackbar from "../../../Snackbar/Snackbar";
import useSpeechRecognition from "../../../hooks/useSpeechRecognition";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#faedcd",
    padding: theme.spacing(3),
    borderRadius: "15px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    height: "50%",
  },
  formContainer: {
    background: "white",
    borderRadius: "12px",
    padding: theme.spacing(3),
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  selectInput: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      "&:hover fieldset": {
        borderColor: "#2a9d8f",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2a9d8f",
      },
    },
  },
  voiceButton: {
    width: "20%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
    margin: "10px auto",
    backgroundColor: "#ffffff",
    borderRadius: "50%",
    padding: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    "& svg": {
      fontSize: "35px",
      color: "#000000",
      transition: "all 0.3s ease",
    },
    "&:hover": {
      color: "white",
      backgroundColor: "#353535",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
      transform: "translateY(-2px)",
      "& svg": {
        transform: "scale(1.1)",
        color: "white",
      },
    },
  },
  createButton: {
    background: "green",
    color: "white",
    borderRadius: "12px",
    padding: theme.spacing(1.5),
    fontWeight: "bold",
    fontSize: "1rem",
    letterSpacing: "2px",
    fontFamily: "Merriweather",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "#283618",
      transform: "translateY(-3px)",
      boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
    },
  },
  transcriptPaper: {
    background: "#f0f4f8",
    padding: theme.spacing(2),
    borderRadius: "12px",
    marginBottom: theme.spacing(2),
  },
}));

const initialState = {
  amount: "",
  category: "",
  type: "Income",
  date: formatDate(new Date()),
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
    hasRecognitionSupport,
  } = useSpeechRecognition(formData, setFormData);

  const createTransaction = async () => {
    if (Number.isNaN(Number(formData.amount)) || !formData.date.includes("-"))
      return;

    const transaction = {
      ...formData,
      amount: Number(formData.amount),
      id: uuidv4(),
    };

    try {
      await addTransaction(transaction);
      setOpen(true);
      setFormData(initialState);
      setShowTranscript(false);
    } catch (error) {
      console.error("Failed to create transaction:", error);
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

  const selectedCategories =
    formData.type === "Income" ? incomeCategories : expenseCategories;

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3} className={classes.formContainer}>
        <CustomizedSnackbar open={open} setOpen={setOpen} />

        {/* Voice Recognition Support Message */}
        {!hasRecognitionSupport && (
          <Grid item xs={12}>
            <Typography
              align="center"
              variant="subtitle2"
              color="error"
              gutterBottom
            >
              Voice recognition is not supported in your browser
            </Typography>
          </Grid>
        )}

        {/* Voice Command Transcript */}
        {showTranscript && transcript && (
          <Grid item xs={12}>
            <Collapse in={showTranscript && !!transcript}>
              <Paper className={classes.transcriptPaper}>
                <Typography
                  component="div"
                  style={{
                    fontWeight: 800,
                    color: "#386641",
                    fontFamily: "Merriweather, serif",
                    lineHeight: 1.6,
                  }}
                >
                  Recognized: {transcript}
                </Typography>
              </Paper>
            </Collapse>
          </Grid>
        )}

        {/* Transaction Type Select */}
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            variant="outlined"
            className={classes.selectInput}
          >
            <Select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              label="Transaction Type"
            >
              <MenuItem value="Income">Income</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Category Select */}
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            variant="outlined"
            className={classes.selectInput}
          >
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              label="Category"
            >
              {selectedCategories.map((c) => (
                <MenuItem key={c.type} value={c.type}>
                  {c.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Amount Input */}
        <Grid item xs={12} sm={6}>
          <TextField
            type="number"
            label="Amount"
            variant="outlined"
            fullWidth
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className={classes.selectInput}
          />
        </Grid>

        {/* Date Input */}
        <Grid item xs={12} sm={6}>
          <TextField
            type="date"
            label="Date"
            variant="outlined"
            fullWidth
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: formatDate(e.target.value) })
            }
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.selectInput}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            className={classes.createButton}
            variant="contained"
            fullWidth
            onClick={createTransaction}
          >
            Create Transaction
          </Button>
        </Grid>

        {hasRecognitionSupport && (
          <Grid item xs={12} container justifyContent="center">
            <IconButton
              onClick={handleVoiceCommand}
              className={classes.voiceButton}
            >
              {isListening ? <MicOff /> : <Mic />}
            </IconButton>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Form;
