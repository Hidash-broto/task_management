import { Alert, Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import style from '../style'
import { Formik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function AddTask() {
    const [image, setImage]: any = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const navigate = useNavigate()

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
    };

    const handleImage = (e: any) => {
        setImage(e.target.files[0])
    }

    const formInitialValue = {
        heading: '',
        description: '',
        priority: 'Low'
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
            formData.append('image', image);

            const response = await axios.post('http://localhost:5001/addTask', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.status) {
                toast.success(response.data.message)
                navigate('/')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went Wrong')
        }
    };

    return (
        <>
            <Grid sx={style.addMainContainer} container>
                <Grid sx={style.addFormContainer} item container>
                    <Formik
                        initialValues={formInitialValue}
                        onSubmit={handleSubmit}
                        validationSchema={validation}
                    >{({ handleSubmit, handleChange, errors, touched, values }) => (
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
                </Grid>
            </Grid>
        </>
    )
}

export default AddTask
