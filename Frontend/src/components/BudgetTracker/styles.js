import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  budgetCard: {
    height: "85vh",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    borderRadius: theme.spacing(2),
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#461220",
    color: theme.palette.common.white,
    padding: theme.spacing(3.5),
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  cardContent: {
    flexGrow: 1,
    overflowY: "auto",
    padding: theme.spacing(2),
    backgroundColor: "#f4f1de",
  },
  budgetItem: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: "#dda15e",
    borderRadius: theme.spacing(1.5),
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  budgetHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  budgetButton: {
    borderRadius: theme.spacing(1),
    textTransform: "none",
    fontWeight: 600,
  },
  progressContainer: {
    marginTop: theme.spacing(1),
  },
  progressText: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    fontSize: "0.8rem",
  },
  progressRoot: {
    height: 10,
    borderRadius: 5,
  },
  underBudget: {
    backgroundColor: theme.palette.primary.main,
  },
  overBudget: {
    backgroundColor: "red !important",
  },
}));
