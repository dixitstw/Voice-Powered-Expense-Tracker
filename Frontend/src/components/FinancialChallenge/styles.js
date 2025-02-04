import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  challengeContainer: {
    maxWidth: 600,
    margin: '20px auto',
    borderRadius: 16,
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.01)',
    },
  },
  challengeHeader: {
    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    color: 'white',
    padding: theme.spacing(2),
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    textAlign: 'center',
  },
  challengeTitle: {
    fontWeight: 600,
    fontSize: '1.5rem',
    marginBottom: theme.spacing(1),
  },
  challengeDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
  },
  challengeCard: {
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      transform: 'translateY(-4px)',
    },
  },
  challengeCardContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
  },
  completionBadge: {
    backgroundColor: '#f0f4f8',
    color: '#2575fc',
    borderRadius: 20,
    padding: '6px 12px',
    display: 'inline-block',
    fontWeight: 500,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'center',
    width: '100%',
  },
  completeButton: {
    background: 'linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: 25,
    textTransform: 'none',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
    '&:disabled': {
      background: '#e0e0e0',
      color: '#666',
    },
  },
  totalRewardsContainer: {
    backgroundColor: '#3a5a40',
    color: 'white',
    padding: '8px',
    textAlign: 'center',
    borderRadius: '12px',
    margin: '8px',
  },
  completedDialog: {
    '& .MuiDialogTitle-root': {
      backgroundColor: '#4caf50',
      color: 'white',
      textAlign: 'center',
    },
    '& .MuiDialogContent-root': {
      textAlign: 'center',
      padding: theme.spacing(3),
    },
  },
  dialogCloseButton: {
    color: '#2575fc',
    fontWeight: 600,
  }
}));