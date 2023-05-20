import { useEffect, useState } from "react";
import {
  Paper,
  TextField,
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
  Alert,
  AlertTitle,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";

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

const MuiTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "400px" /* Set the desired height here */,
  overflowY: "scroll" /* Enable vertical scrolling if needed */,
  position: "relative",
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
        alertMessage = "Select an Account to proceed.";
      } else if (!lastField.debit && !lastField.credit) {
        alertMessage =
          "Ensure amounts are in numerical format for either Debit or Credit fields and are not empty to proceed.";
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
  console.log(inputField);

  return (
    <RootComponent>
      <PaperComponent>
        <Typography variant="h6" gutterBottom>
          Create New Journal
        </Typography>
        <Formik
          initialValues={{
            description: "",
            accounts: [],
          }}
          validationSchema={Yup.object().shape({
            description: Yup.string().required("Give a description to proceed"),
          })}
          onSubmit={(values, { resetForm }) => {
            resetForm();
            setInputField([{ account: "", debit: "", credit: "", status: "" }]);
            console.log("values", values);
          }}
        >
          {({ errors, touched, resetForm }) => (
            <Form>
              <MuiTableContainer>
                <Table style={{ position: "relative" }}>
                  <TableHead>
                    <TableRow style={{ position: "sticky", top: 0, zIndex: 1 }}>
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
                            inputProps={{
                              type: "number",
                              pattern: "[0-9]*", // Only allow numeric input
                              min: 0,
                            }}
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
                            inputProps={{
                              type: "number",
                              pattern: "[0-9]*", // Only allow numeric input
                              min: 0,
                            }}
                          />
                        </TableCell>

                        <TableCell align="right" />
                        <TableCell>
                          {inputField.length !== 1 && (
                            <Tooltip title="Delete Record">
                              <Fab
                                color="primary"
                                aria-label="add"
                                onClick={() => removeInputField(idx)}
                                style={{ marginTop: "1rem" }}
                              >
                                <DeleteIcon />
                              </Fab>
                            </Tooltip>
                          )}
                          {inputField.length - 1 === idx && (
                            <Tooltip title="Add New Record">
                              <Fab
                                color="primary"
                                aria-label="add"
                                onClick={addInputField}
                                style={{
                                  marginTop: "1rem",
                                  marginLeft: "3rem",
                                }}
                              >
                                <AddIcon />
                              </Fab>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter
                    style={{ position: "sticky", bottom: 0, zIndex: 1 }}
                  >
                    {" "}
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          Difference: {debitSum - creditSum}
                        </Typography>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </MuiTableContainer>
              {/* Alerts */}
              {values.showAlert && (
                <Alert
                  severity="warning"
                  style={{ margin: "1rem" }}
                  onClose={() =>
                    setValues((prevState) => ({
                      ...prevState,
                      showAlert: false,
                    }))
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

              <Field
                as={TextField}
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                margin="normal"
                label="Description"
                name="description"
                helperText={<ErrorMessage name="description" />}
                error={Boolean(touched.description && errors.description)}
              />

              <DialogActions>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={(e) => {
                    resetForm(e);
                    setInputField([
                      { account: "", debit: "", credit: "", status: "" },
                    ]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={
                    debitSum !== creditSum ||
                    (debitSum === 0 && creditSum === 0)
                  }
                >
                  Save & Publish
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </PaperComponent>
    </RootComponent>
  );
};

export default App;
