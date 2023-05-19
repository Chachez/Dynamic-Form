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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";

import "./App.css";

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
    { account: "", debit: null, credit: null },
  ]);

  const addInputField = () => {
    setInputField([...inputField, { account: "", debit: null, credit: null }]);
  };

  const removeInputField = (index) => {
    const list = [...inputField];
    list.splice(index, 1);
    setInputField(list);
    console.log(index);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputField];
    list[index][name] = value;
    setInputField(list);
  };

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
            {inputField.map((field, idx) => {
              return (
                <TableRow key="5">
                  <TableCell>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, idx)}
                      margin="normal"
                      name="account"
                      value={field.account || ""}
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, idx)}
                      margin="normal"
                      name="debit"
                      value={field.debit || ""}
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, idx)}
                      margin="normal"
                      name="credit"
                      value={field.credit || ""}
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
          </Table>
        </form>
      </PaperComponent>
    </RootComponent>
  );
};

export default App;
