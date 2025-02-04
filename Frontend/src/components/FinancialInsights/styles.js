import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  insightsCard: {
    width: '100%',
    marginTop: '2rem',
    marginBottom: '1rem',
    maxWidth: '1200px', // Maximum width to prevent overstretching
    height: '95vh', // Slightly less than full viewport for breathing room
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Semi-transparent white
    borderRadius: theme.spacing(3), // More pronounced rounded corners
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)', // Deeper, more dramatic shadow
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.01)',
      boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    },
  },

  // Header with a more modern, impactful design
  cardHeader: {
    background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
    color: theme.palette.common.white,
    textAlign: 'center',
    padding: theme.spacing(3),
    fontSize: '2rem',
    fontWeight: 600,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },

  // Typography with more pronounced styling
  typographyTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(3),
    color: theme.palette.text.primary,
    fontSize: '1.4rem',
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    paddingBottom: theme.spacing(1),
  },

  // Grid layout with enhanced spacing and visual separation
  gridItem: {
    padding: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    },
  },

  // Chart container with subtle background and border
  chartContainer: {
    margin: theme.spacing(2, 0),
    backgroundColor: '#f4f6f9',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    border: '1px solid rgba(0,0,0,0.05)',
  },

  // Centered Financial Summary
  financialSummaryCentered: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.05)',
    margin: theme.spacing(2, 0),
  },

  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    textAlign: 'center',
  },
  
  summaryHighlight: {
    fontWeight: 600,
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.main,
  },

  categoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(1),
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
  },

  categoryAmount: {
    fontWeight: 500,
    color: 'black',
    marginLeft: theme.spacing(1),
  },

  incomeCategory: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
    },
  },

  expenseCategory: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
    },
  },

  

  // Scrollbar styling for modern browsers
  '@global': {
    '*::-webkit-scrollbar': {
      width: '8px',
    },
    '*::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '*::-webkit-scrollbar-thumb': {
      background: 'linear-gradient(to bottom, #667eea, #764ba2)',
      borderRadius: '10px',
    },
  },
}));

export default useStyles;