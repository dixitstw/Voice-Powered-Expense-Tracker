import React, { useContext, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Chip,
  IconButton,
  Snackbar,
} from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { makeStyles } from "@material-ui/core/styles";
import { ExpenseTrackerContext } from "../../context/context";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "96vh",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    backgroundColor: "#f4f6f8",
    overflow: "hidden",
    borderRadius: "10px",
    marginBottom: theme.spacing(2),
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  title: {
    fontWeight: "bold",
    color: "#333",
    fontFamily: 'Merriweather',
    fontSize: '2rem'
  },
  filterContainer: {
    display: "flex",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    flexWrap: "wrap",
    overflowX: "auto",
    paddingBottom: theme.spacing(1),
  },
  tableContainerWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(2),
    overflow: "hidden",
    boxShadow: theme.shadows[3],
  },
  tableContainer: {
    flex: 1,
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
  },
  tableHead: {
    position: "sticky",
    top: 0,
    backgroundColor: "#e0e0e0",
    zIndex: 10,
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#e0e0e0",
  },
  incomeAmount: {
    color: "green",
    fontWeight: "bold",
  },
  expenseAmount: {
    color: "red",
    fontWeight: "bold",
  },
  emptyState: {
    textAlign: "center",
    padding: theme.spacing(2),
  },
  filterControl: {
    minWidth: 120,
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  voiceFilterButton: {
    marginLeft: theme.spacing(2),
    color: 'black',
    transform: 'scale(1.5)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.7)',
      color: theme.palette.secondary.main,
    }
  },
  voiceActive: {
    color: theme.palette.secondary.main,
    transform: 'scale(1.6)',
    animation: '$pulse 1.5s infinite',
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1.5)' },
    '50%': { transform: 'scale(1.7)' },
    '100%': { transform: 'scale(1.5)' }
  },
  transcriptContainer: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: '#f0f0f0',
    borderRadius: theme.spacing(1),
    color: 'green',
    fontWeight: 'bold',
    fontFamily: 'Merriweather',
  }
}));

const TransactionsTable = () => {
  const classes = useStyles();
  const { transactions } = useContext(ExpenseTrackerContext);
  const [filter, setFilter] = useState({
    type: "",
    date: "",
    amount: "",
    sort: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [voiceTranscript, setVoiceTranscript] = useState("");

  // Voice recognition setup
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim().toLowerCase();
        setVoiceTranscript(transcript);
        processVoiceCommand(transcript);
      };

      recognitionInstance.onerror = (event) => {
        setVoiceError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      setVoiceError("Web Speech API is not supported in this browser");
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      try {
        setIsListening(true);
        setVoiceError("");
        setVoiceTranscript("");
        recognition.start();
      } catch (error) {
        setVoiceError("Failed to start speech recognition");
        setIsListening(false);
      }
    }
  };

  const processVoiceCommand = (command) => {
    // Helper function to extract value after a key phrase
    const extractValue = (phrase, command) => {
      const index = command.indexOf(phrase);
      if (index !== -1) {
        return command.slice(index + phrase.length).trim();
      }
      return "";
    };

    // Voice command parsing
    if (command.includes("filter by type")) {
      if (command.includes("income")) {
        setFilter((prev) => ({ ...prev, type: "Income" }));
      } else if (command.includes("expense")) {
        setFilter((prev) => ({ ...prev, type: "Expense" }));
      } else {
        setFilter((prev) => ({ ...prev, type: "" }));
      }
    } else if (command.includes("filter by date")) {
      const dateValue = extractValue("filter by date", command);
      if (dateValue) {
        // More robust date parsing
        let parsedDate = '';
        
        // Basic date formats like "2023-05-20" or "05/20/2023"
        const dateRegex = /\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/;
        const matchedDate = command.match(dateRegex);
        
        if (matchedDate) {
          parsedDate = matchedDate[0];
        } else {
          // Handle natural language dates
          const dateMap = {
            'today': new Date().toISOString().split('T')[0],
            'yesterday': new Date(Date.now() - 86400000).toISOString().split('T')[0],
            'last week': new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
            'last month': new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
          };
          
          parsedDate = dateMap[dateValue] || dateValue;
        }
        
        setFilter((prev) => ({ ...prev, date: parsedDate }));
      }
    } else if (command.includes("filter by amount")) {
      const amountValue = extractValue("filter by amount", command);
      if (amountValue) {
        setFilter((prev) => ({ ...prev, amount: amountValue }));
      }
    } else if (command.includes("filter by highest income")) {
      setFilter((prev) => ({ ...prev, sort: "highest-income" }));
    } else if (command.includes("filter by highest expense")) {
      setFilter((prev) => ({ ...prev, sort: "highest-expense" }));
    } else if (
      command.includes("clear filters") ||
      command.includes("reset filters")
    ) {
      setFilter({ type: "", date: "", amount: "", sort: "" });
    }
  };

  // Filter logic
  const filteredTransactions = transactions.filter((transaction) => {
    const typeMatch = filter.type ? transaction.type === filter.type : true;
    const dateMatch = filter.date
      ? transaction.date.includes(filter.date)
      : true;
    const amountMatch = filter.amount
      ? transaction.amount === parseFloat(filter.amount)
      : true;
    return typeMatch && dateMatch && amountMatch;
  });

  // Sort logic
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (filter.sort === "highest-income") {
      return b.amount - a.amount;
    } else if (filter.sort === "highest-expense") {
      return a.type === "Expense" && b.type === "Expense"
        ? b.amount - a.amount
        : 0;
    }
    return 0;
  });

  // Category color mapping
  const getCategoryColor = (type) => {
    return type === "Income" ? "primary" : "secondary";
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h5" className={classes.title}>
          Transactions History
        </Typography>
        <div>
          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            color="primary"
            size="medium"
            sx={{ fontSize: '2rem' }} 
          >
            <FilterListIcon fontSize="large"  />
          </IconButton>
          {recognition && (
            <IconButton
              onClick={startListening}
              className={`${classes.voiceFilterButton} ${
                isListening ? classes.voiceActive : ""
              }`}
              size="small"
            >
              {isListening ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          )}
        </div>
      </div>

      {/* Transcript display */}
      {voiceTranscript && (
        <div className={classes.transcriptContainer}>
          <Typography variant="body2">
            Voice Transcript: {voiceTranscript}
          </Typography>
        </div>
      )}

      {/* filter controls */}
      {showFilters && (
        <div className={classes.filterContainer}>
          <FormControl className={classes.filterControl} size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Income">Income</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
            className={classes.filterControl}
            size="small"
          />

          <TextField
            label="Amount"
            type="number"
            value={filter.amount}
            onChange={(e) => setFilter({ ...filter, amount: e.target.value })}
            className={classes.filterControl}
            size="small"
          />

          <FormControl className={classes.filterControl} size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filter.sort}
              onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="highest-income">
                Highest Income{" "}
                <ArrowUpwardIcon fontSize="small" style={{ marginLeft: 8 }} />
              </MenuItem>
              <MenuItem value="highest-expense">
                Highest Expense{" "}
                <ArrowDownwardIcon fontSize="small" style={{ marginLeft: 8 }} />
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      )}

      {/* table rendering */}
      <div className={classes.tableContainerWrapper}>
        <TableContainer className={classes.tableContainer} component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerCell}>Type</TableCell>
                <TableCell className={classes.headerCell}>Category</TableCell>
                <TableCell className={classes.headerCell}>Amount</TableCell>
                <TableCell className={classes.headerCell}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>
                    <Chip
                      label={transaction.type}
                      color={getCategoryColor(transaction.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell
                    className={
                      transaction.type === "Income"
                        ? classes.incomeAmount
                        : classes.expenseAmount
                    }
                  >
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {sortedTransactions.length === 0 && (
        <div className={classes.emptyState}>
          <Typography variant="body1">No transactions found</Typography>
        </div>
      )}

      {/* Voice recognition error handling */}
      <Snackbar
        open={!!voiceError}
        autoHideDuration={6000}
        onClose={() => setVoiceError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setVoiceError("")} severity="error">
          {voiceError}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TransactionsTable;