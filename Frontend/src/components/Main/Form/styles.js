import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  radioGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '-10px',
  },
  button: {
    marginTop: '20px',
  },
  voiceButton: {
    width: '20%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',    // Center align content vertically
    marginTop: '10px',
    margin: '10px auto',     // Center align the button horizontally
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    padding: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    '& svg': {
      fontSize: '35px',
      color: '#000000',
      transition: 'all 0.3s ease',
    },
    '&:hover': {
      color: 'white',
      backgroundColor: '#353535',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
      transform: 'translateY(-2px)',
      '& svg': {
        transform: 'scale(1.1)',
        color: 'white', 
      },
    },
  },
  transcriptPaper: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    '& Typography': {
      fontWeight: 700, 
      fontSize: '1.1rem',
      color: '#2e7d32', 
      lineHeight: 1.4,
    },
  },
  listening: {
    animation: '$pulse 1.5s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1,
    },
    '50%': {
      transform: 'scale(1.1)',
      opacity: 0.7,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
}));
