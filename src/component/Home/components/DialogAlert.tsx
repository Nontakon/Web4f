import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DialogAlert = () => {

    const [openalert, setOpenalert] = React.useState(true);

    const handlekOpen = () => {
        setOpenalert(true);
    };

    const handleClosealert = () => {
        setOpenalert(false);
    };
    return (
        <div>
            <div>
                <Dialog
                    open={openalert}
                    onClose={handleClosealert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Let Google help apps determine location. This means sending anonymous location data to
                            Google, even when no apps are running.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosealert} color="primary">
                            Disagree
                        </Button>
                        <Button onClick={handleClosealert} color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default DialogAlert
