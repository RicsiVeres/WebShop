import { Container, Paper, Typography } from '@mui/material'
import React from 'react'
import { LightPurpleButton } from '../../../utils/buttonStyles'
import { KeyboardDoubleArrowLeft } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const CheckoutAftermath = () => {
    const navigate = useNavigate()

    return (
        <React.Fragment>
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <React.Fragment>
                        <Typography variant="h5" gutterBottom>
                            Köszönjük a rendelésed!
                        </Typography>
                        <Typography variant="subtitle1">
                            A rendelésed sikeresen létrehozva!
                        </Typography>
                        <LightPurpleButton sx={{ mt: 10 }} onClick={() => {
                            navigate("/")
                        }}>
                            <KeyboardDoubleArrowLeft /> Vissza a főoldalra
                        </LightPurpleButton>
                    </React.Fragment>
                </Paper>
            </Container>
        </React.Fragment>
    )
}

export default CheckoutAftermath