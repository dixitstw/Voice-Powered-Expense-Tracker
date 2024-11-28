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

  // Load budgets from localStorage on component mount
  useEffect(() => {
    const savedBudgets = JSON.parse(localStorage.getItem('categoryBudgets') || '{}');
    setBudgets(savedBudgets);
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
    setOpenBudgetDialog(true);
  };

  // Save budget for a category
  const handleSaveBudget = () => {
    const newBudgets = {
      ...budgets,
      [selectedCategory]: Number(budgetAmount)
    };
    setBudgets(newBudgets);
    localStorage.setItem('categoryBudgets', JSON.stringify(newBudgets));
    setOpenBudgetDialog(false);
    setBudgetAmount('');
  };

  return (
    <Card className={classes.budgetCard}>
      <CardHeader title="Monthly Category Budgets" className={classes.cardHeader}
 
      />
      <CardContent className = {classes.cardContent}>
        {expenseCategories.map((category) => {
          const totalExpense = calculateCategoryExpenses(category.type);
          const budgetAmount = budgets[category.type] || 0;
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
                color={progressPercentage > 100 ? 'secondary' : 'primary'}
              />
            </div>
          );
        })}
      </CardContent>

      {/* Budget Setting Dialog */}
      <Dialog 
        open={openBudgetDialog} 
        onClose={() => setOpenBudgetDialog(false)}
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBudgetDialog(false)} color="primary">
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