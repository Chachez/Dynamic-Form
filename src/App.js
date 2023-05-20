import { useEffect, useState } from "react";
import {
  Paper,
  TextField,
  Grid,
  Fab,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  Autocomplete,
  Select,
  MenuItem,
  Alert,
  AlertTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";

import "./App.css";
import { accounts } from "./data";
import { sumArray } from "./utils/arraySum";
import { amountFormatter } from "./utils/currencyFormatter";

const RootComponent = styled("div")(({ theme }) => ({
  maxWidth: "100%",
  margin: "0 auto",
  padding: theme.spacing(3, 3, 6, 3),
}));

const PaperComponent = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(3),
  [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    padding: theme.spacing(3),
  },
  borderRadius: "10px",
  boxShadow: "0 10px 30px 0 rgba(172, 168, 168, 0.43)",
}));

const columns = [
  { id: "account", label: "Account", minWidth: 100 },
  { id: "debit", label: "Debit", minWidth: 100 },
  { id: "credit", label: "Credit", minWidth: 100 },
  { id: "balance", label: "", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 100 },
];

const App = () => {
  const [inputField, setInputField] = useState([
    { account: "", debit: "", credit: "", status: "" },
  ]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [values, setValues] = useState({
    isValid: false,
    alertMessage: "",
    showAlert: false,
  });

  const addInputField = () => {
    const lastField = inputField[inputField.length - 1];
    if (lastField.account && (lastField.debit || lastField.credit)) {
      setInputField([
        ...inputField,
        { account: "", debit: "", credit: "", status: "" },
      ]);
    } else {
      let alertMessage = "";
      if (!lastField.account) {
        alertMessage = "Please select an Account.";
      } else if (!lastField.debit && !lastField.credit) {
        alertMessage = "Please fill either Debit or Credit.";
      }
      setValues((prevState) => ({
        ...prevState,
        showAlert: true,
        alertMessage,
      }));
    }
  };

  const removeInputField = (index) => {
    const list = [...inputField];
    list.splice(index, 1);
    setInputField(list);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputField];
    list[index] = {
      ...list[index],
      [name]: value,
    };

    // Update the status based on debit and credit values
    const debit = list[index].debit || "";
    const credit = list[index].credit || "";

    // Clear the account field if the value is undefined
    if (name === "account" && value === undefined) {
      list[index].account = "";
    }

    list[index].status = debit !== "" ? "debit" : credit !== "" ? "credit" : "";

    setInputField(list);
  };

  const debitData = inputField;
  const debits = debitData
    .filter((field) => field.status === "debit" && field.debit !== "") // Filter out empty debit fields
    .map((account) => parseInt(account.debit));
  const debitSum = sumArray(debits);

  const creditData = inputField;
  const credits = creditData
    .filter((field) => field.status === "credit" && field.credit !== "") // Filter out empty credit fields
    .map((account) => parseInt(account.credit));
  const creditSum = sumArray(credits);

  useEffect(() => {
    setValues((prevState) => ({
      ...prevState,
      isValid: debitSum === creditSum,
    }));

    if (values.showAlert && debitSum === creditSum) {
      setAlertVisible(true);

      const timer = setTimeout(() => {
        setAlertVisible(false);
        setValues((prevState) => ({
          ...prevState,
          showAlert: false,
        }));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [debitSum, creditSum, values.showAlert]);

  return (
    <RootComponent>
      <PaperComponent>
        <Typography variant="h6" gutterBottom>
          Create New Journal
        </Typography>
        <form>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                      {column.id === "debit" && (
                        <Typography variant="body2">
                          Total Debits: {debitSum}
                        </Typography>
                      )}
                      {column.id === "credit" && (
                        <Typography variant="body2">
                          Total Credits: {creditSum}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {inputField.map((field, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Autocomplete
                        fullWidth
                        options={accounts}
                        getOptionLabel={(option) =>
                          option ? option.label : ""
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            margin="normal"
                            name="account"
                          />
                        )}
                        value={field.account || null}
                        onChange={(e, value) => {
                          handleInputChange(
                            { target: { name: "account", value } },
                            idx
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => {
                          const value = e.target.value;
                          handleInputChange(
                            {
                              target: {
                                name: "debit",
                                value: isNaN(value) ? "" : parseFloat(value),
                              },
                            },
                            idx
                          );
                          setInputField((prevState) => {
                            const newState = [...prevState];
                            newState[idx].status = value !== "" ? "debit" : "";
                            return newState;
                          });
                        }}
                        margin="normal"
                        name="debit"
                        value={field.debit || ""}
                        disabled={field.credit !== ""}
                      />
                    </TableCell>

                    <TableCell>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => {
                          const value = e.target.value;
                          handleInputChange(
                            {
                              target: {
                                name: "credit",
                                value: isNaN(value) ? "" : parseFloat(value),
                              },
                            },
                            idx
                          );
                          setInputField((prevState) => {
                            const newState = [...prevState];
                            newState[idx].status = value !== "" ? "credit" : "";
                            return newState;
                          });
                        }}
                        margin="normal"
                        name="credit"
                        value={field.credit || ""}
                        disabled={field.debit !== ""}
                      />
                    </TableCell>
                    <TableCell align="right" />
                    <TableCell>
                      {inputField.length !== 1 && (
                        <Fab
                          color="primary"
                          aria-label="add"
                          onClick={() => removeInputField(idx)}
                          style={{ marginTop: "1rem" }}
                        >
                          <DeleteIcon />
                        </Fab>
                      )}
                      {inputField.length - 1 === idx && (
                        <Fab
                          color="primary"
                          aria-label="add"
                          onClick={addInputField}
                          style={{ marginTop: "1rem", marginLeft: "3rem" }}
                        >
                          <AddIcon />
                        </Fab>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      Balance: {debitSum - creditSum}
                    </Typography>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </form>

        {/* Alerts */}

        {values.showAlert && (
          <Alert
            severity="warning"
            onClose={() =>
              setValues((prevState) => ({ ...prevState, showAlert: false }))
            }
          >
            <AlertTitle>Warning</AlertTitle>
            {values.alertMessage}
          </Alert>
        )}

        {!values.isValid && !alertVisible && (
          <Alert severity="warning" style={{ margin: "1rem" }}>
            <AlertTitle>Warning</AlertTitle>
            Please ensure that the Debits and Credits balance
          </Alert>
        )}
      </PaperComponent>
    </RootComponent>
  );
};

export default App;
