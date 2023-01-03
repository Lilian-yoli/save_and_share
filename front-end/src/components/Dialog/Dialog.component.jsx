import Button from "../Button/Button.component";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

export default function SSDialog({ content, open, action, cancel, buttonText }) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={action}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClickHandler={cancel} text={buttonText?.negative} />
          <Button
            onClickHandler={action}
            autoFocus
            text={buttonText?.positive}
            variant="outlined"
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}
