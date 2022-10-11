import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const ExpressionTable = React.memo((props) => {
  const expressions = React.createRef(props.expressions);
  expressions.current = props.expressions;
  React.useEffect(() => {
    if (props.save) {
      props.handleVariableUpdate(expressions.current);
    }
  });

  const handleVariableRhsUpdate = (index) => (rhs) => {
    expressions.current[index] = {
      ...expressions.current[index],
      rhs,
    };
  };

  const handleVariableLhsUpdate = (index) => (lhs) => {
    let val = parseFloat(lhs)
    console.log(lhs, val, "lhs")
    if (lhs[lhs.length - 1] !== "." && !isNaN(val)) {
      expressions.current[index] = {
        ...expressions.current[index],
        lhs: val,
      };
    } else {
      expressions.current[index] = {
        ...expressions.current[index],
        lhs,
      };
    }
    
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Variable Name</TableCell>
            <TableCell align="right">Timeseries id / value</TableCell>
            <TableCell align="right">Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!props.save
            ? expressions.current.map((row, index) => (
                <TableRow
                  key={row.rhs}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="right">
                    {
                      <Inputvariable
                        key={index}
                        name={row.rhs}
                        handleVariableRhsUpdate={handleVariableRhsUpdate(index)}
                      ></Inputvariable>
                    }
                  </TableCell>
                  <TableCell align="right">
                    {
                      <Inputvariable
                        key={index}
                        name={row.lhs}
                        handleVariableRhsUpdate={handleVariableLhsUpdate(index)}
                      ></Inputvariable>
                    }
                  </TableCell>
                  <TableCell align="right">
                    {
                      <Button
                        onClick={() => {
                          props.handleDeleteRowVariable(index);
                        }}
                      >
                        Delete
                      </Button>
                    }
                  </TableCell>
                </TableRow>
              ))
            : expressions.current.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="right">{row.rhs}</TableCell>
                  <TableCell align="right">{row.lhs}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

const Inputvariable = React.memo((props) => {
  const [variablename, setVariablename] = React.useState(props.name);
  return (
    <input
      value={variablename}
      onChange={(event) => {
        setVariablename(event.target.value);
        props.handleVariableRhsUpdate(event.target.value);
      }}
    ></input>
  );
});

export default function EditRuleDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [save, setSave] = React.useState(false);
  const [name, setName] = React.useState(props.data.name);
  const [expression, setExpression] = React.useState(props.data.expression);
  const [expressions, setExpressions] = React.useState(props.data.expressions);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSave = (save) => {
    if (save) {
      props.handleUpdatetableRow({
        expressions,
        expression,
        name,
        id: props.data.id,
        show: props.data.show,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSave(false);
  };

  const handleVariableUpdate = (expressions) => {
    setExpressions(expressions);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleExpressionChange = (event) => {
    setExpression(event.target.value);
  };

  const handleAddVariable = () => {
    if (!save) {
      setExpressions((state) => [
        ...state,
        {
          lhs: "",
          rhs: "",
        },
      ]);
    } else {
      alert("Please press Undo button to edit again");
    }
  };

  const handleDeleteVariable = (index) => {
    setExpressions((state) => {
      return state.filter((ele, ind) => ind !== index);
    });
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        {props.name}
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={() => handleClose(false)}
      >
        <DialogTitle>
          {typeof props.title == "undefined"
            ? "Edit Rule " + props.data.id
            : props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>BLALABLA</DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <DialogContentText>Update Name & Expression</DialogContentText>
            <TextField
              id="edit-name"
              label="New Name"
              variant="outlined"
              inputprops={{ readOnly: save }}
              value={name}
              onChange={handleNameChange}
            />
            {"Expression"}
            <TextareaAutosize
              id="edit-expression"
              label="New Expression"
              variant="outlined"
              minRows={3}
              value={expression}
              onChange={handleExpressionChange}
            />
            <DialogContentText>
              Update Variables{" "}
              <Button onClick={() => handleAddVariable()}>Add variables</Button>
            </DialogContentText>

            <ExpressionTable
              save={save}
              expressions={expressions}
              handleVariableUpdate={handleVariableUpdate}
              handleDeleteRowVariable={(index) => {
                // props.handleDeleteRowVariable(index);
                handleDeleteVariable(index);
              }}
            ></ExpressionTable>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setSave((save) => {
                handleSave(true);
                return !save;
              })
            }
          >
            {!save ? "Save" : "Undo"}
          </Button>
          <Button
            onClick={() => {
              handleClose();
              setSave(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
