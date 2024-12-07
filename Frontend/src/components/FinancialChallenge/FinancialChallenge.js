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
  TextField
} from '@material-ui/core';
import { ExpenseTrackerContext } from '../../context/context';
import useStyles from './styles';

const DailyChallenge = () => {
  const classes = useStyles();
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [totalChallengeRewards, setTotalChallengeRewards] = useState(0);
  const [userDefinedReward, setUserDefinedReward] = useState(0);
  const { addTransaction, transactions } = useContext(ExpenseTrackerContext);

  const dailyChallenges = [
    {
      id: 1,
      title: "No Dining Out Challenge",
      description: "Cook all meals at home today",
      category: "Food"
    },
    {
      id: 2,
      title: "Transport Savings",
      description: "Use public transport or walk today",
      category: "Travel"
    },
    {
      id: 3,
      title: "Expense Freeze",
      description: "Avoid any unnecessary expenses",
      category: "Shopping"
    },
    {
      id: 4,
      title: "Utility Saver",
      description: "Reduce electricity and water usage",
      category: "Bills"
    }
  ];

  // Calculate total challenge rewards
  useEffect(() => {
    const challengeRewards = transactions
      .filter(transaction => 
        transaction.category === 'Challenge Reward'
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
    
    setTotalChallengeRewards(challengeRewards);
  }, [transactions]);

  useEffect(() => {
    const storedChallenge = localStorage.getItem('dailyChallenge');
    const storedDate = localStorage.getItem('challengeDate');
    const today = new Date().toDateString();

    if (storedChallenge && storedDate === today) {
      setCurrentChallenge(JSON.parse(storedChallenge));
    } else {
      const randomChallenge = dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)];
      setCurrentChallenge(randomChallenge);
      localStorage.setItem('dailyChallenge', JSON.stringify(randomChallenge));
      localStorage.setItem('challengeDate', today);
    }
  }, []);

  const handleOpenRewardDialog = () => {
    setRewardDialogOpen(true);
  };

  const handleCloseRewardDialog = () => {
    setRewardDialogOpen(false);
  };

  const handleSetReward = () => {
    if (userDefinedReward > 0) {
      handleCompleteChallenge(userDefinedReward);
      handleCloseRewardDialog();
    }
  };

  const handleCompleteChallenge = (reward) => {
    if (currentChallenge) {
      const rewardTransaction = {
        type: 'Income',
        category: 'Challenge Reward',
        amount: reward,
        date: new Date().toISOString().split('T')[0],
        id: `challenge-${Date.now()}`
      };

      addTransaction(rewardTransaction);
      setChallengeCompleted(true);
      setDialogOpen(true);
      localStorage.removeItem('dailyChallenge');
      localStorage.removeItem('challengeDate');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  if (!currentChallenge) return null;

  return (
    <Card className={classes.challengeContainer}>
      {/* Total Challenge Rewards Display */}
      <Box 
        className={classes.totalRewardsContainer}
        style={{
          backgroundColor: '#3a5a40',
          color: 'white',
          padding: '4px',
          textAlign: 'center',
          borderRadius: '12px',
          margin: '4px'
        }}
      >
        <Typography variant="h8">
          Total Challenge Rewards
        </Typography>
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
          ${totalChallengeRewards.toFixed(2)}
        </Typography>
      </Box>

      <div className={classes.challengeHeader}>
        <Typography variant="h6" className={classes.challengeTitle}>
          Daily Financial Challenge
        </Typography>
        <Typography variant="body2" className={classes.challengeDescription}>
          Your daily opportunity to save and earn!
        </Typography>
      </div>
      <CardContent className={classes.challengeContent}>
        <Typography variant="h6" color="textPrimary">
          {currentChallenge.title}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {currentChallenge.description}
        </Typography>
        <Button 
          className={classes.completeButton}
          onClick={handleOpenRewardDialog}
          disabled={challengeCompleted}
          fullWidth
        >
          Complete Challenge
        </Button>
      </CardContent>

      {/* Reward Input Dialog */}
      <Dialog 
        open={rewardDialogOpen} 
        onClose={handleCloseRewardDialog}
      >
        <DialogTitle>Set Your Challenge Reward</DialogTitle>
        <DialogContent>
          <Typography>
            How much would you like to reward yourself for completing this challenge?
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Reward Amount"
            type="number"
            fullWidth
            value={userDefinedReward}
            onChange={(e) => setUserDefinedReward(Number(e.target.value))}
            inputProps={{ min: 0 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRewardDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSetReward} 
            color="primary" 
            disabled={userDefinedReward <= 0}
          >
            Set Reward
          </Button>
        </DialogActions>
      </Dialog>

      {/* Challenge Completed Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        classes={{ paper: classes.completedDialog }}
      >
        <DialogTitle>Challenge Completed!</DialogTitle>
        <DialogContent>
          <Typography>
            Congratulations! You've earned ${userDefinedReward} for completing today's challenge.
          </Typography>
          <Typography style={{ marginTop: '10px' }}>
            Total Challenge Rewards: ${totalChallengeRewards.toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            className={classes.dialogCloseButton}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default DailyChallenge;