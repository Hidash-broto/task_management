import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Formik } from 'formik';
import * as yup from 'yup'
import axios from 'axios';
import { Alert, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { toast } from 'react-hot-toast';

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
        setOpen(false);
        props.callBack(false)
    };
    const [image, setImage]: any = React.useState(null);
    const [selectedDate, setSelectedDate] = React.useState(new Date());


    const handleDateChange = (date: any) => {
        setSelectedDate(date);
    };

    const handleImage = (e: any) => {
        setImage(e.target.files[0])
    }

    const formInitialValue = {
        heading: props.editDatas.heading,
        description: props.editDatas.description,
        priority: props.editDatas.priority,
    }

    const validation = yup.object({
        heading: yup.string().required("Heading Required").max(15, "Heading charecter must less than 15"),
        description: yup.string().required("Description Required").min(3, 'Description should atlead 3+ characters'),
    })

    const handleSubmit = async (values: any) => {
        try {
            const formData = new FormData();
            formData.append('heading', values.heading);
            formData.append('description', values.description);
            formData.append('priority', values.priority);
            formData.append('dateAndTime', selectedDate.toISOString());
            if (image !== null) {
                let status: any = true
                formData.append('imageStatus', status)
                formData.append('image', image)
            }

            const response = await axios.post('http://localhost:5001/editTask', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.status) {
                toast.success(response.data.message)
                handleClose()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error('Something Went Wrong')
            console.error(error);
        }
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
                    <Formik
                        initialValues={formInitialValue}
                        onSubmit={handleSubmit}
                        validationSchema={validation}
                    >{({ handleSubmit, handleChange, errors, touched, values }: any) => (
                        <form style={{ width: '100%', height: '100%' }} onSubmit={handleSubmit}>
                            <Stack direction='column' spacing={2} sx={{ width: '100%', height: '100%' }}>
                                <Typography sx={{ fontSize: '30px', ml: '110px !important' }}>Create new Task</Typography>
                                {
                                    errors.heading && touched.heading ? <Alert severity='error'>{errors.heading}</Alert> :
                                        errors.description && touched.description ? <Alert severity='error'>{errors.description}</Alert> : ''
                                }
                                <TextField onChange={handleChange} name='heading' value={values.heading} id="outlined-basic" label="Heading" variant="outlined" />
                                <TextField onChange={handleChange} name='description' value={values.description} id="outlined-basic" label="Description" variant="outlined" />
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={values.priority}
                                        label="Age"
                                        onChange={handleChange}
                                        name='priority'
                                    >
                                        <MenuItem value='High'>High</MenuItem>
                                        <MenuItem value='Medium'>Medium</MenuItem>
                                        <MenuItem value='Low'>Low</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    id="date"
                                    label="Date"
                                    type="date"
                                    required
                                    value={selectedDate.toISOString().split('T')[0]}
                                    onChange={(e) => handleDateChange(new Date(e.target.value))}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    id="time"
                                    label="Time"
                                    type="time"
                                    required
                                    value={selectedDate.toISOString().split('T')[1].slice(0, 5)}
                                    onChange={(e) => handleDateChange(new Date(`${selectedDate.toISOString().split('T')[0]}T${e.target.value}:00`))}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    component="label"
                                >
                                    {image === null ? 'Upload Image' : image.name}
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleImage}
                                        accept="image/*"
                                    />
                                </Button>
                                <Button type='submit' variant='contained'>Create</Button>
                            </Stack>

                        </form>
                    )}
                    </Formik>
                </Box>
            </Modal>
        </div>
    );
}
