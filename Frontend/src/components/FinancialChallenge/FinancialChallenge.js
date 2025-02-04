import React, { useState, useEffect, useContext } from 'react';
import { 
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Grid
} from '@material-ui/core';
import { 
  LocalDining as DiningIcon, 
  DirectionsBus as TransportIcon, 
  ShoppingCart as ShoppingIcon, 
  PowerOff as UtilityIcon 
} from '@material-ui/icons';
import { ExpenseTrackerContext } from '../../context/context';
import useStyles from './styles';

const DailyChallenges = () => {
  const classes = useStyles();
  const [challengeCompletions, setChallengeCompletions] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [totalChallengeRewards, setTotalChallengeRewards] = useState(0);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [userDefinedReward, setUserDefinedReward] = useState(0);
  const { addTransaction, transactions } = useContext(ExpenseTrackerContext);

  const dailyChallenges = [
    {
      id: 1,
      title: "No Dining Out Challenge",
      description: "Cook all meals at home today",
      category: "Food",
      icon: DiningIcon
    },
    {
      id: 2,
      title: "Transport Savings",
      description: "Use public transport or walk today",
      category: "Travel",
      icon: TransportIcon
    },
    {
      id: 3,
      title: "Expense Freeze",
      description: "Avoid any unnecessary expenses",
      category: "Shopping",
      icon: ShoppingIcon
    },
    {
      id: 4,
      title: "Utility Saver",
      description: "Reduce electricity and water usage",
      category: "Bills",
      icon: UtilityIcon
    }
  ];

  useEffect(() => {
    try {
      const storedCompletions = localStorage.getItem('challengeCompletions');
      if (storedCompletions) {
        setChallengeCompletions(JSON.parse(storedCompletions));
      }
    } catch (error) {
      console.error('Error loading challenge completions:', error);
      setChallengeCompletions({});
    }
  }, []);

  useEffect(() => {
    const challengeRewards = transactions
      ? transactions
          .filter(transaction => transaction.category === 'Challenge Reward')
          .reduce((total, transaction) => total + transaction.amount, 0)
      : 0;
    
    setTotalChallengeRewards(challengeRewards);
  }, [transactions]);

  const handleOpenRewardDialog = (challenge) => {
    setSelectedChallenge(challenge);
    setUserDefinedReward(0);
    setRewardDialogOpen(true);
  };

  const handleCloseRewardDialog = () => {
    setRewardDialogOpen(false);
    setSelectedChallenge(null);
    setUserDefinedReward(0);
  };

  const handleCompleteChallenge = (reward) => {
    if (selectedChallenge && reward > 0) {
      try {
        // Create the transaction object
        const rewardTransaction = {
          type: 'Income',
          category: 'Challenge Reward',
          amount: parseFloat(reward),
          date: new Date().toISOString().split('T')[0],
          id: Math.floor(Math.random() * 1000000), // Generate a random ID
          title: `${selectedChallenge.title} Reward` // Add a title for the transaction
        };

        // Add the transaction using the context
        addTransaction(rewardTransaction);

        // Update challenge completions
        const existingCompletions = challengeCompletions[selectedChallenge.id] || [];
        const newCompletion = {
          completedAt: new Date().toISOString(),
          reward: reward
        };

        const updatedCompletions = {
          ...challengeCompletions,
          [selectedChallenge.id]: [...existingCompletions, newCompletion]
        };

        // Update state and localStorage
        setChallengeCompletions(updatedCompletions);
        localStorage.setItem('challengeCompletions', JSON.stringify(updatedCompletions));

        // Close reward dialog and open success dialog
        handleCloseRewardDialog();
        setDialogOpen(true);
      } catch (error) {
        console.error('Error completing challenge:', error);
        handleCloseRewardDialog();
      }
    }
  };

  const getTodayCompletions = (challengeId) => {
    try {
      const completions = challengeCompletions[challengeId] || [];
      const today = new Date().toDateString();
      return completions.filter(completion => 
        new Date(completion.completedAt).toDateString() === today
      );
    } catch (error) {
      console.error('Error getting today completions:', error);
      return [];
    }
  };

  const renderChallengeCard = (challenge) => {
    const Icon = challenge.icon;
    const todayCompletions = getTodayCompletions(challenge.id);
    const totalCompletions = (challengeCompletions[challenge.id] || []).length;

    return (
      <Grid item xs={12} sm={6} key={challenge.id}>
        <Card className={classes.challengeCard}>
          <CardContent className={classes.challengeCardContent}>
            <Box display="flex" alignItems="center" marginBottom={2}>
              <Icon style={{ marginRight: 10, color: '#2575fc' }} />
              <Typography variant="h6" color="textPrimary">
                {challenge.title}
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {challenge.description}
            </Typography>
            
            <Box 
              className={classes.completionBadge}
              style={{ backgroundColor: '#f0f4f8', marginBottom: '10px' }}
            >
            </Box>
            
            <Button 
              variant="contained"
              color="primary"
              className={classes.completeButton}
              onClick={() => handleOpenRewardDialog(challenge)}
              fullWidth
            >
              Complete Challenge
            </Button>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Card className={classes.challengeContainer}>
      <Box 
        className={classes.totalRewardsContainer}
        style={{
          backgroundColor: '#3a5a40',
          color: 'white',
          padding: '8px',
          textAlign: 'center',
          borderRadius: '12px',
          margin: '8px'
        }}
      >
        <Typography variant="h6">
          Total Challenge Savings
        </Typography>
        <Typography variant="h5" style={{ fontWeight: 'bold' }}>
          ${totalChallengeRewards.toFixed(2)}
        </Typography>
      </Box>

      <div className={classes.challengeHeader}>
        <Typography variant="h6" className={classes.challengeTitle}>
           Savings Challenges
        </Typography>
        <Typography variant="body2" className={classes.challengeDescription}>
          Complete challenges to increase your savings!
        </Typography>
      </div>

      <CardContent>
        <Grid container spacing={2}>
          {dailyChallenges.map(renderChallengeCard)}
        </Grid>
      </CardContent>

      <Dialog 
        open={rewardDialogOpen} 
        onClose={handleCloseRewardDialog}
      >
        <DialogTitle>Set Your Challenge Savings</DialogTitle>
        <DialogContent>
          <Typography>
            How much would you like to reward yourself with savings for completing the "{selectedChallenge?.title}" challenge?
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Reward Amount"
            type="number"
            fullWidth
            value={userDefinedReward}
            onChange={(e) => setUserDefinedReward(Number(e.target.value))}
            inputProps={{ min: 0, step: "0.01" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRewardDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={() => handleCompleteChallenge(userDefinedReward)} 
            color="primary" 
            disabled={userDefinedReward <= 0}
          >
            Set Reward
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        classes={{ paper: classes.completedDialog }}
      >
        <DialogTitle>Challenge Completed!</DialogTitle>
        <DialogContent>
          <Typography>
            Congratulations! You've earned ${userDefinedReward.toFixed(2)} for completing this challenge.
          </Typography>
          <Typography style={{ marginTop: '10px' }}>
            Total Challenge Reward Savings: ${totalChallengeRewards.toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDialogOpen(false)} 
            className={classes.dialogCloseButton}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default DailyChallenges;