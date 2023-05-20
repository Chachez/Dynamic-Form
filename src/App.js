import { useEffect, useState } from "react";
import {
  Paper,
  TextField,
  Grid,
  Fab,
  Typography,
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
  });

  const addInputField = () => {
    setInputField([
      ...inputField,
      { account: "", debit: "", credit: "", status: "" },
    ]);
  };

  const removeInputField = (index) => {
    const list = [...inputField];
    list.splice(index, 1);
    setInputField(list);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputField];
    list[index][name] = value;
    setInputField(list);
  };

  // Returns array of debits
  const debitData = inputField;

  // This returns the debits array
  let debits = debitData
    .filter((field) => field.status == "debit")
    .map((account) => parseInt(account.debit));

  // We then sum the total in the array mapped
  const debitSum = sumArray(debits);

  // Returns array of credits
  const creditData = inputField;

  // This returns the debits array
  let credits = creditData
    .filter((field) => field.status == "credit")
    .map((account) => parseInt(account.credit));

  // We then sum the total in the array mapped
  const creditSum = sumArray(credits);

  useEffect(() => {
    debitSum !== creditSum
      ? setValues((state) => {
          state.isValid = false;
          return { ...state };
        })
      : setValues((state) => {
          state.isValid = true;
          return { ...state };
        });
  }, [values.isValid, inputField]);

  return (
    <RootComponent>
      <PaperComponent>
        <Typography variant="h6" gutterBottom>
          Create New Journal
        </Typography>
        <form>
          <Table>
            <TableHead>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    top: 57,
                    minWidth: column.minWidth,
                    textAlign: "center",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableHead>
            <TableBody>
              {inputField.map((field, idx) => {
                return (
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
                            const newState = [...prevState]; // Create a copy of the state array
                            newState[idx].status =
                              field.debit !== "" ? "debit" : ""; // Update the value of the 'status' key based on the condition
                            return newState; // Return the updated state array
                          });
                        }}
                        margin="normal"
                        name="debit"
                        value={field.debit || ""}
                        disabled={field.credit != ""}
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
                            const newState = [...prevState]; // Create a copy of the state array
                            newState[idx].status =
                              field.credit !== "" ? "credit" : ""; // Update the value of the 'status' key based on the condition
                            return newState; // Return the updated state array
                          });
                        }}
                        margin="normal"
                        name="credit"
                        value={field.credit || ""}
                        disabled={field.debit != ""}
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
                );
              })}
            </TableBody>
          </Table>
        </form>
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
