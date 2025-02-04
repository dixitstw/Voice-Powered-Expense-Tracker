import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  // Main Component Styles
  rootCard: {
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f4f4f4',
    height: '95vh',
  },
  cardHeader: {
    backgroundColor: '#2a9d8f',
    color: 'white',
    padding: theme.spacing(2),
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
  },
  cardTitle: {
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  titleIcon: {
    marginRight: theme.spacing(1),
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.7)',
  },
  balancePaper: {
    backgroundColor: '#264653',
    color: 'white',
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    margin: theme.spacing(2, 0),
  },
  balanceIcon: {
    marginRight: theme.spacing(2),
    fontSize: '2.5rem',
    color: '#2a9d8f',
  },
  balanceText: {
    fontWeight: 'bold',
  },
  divider: {
    margin: theme.spacing(2, 0),
    backgroundColor: '#2a9d8f',
  },
  
  // List Component Styles
  enhancedList: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  incomeListItem: {
    backgroundColor: 'rgba(42, 157, 143, 0.1)',
    borderRadius: '8px',
    margin: theme.spacing(1, 0),
  },
  expenseListItem: {
    backgroundColor: 'rgba(231, 111, 81, 0.1)',
    borderRadius: '8px',
    margin: theme.spacing(1, 0),
  },
  avatarIncome: {
    backgroundColor: '#2a9d8f',
  },
  avatarExpense: {
    backgroundColor: '#e76f51',
  },
  transactionCategory: {
    fontWeight: 'bold',
    color: '#264653',
  },
  transactionDetails: {
    color: '#6c757d',
  },
  deleteButton: {
    color: '#d62828',
    '&:hover': {
      backgroundColor: 'rgba(214, 40, 40, 0.1)',
    },
  },
}));