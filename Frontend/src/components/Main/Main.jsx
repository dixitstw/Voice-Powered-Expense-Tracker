import React, { useContext } from 'react'
import {
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  Grid, 
  Divider, 
  Paper
} from '@material-ui/core'
import { 
  AccountBalance as BalanceIcon, 
  AttachMoney as MoneyIcon 
} from '@material-ui/icons';
import { ExpenseTrackerContext } from '../../context/context';
import useStyles from './styles'
import Form from './Form/Form';
import List from './List/List';
import Infocard from '../../Infocard';

const Main = () => {
    const classes = useStyles();
    const {balance} = useContext(ExpenseTrackerContext);

  return (
    <Card className={classes.rootCard}>
      <CardHeader 
        title={
          <Typography variant="h4" className={classes.cardTitle}>
            <MoneyIcon className={classes.titleIcon} /> 
            Expense Tracker
          </Typography>
        } 
        subheader={
          <Typography variant="subtitle2" className={classes.cardSubtitle}>
            Powered with voice
          </Typography>
        }
        className={classes.cardHeader}
      />
      <CardContent className={classes.cardContentTop}>
        <Paper elevation={3} className={classes.balancePaper}>
          <BalanceIcon className={classes.balanceIcon} />
          <Typography 
            align='center' 
            variant='h5' 
            className={classes.balanceText}
          >
            Total Balance: ${balance}
          </Typography>
        </Paper>
        
        <Typography 
          variant='subtitle1' 
          className={classes.infocardText}
        >
          <Infocard/>
        </Typography>
        
        <Divider className={classes.divider}/>
        
        <Form/>
      </CardContent>
      
      <CardContent className={classes.cardContentBottom}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <List/>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Main