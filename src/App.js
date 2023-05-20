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
  { id: "balance", label: "Balance", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 100 },
];

const App = () => {
  const [inputField, setInputField] = useState([
    { account: "", debit: "", credit: "", status: "" },
  ]);

  const [values, setValues] = useState({
    isValid: false,
    alertMessage: "",
    showAlert: false,
  });
  const addInputField = () => {
    const lastField = inputField[inputField.length - 1];
    if (
      lastField.account !== "" &&
      (lastField.debit !== "" || lastField.credit !== "")
    ) {
      setInputField([
        ...inputField,
        { account: "", debit: "", credit: "", status: "" },
      ]);
    } else {
      let alertMessage = "";
      if (lastField.account === "") {
        alertMessage = "Please select an Account.";
      } else if (lastField.debit === "" && lastField.credit === "") {
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
    setInputField(list);
  };

  const debitData = inputField;
  const debits = debitData
    .filter((field) => field.status === "debit")
    .map((account) => parseInt(account.debit));
  const debitSum = sumArray(debits);

  const creditData = inputField;
  const credits = creditData
    .filter((field) => field.status === "credit")
    .map((account) => parseInt(account.credit));
  const creditSum = sumArray(credits);

  useEffect(() => {
    setValues((prevState) => ({
      ...prevState,
      isValid: debitSum === creditSum,
    }));
    if (values.showAlert) {
      const timer = setTimeout(() => {
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
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {inputField.map((field, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Select
                        fullWidth
                        name="account"
                        value={field.account || ""}
                        onChange={(e) => handleInputChange(e, idx)}
                      >
                        {accounts?.map((acc, index) => (
                          <MenuItem key={index} value={acc.name}>
                            {acc.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => {
                          handleInputChange(e, idx);
                          setInputField((prevState) => {
                            const newState = [...prevState];
                            newState[idx].status =
                              field.debit !== "" ? "debit" : "";
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
                          handleInputChange(e, idx);
                          setInputField((prevState) => {
                            const newState = [...prevState];
                            newState[idx].status =
                              field.credit !== "" ? "credit" : "";
                            return newState;
                          });
                        }}
                        margin="normal"
                        name="credit"
                        value={field.credit || ""}
                        disabled={field.debit !== ""}
                      />
                    </TableCell>
                    <TableCell align="right">12,540.00</TableCell>
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

        {!values.isValid && (
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
