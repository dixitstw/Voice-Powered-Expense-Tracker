import React, { useContext, useState } from "react";
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
  IconButton
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { makeStyles } from "@material-ui/core/styles";
import { ExpenseTrackerContext } from "../../context/context";

const useStyles = makeStyles((theme) => ({
  root: {
    height: '96vh',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    backgroundColor: '#f4f6f8',
    overflow: 'hidden',
    borderRadius: '10px',
    marginBottom: theme.spacing(2)
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2)
  },
  title: {
    fontWeight: 'bold',
    color: '#333'
  },
  filterContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
    overflowX: 'auto',
    paddingBottom: theme.spacing(1),

  },
  tableContainerWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
    boxShadow: theme.shadows[3]
  },
  tableContainer: {
    flex: 1,
    overflowY: 'auto',
    // Custom scrollbar
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  },
  tableHead: {
    position: 'sticky',
    top: 0,
    backgroundColor: '#e0e0e0',
    zIndex: 10
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0'
  },
  incomeAmount: {
    color: 'green',
    fontWeight: 'bold'
  },
  expenseAmount: {
    color: 'red',
    fontWeight: 'bold'
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(2)
  },
  filterControl: {
    minWidth: 120,
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const TransactionsTable = () => {
  const classes = useStyles();
  const { transactions } = useContext(ExpenseTrackerContext);
  const [filter, setFilter] = useState({ 
    type: "", 
    date: "", 
    amount: "", 
    sort: "" 
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter logic
  const filteredTransactions = transactions.filter((transaction) => {
    const typeMatch = filter.type ? transaction.type === filter.type : true;
    const dateMatch = filter.date ? transaction.date.includes(filter.date) : true;
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
      return a.type === "Expense" && b.type === "Expense" ? b.amount - a.amount : 0;
    }
    return 0;
  });

  // Category color mapping
  const getCategoryColor = (type) => {
    return type === 'Income' ? 'primary' : 'secondary';
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h5" className={classes.title}>
          Transactions History
        </Typography>
        <IconButton 
          onClick={() => setShowFilters(!showFilters)}
          color="primary"
          size="small"
        >
          <FilterListIcon />
        </IconButton>
      </div>

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
                Highest Income <ArrowUpwardIcon fontSize="small" style={{ marginLeft: 8 }} />
              </MenuItem>
              <MenuItem value="highest-expense">
                Highest Expense <ArrowDownwardIcon fontSize="small" style={{ marginLeft: 8 }} />
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      )}

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
                <TableRow 
                  key={transaction.id}
                  hover
                >
                  <TableCell>
                    <Chip 
                      label={transaction.type} 
                      color={getCategoryColor(transaction.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell className={
                    transaction.type === 'Income' 
                      ? classes.incomeAmount 
                      : classes.expenseAmount
                  }>
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
          <Typography variant="body1">
            No transactions found
          </Typography>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;