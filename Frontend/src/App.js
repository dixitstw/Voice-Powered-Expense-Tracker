import React, { useState } from "react";
import { Button, Dialog, Grid, Typography } from "@material-ui/core";
import Details from "./components/Details/Details";
import Main from "./components/Main/Main";
import Auth from "./components/Auth/Auth";
import useStyles from "./styles";
import { Provider } from "./context/context";
import BudgetTracker from "./components/BudgetTracker/BudgetTracker";
import FinancialInsights from "./components/FinancialInsights/FinancialInsights";
import DailyChallenge from "./components/FinancialChallenge/FinancialChallenge";
import TransactionsTable from "./components/TransactionsTable/TransactionsTable";
import { Close as CloseIcon } from "@material-ui/icons";
import { red, green } from "@material-ui/core/colors";

const App = () => {
  const classes = useStyles();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);
  const [isIncomeDetailsOpen, setIsIncomeDetailsOpen] = useState(false);
  const [isExpenseDetailsOpen, setIsExpenseDetailsOpen] = useState(false);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleOpenDailyChallenge = () => {
    setIsDailyChallengeOpen(true);
  };

  const handleCloseDailyChallenge = () => {
    setIsDailyChallengeOpen(false);
  };

  const handleOpenIncomeDetails = () => {
    setIsIncomeDetailsOpen(true);
  };

  const handleCloseIncomeDetails = () => {
    setIsIncomeDetailsOpen(false);
  };

  const handleOpenExpenseDetails = () => {
    setIsExpenseDetailsOpen(true);
  };

  const handleCloseExpenseDetails = () => {
    setIsExpenseDetailsOpen(false);
  };

  if (!user) return <Auth onAuthSuccess={handleAuthSuccess} />;

  return (
    <Provider>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDailyChallenge}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          backgroundColor: "#3a5a40",
          color: "#fff",
          textTransform: "none",
          border: "none",
          borderRadius: "8px",
          padding: "8px 15px",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          fontFamily: "Merriweather",
        }}
      >
        Savings Challenges
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
          <Grid item xs={12} sm={3} className={classes.mobile}>
            <Button
              variant="contained"
              onClick={handleOpenIncomeDetails}
              style={{
                backgroundColor: green[500],
                color: "white",
                width: "50%",
                padding: "15px",
                fontSize: "18px",
                fontWeight: "bold",
                marginLeft: "15%",
                fontFamily: "Merriweather",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#264653",
                  transform: "scale(1.05)",
                },
              }}
            >
              View Income Details
            </Button>
          </Grid>

          <Grid item xs={1} sm={5} className={classes.main}>
            <Main onLogout={handleLogout} />
          </Grid>

          <Grid item xs={12} sm={3} className={classes.desktop}>
            <Button
              variant="contained"
              onClick={handleOpenIncomeDetails}
              style={{
                backgroundColor: green[500],
                color: "white",
                width: "50%",
                padding: "15px",
                fontSize: "18px",
                fontWeight: "bold",
                marginLeft: "15%",
                fontFamily: "Merriweather",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#264653",
                  transform: "scale(1.05)",
                },
              }}
            >
              View Income Details
            </Button>
          </Grid>

          <Grid item xs={12} sm={3} className={classes.last}>
            <Button
              variant="contained"
              onClick={handleOpenExpenseDetails}
              style={{
                backgroundColor: red[500],
                color: "white",
                width: "50%",
                padding: "15px",
                fontSize: "18px",
                fontWeight: "bold",
                fontFamily: "Merriweather",
                borderRadius: "12px",
                marginLeft: "35%",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#d62828",
                  transform: "scale(1.05)",
                },
              }}
            >
              View Expense Details
            </Button>
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

          {/* Income Details Dialog */}
          <Dialog
            open={isIncomeDetailsOpen}
            onClose={handleCloseIncomeDetails}
            maxWidth="md"
            fullWidth
          >
            <div
              style={{
                padding: "20px",
                position: "relative",
                backgroundColor: "#f1f1f1",
              }}
            >
              <Button
                onClick={handleCloseIncomeDetails}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  minWidth: "auto",
                  color: "#333",
                }}
              >
                <CloseIcon />
              </Button>
              <Typography
                variant="h4"
                style={{
                  marginBottom: "20px",
                  color: "#2a9d8f",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontFamily: "Merriweather",
                }}
              >
                Income
              </Typography>
              <Details title="Income" />
            </div>
          </Dialog>

          {/* Expense Details Dialog */}
          <Dialog
            open={isExpenseDetailsOpen}
            onClose={handleCloseExpenseDetails}
            maxWidth="md"
            fullWidth
          >
            <div
              style={{
                padding: "20px",
                position: "relative",
                backgroundColor: "#f1f1f1",
              }}
            >
              <Button
                onClick={handleCloseExpenseDetails}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  minWidth: "auto",
                  color: "#333",
                }}
              >
                <CloseIcon />
              </Button>
              <Typography
                variant="h4"
                style={{
                  marginBottom: "20px",
                  color: "#e76f51",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontFamily: "Merriweather",
                }}
              >
                Expense
              </Typography>
              <Details title="Expense" />
            </div>
          </Dialog>

          {/* Daily Challenge Dialog */}
          <Dialog
            open={isDailyChallengeOpen}
            onClose={handleCloseDailyChallenge}
            maxWidth="md"
            fullWidth
          >
            <DailyChallenge onClose={handleCloseDailyChallenge} />
          </Dialog>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              position: "fixed",
              bottom: "10px",
              left: "10px",
              backgroundColor: "#3a5a40",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "8px 15px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              fontFamily: "Merriweather",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#432818";
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 6px 10px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#3a5a40";
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            }}
          >
            Log out
          </button>
        </Grid>
      </div>
    </Provider>
  );
};

export default App;
