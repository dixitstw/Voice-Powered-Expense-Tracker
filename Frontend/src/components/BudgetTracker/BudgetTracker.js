import React, { useState, useContext, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  LinearProgress, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField
} from '@material-ui/core';
import { ExpenseTrackerContext } from '../../context/context';
import { expenseCategories } from '../../constants/categories';
import useStyles from './styles';

const BudgetTracker = () => {
  const classes = useStyles();
  const { transactions } = useContext(ExpenseTrackerContext);
  const [budgets, setBudgets] = useState({});
  const [openBudgetDialog, setOpenBudgetDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  // Initialize budgets with 0 for all categories on component mount
  useEffect(() => {
    const savedBudgets = JSON.parse(localStorage.getItem('categoryBudgets') || '{}');
    
    // Create an object with all categories initialized to 0
    const initialBudgets = expenseCategories.reduce((acc, category) => {
      acc[category.type] = 0;
      return acc;
    }, {});

    // Merge saved budgets with initial budgets, preferring saved values
    const mergedBudgets = {
      ...initialBudgets,
      ...savedBudgets
    };

    setBudgets(mergedBudgets);
    
    // Save the merged budgets to localStorage if it's different from saved
    if (Object.keys(savedBudgets).length !== expenseCategories.length) {
      localStorage.setItem('categoryBudgets', JSON.stringify(mergedBudgets));
    }
  }, []);

  // Calculate total expenses for each category
  const calculateCategoryExpenses = (category) => {
    return transactions
      .filter(t => t.type === 'Expense' && t.category === category)
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  // Open budget setting dialog
  const handleOpenBudgetDialog = (category) => {
    setSelectedCategory(category);
    setBudgetAmount(budgets[category] || '');
    setOpenBudgetDialog(true);
  };

  // Save budget for a category
  const handleSaveBudget = () => {
    const newBudgets = {
      ...budgets,
      [selectedCategory]: Number(budgetAmount) || 0 // Ensure we store 0 if input is empty or invalid
    };
    setBudgets(newBudgets);
    localStorage.setItem('categoryBudgets', JSON.stringify(newBudgets));
    setOpenBudgetDialog(false);
    setBudgetAmount('');
  };

  return (
    <Card className={classes.budgetCard}>
      <CardHeader title="Monthly Category Budgets" className={classes.cardHeader} />
      <CardContent className={classes.cardContent}>
        {expenseCategories.map((category) => {
          const totalExpense = calculateCategoryExpenses(category.type);
          const budgetAmount = budgets[category.type] ?? 0; // Use nullish coalescing to ensure 0 if undefined
          const progressPercentage = budgetAmount 
            ? Math.min((totalExpense / budgetAmount) * 100, 100) 
            : 0;

          return (
            <div key={category.type} className={classes.budgetItem}>
              <div className={classes.budgetHeader}>
                <Typography variant="subtitle1">{category.type}</Typography>
                <Button 
                  size="small" 
                  color="primary" 
                  onClick={() => handleOpenBudgetDialog(category.type)}
                  className={classes.budgetButton}
                >
                  Set Budget
                </Button>
              </div>
              <Typography variant="caption">
                ${totalExpense.toFixed(2)} / ${budgetAmount.toFixed(2)}
              </Typography>
              <LinearProgress 
  variant="determinate" 
  value={progressPercentage}
  style={{
    height: '8px',
    borderRadius: '4px',
    backgroundColor: '#d3d3d3', // Light grey background
  }}
  classes={{
    bar: progressPercentage > 100 ? classes.overBudget : classes.underBudget
  }}
/>
            </div>
          );
        })}
      </CardContent>

      {/* Budget Setting Dialog */}
      <Dialog 
        open={openBudgetDialog} 
        onClose={() => {
          setOpenBudgetDialog(false);
          setBudgetAmount('');
        }}
      >
        <DialogTitle>Set Budget for {selectedCategory}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Budget Amount"
            type="number"
            fullWidth
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            inputProps={{ min: "0", step: "0.01" }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenBudgetDialog(false);
              setBudgetAmount('');
            }} 
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleSaveBudget} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default BudgetTracker;