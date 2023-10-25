import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Stack } from '@mui/material';
import Style from '../style'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props: any) {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false)
    props.callBack(false)
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Stack sx={{alignItems: 'center'}} direction='column' spacing={2}>
            <Box sx={{...Style.ListPriorityBox, backgroundColor: 
                        props.datas.priority === 'Low' ? '#008000' : props.datas.priority === 'Medium' ? '#FFFF00' : '#FF0000'
                        }}>
                        <Typography>{props.datas.priority}</Typography>
                    </Box>
                    <Typography sx={{fontSize: '35px', fontWeight: 'bold'}}>{props.datas.heading}</Typography>
                    <img style={{width: '250px', height: '250px', borderRadius: '50%'}} src={`http://localhost:5001/getImage/${props.datas.image}`} alt='img' />
                    <Typography sx={{fontWeight: 'bold'}}>{props.datas.description}</Typography>
                    <Typography sx={{textShadow: '2px 1px 3px #db0700', fontSize: '25px'}}>{props.formatDateAndTime(props.datas.dateAndTime)}</Typography>
            </Stack>
        </Box>
      </Modal>
    </div>
  );
}
