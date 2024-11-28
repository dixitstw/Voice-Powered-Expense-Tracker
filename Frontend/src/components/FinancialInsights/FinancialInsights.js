import React, { useContext, useMemo } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  Grid 
} from '@material-ui/core';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { ExpenseTrackerContext } from '../../context/context';
import useStyles from './styles';

const FinancialInsights = () => {
  const classes = useStyles();
  const { transactions } = useContext(ExpenseTrackerContext);

  // Prepare data for insights
  const insights = useMemo(() => {
    const monthlyTransactions = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { 
          month: monthKey, 
          income: 0, 
          expenses: 0 
        };
      }

      if (transaction.type === 'Income') {
        acc[monthKey].income += transaction.amount;
      } else {
        acc[monthKey].expenses += transaction.amount;
      }

      return acc;
    }, {});

    return Object.values(monthlyTransactions).sort((a, b) => {
      const [aYear, aMonth] = a.month.split('-').map(Number);
      const [bYear, bMonth] = b.month.split('-').map(Number);
      return aYear - bYear || aMonth - bMonth;
    });
  }, [transactions]);

  // Calculate key financial metrics
  const financialMetrics = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;

    // Categorize income and expenses
    const incomeByCategory = transactions
      .filter(t => t.type === 'Income')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const expensesByCategory = transactions
      .filter(t => t.type === 'Expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    // Top categories
    const topIncomeCategories = Object.entries(incomeByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const topExpenseCategories = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return {
      totalIncome,
      totalExpenses,
      savingsRate,
      topIncomeCategories,
      topExpenseCategories
    };
  }, [transactions]);

  return (
    <Card className={classes.insightsCard}>
      <CardHeader title="Financial Insights" />
      <CardContent>
        <Grid container spacing={3}>
          {/* Monthly Income vs Expenses Chart */}
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              Monthly Income vs Expenses
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={insights}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  name="Income" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  name="Expenses" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Grid>

          {/* Centered Financial Summary */}
          <Grid item xs={12} className={classes.gridItem}>
            <div className={classes.financialSummaryCentered}>
              <Typography variant="h6" className={classes.typographyTitle}  style={{fontWeight: '600', fontFamily: "Merriweather"}}>
                Financial Summary
              </Typography>
              <div className={classes.summaryItem}>
                <Typography variant="body1">
                  Total Income: 
                  <span className={classes.summaryHighlight}>
                    ${financialMetrics.totalIncome.toFixed(2)}
                  </span>
                </Typography>
                <Typography variant="body1">
                  Total Expense: 
                  <span className={classes.summaryHighlight} style={{color: '#ff6b6b'}}>
                    ${financialMetrics.totalExpenses.toFixed(2)}
                  </span>
                </Typography>
                <Typography variant="body1">
                  Savings Rate: 
                  <span className={classes.summaryHighlight} style={{color: '#48dbfb'}}>
                    {financialMetrics.savingsRate.toFixed(2)}%
                  </span>
                </Typography>
              </div>
            </div>
          </Grid>

          {/* Top Income Categories - Left Side */}
          <Grid item xs={12} md={6} className={classes.gridItem}>
            <div className={classes.incomeCategory}>
              <Typography variant="h6" className={classes.typographyTitle} style={{fontWeight: '600', fontFamily: "Merriweather"}}>
                Top Income Categories
              </Typography>
              {financialMetrics.topIncomeCategories.map(([category, amount]) => (
                <Typography key={category} variant="body1" className={classes.categoryItem}>
                  {category}: 
                  <span className={classes.categoryAmount}>
                    ${amount.toFixed(2)}
                  </span>
                </Typography>
              ))}
            </div>
          </Grid>

          {/* Top Expense Categories - Right Side */}
          <Grid item xs={12} md={6} className={classes.gridItem}>
            <div className={classes.expenseCategory}>
              <Typography variant="h6" className={classes.typographyTitle} style = {{fontWeight: '600', fontFamily: 'Merriweather'}}>
                Top Expense Categories
              </Typography>
              {financialMetrics.topExpenseCategories.map(([category, amount]) => (
                <Typography key={category} variant="body1" className={classes.categoryItem}>
                  {category}: 
                  <span className={classes.categoryAmount}>
                    ${amount.toFixed(2)}
                  </span>
                </Typography>
              ))}
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FinancialInsights;