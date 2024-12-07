import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  challengeContainer: {
    maxWidth: 400,
    margin: '20px auto',
    borderRadius: 12,
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  challengeHeader: {
    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    color: 'white',
    padding: theme.spacing(2),
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    textAlign: 'center',
  },
  challengeTitle: {
    fontWeight: 600,
    fontSize: '1.25rem',
    marginBottom: theme.spacing(1),
  },
  challengeDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
  },
  challengeContent: {
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  rewardBadge: {
    backgroundColor: '#f0f4f8',
    color: '#2575fc',
    borderRadius: 20,
    padding: '8px 16px',
    display: 'inline-block',
    fontWeight: 600,
    marginTop: theme.spacing(2),
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