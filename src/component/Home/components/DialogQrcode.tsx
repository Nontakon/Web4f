import React from 'react'
import QRCode from "qrcode.react";
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';

interface Props {
    KKS : string;
}

const DialogQrcode: React.FC<Props> = ({KKS}) => {

    const [open, setOpen] = React.useState(false);
    function remove_firstkks(element: String) {
        return element.substr(2, element.length)
    }
    
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div>
            <Dialog
                // fullWidth
                // maxWidth={"xs"}
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                
                <DialogContent>
                    <QRCode value={remove_firstkks(KKS)} size={250} />
                </DialogContent>
            </Dialog>
            
            <QRCode value={remove_firstkks(KKS)} size={90} onClick={handleClickOpen} />
        </div>
    )
}

export default  DialogQrcode
