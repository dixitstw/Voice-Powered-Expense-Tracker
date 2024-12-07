import React, { useState } from 'react';
import { Button, Dialog, Grid } from "@material-ui/core";
import Details from "./components/Details/Details";
import Main from './components/Main/Main';
import Auth from './components/Auth/Auth';
import useStyles from './styles';
import { Provider } from './context/context';
import BudgetTracker from './components/BudgetTracker/BudgetTracker'; 
import FinancialInsights from './components/FinancialInsights/FinancialInsights'; 
import DailyChallenge from './components/FinancialChallenge/FinancialChallenge';
import TransactionsTable from './components/TransactionsTable/TransactionsTable';

const App = () => {
  const classes = useStyles();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);


  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };


  const handleOpenDailyChallenge = () => {
    setIsDailyChallengeOpen(true);
  };

  const handleCloseDailyChallenge = () => {
    setIsDailyChallengeOpen(false);
  };

  if (!user) return <Auth onAuthSuccess={handleAuthSuccess} />;

  return (
    <Provider>
<Button
  variant="contained" 
  color="primary" 
  onClick={handleOpenDailyChallenge}
  style={{
    position: 'fixed', 
    top: '20px',
    right: '20px',     
    zIndex: 1000,     
   backgroundColor: '#3a5a40',
          color: '#fff', 
          textTransform: 'none', 
          border: 'none', 
          borderRadius: '8px', 
          padding: '8px 15px', 
          fontSize: '18px', 
          fontWeight: 'bold', 
          cursor: 'pointer', 
          transition: 'all 0.3s ease', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
          overflow: 'hidden', 
          fontFamily: 'Merriweather'
        }}
    
>
  Daily Challenge
</Button>
    <div>
      <Grid 
        className={classes.grid}
        container
        spacing={0}
        alignItems="center"
        justifyContent="center"
        style={{ height: "100vh" }}
      >
        <Grid item xs={12} sm={4} className={classes.mobile}>
          <Details title="Income" />
        </Grid>

        <Grid item xs={12} sm={3} className={classes.main}>
          <Main onLogout={handleLogout} />
        </Grid>

        <Grid item xs={12} sm={4} className={classes.desktop}>
          <Details title="Income" />
        </Grid>

        <Grid item xs={12} sm={4} className={classes.last}>
          <Details title="Expense" />
        </Grid>

        <Grid item xs={12} md={6}>
            <BudgetTracker />
          </Grid>

          <Grid item xs={12} md={6}>
            <FinancialInsights />
          </Grid>

          <Grid item xs={12} md={6}>
            <TransactionsTable />
          </Grid>

          <Dialog
          open={isDailyChallengeOpen}
          onClose={handleCloseDailyChallenge}
          maxWidth="md"
          fullWidth
        >
          <DailyChallenge onClose={handleCloseDailyChallenge} />
        </Dialog>

        <button onClick = {handleLogout}
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          backgroundColor: '#3a5a40',
          color: '#fff', 
          border: 'none', 
          borderRadius: '8px', 
          padding: '8px 15px', 
          fontSize: '18px', 
          fontWeight: 'bold', 
          cursor: 'pointer', 
          transition: 'all 0.3s ease', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
          overflow: 'hidden', 
          fontFamily: 'Merriweather'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#432818'; 
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 6px 10px rgba(0, 0, 0, 0.15)'; 
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#3a5a40'; 
          e.target.style.transform = 'scale(1)'; 
          e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; 
        }}>Log out</button>
      </Grid>
    </div>
    </Provider>
  );
};

export default App;