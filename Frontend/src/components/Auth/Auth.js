import React, { useState } from "react";
import {
  Container,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Snackbar,
  makeStyles,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#001523",
    padding: theme.spacing(2),
  },
  mainTitle: {
    color: "#ffffff",
    fontSize: "3.5rem",
    fontFamily: "Merriweather",
    fontWeight: 500,
    textAlign: "center",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6),
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    animation: "$fadeIn 1s ease-in",
    "& span": {
      display: "block",
      fontSize: "2.5rem",
      opacity: 0.9,
      marginTop: theme.spacing(1),
    },
  },
  "@keyframes fadeIn": {
    from: {
      opacity: 0,
      transform: "translateY(-20px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  paper: {
    width: "100%",
    maxWidth: 500,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(5),
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  },
  title: {
    marginBottom: theme.spacing(4),
    color: "#333",
    fontWeight: 550,
    fontSize: "2rem",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#ddd",
        transition: "border-color 0.3s ease",
      },
      "&:hover fieldset": {
        borderColor: "#667eea",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#764ba2",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#666",
    },
    marginBottom: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1.5),
    background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
    color: "white",
    fontWeight: 600,
    fontSize: "1.1rem",
    borderRadius: 8,
    boxShadow: "0 3px 15px rgba(102, 126, 234, 0.25)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(45deg, #764ba2 30%, #667eea 90%)",
      transform: "scale(1.02)",
      boxShadow: "0 5px 20px rgba(102, 126, 234, 0.35)",
    },
  },
  switchButton: {
    color: "#667eea",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(102, 126, 234, 0.1)",
      color: "#764ba2",
    },
  },
  gridContainer: {
    marginBottom: theme.spacing(2),
  },
}));

const Auth = ({ onAuthSuccess }) => {
  const classes = useStyles();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", 
  });
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BASE_URL}/api/${isSignup ? "signup" : "login"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onAuthSuccess(data.user);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={classes.root}>
      <Typography component="h1" className={classes.mainTitle}>
        Voice Powered
        <span>Expense Tracker</span>
      </Typography>

      <Container component="main" maxWidth="sm">
        <Paper className={classes.paper} elevation={3}>
          <Typography
            component="h2"
            variant="h4"
            className={classes.title}
            style={{ fontFamily: "Merriweather, serif" }}
          >
            {isSignup ? "Create Account" : "Sign In!"}
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2} className={classes.gridContainer}>
              {isSignup && (
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    label="Full Name"
                    name="name"
                    className={classes.textField}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  className={classes.textField}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  className={classes.textField}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </Button>

            <Button
              fullWidth
              className={classes.switchButton}
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Button>
          </form>
        </Paper>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="error"
            onClose={() => setError("")}
          >
            {error}
          </MuiAlert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default Auth;
