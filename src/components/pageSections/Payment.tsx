import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, Box, Container } from '@mui/material';
import CustomButton from '../formElements/Button';
import axios from 'axios';

interface IOrder {
    _id: number;
    farmerName: string;
    landSize: string;
    fertilizer: string;
    seeds: string;
    paid: boolean;
    status: string;
    fertilizerQuantity: number;
    seedsQuantity: number;
    amountToBePaid: number;
}

const FarmerDetails = () => {
    const [order, setOrder] = useState<IOrder | null>(null);
    const [payedFlag, setPayedFlag] = useState(false);

    const handlePayment = async (orderId: number) => {
        await axios({
            method: 'PUT',
            url: `http://localhost:3002/api/v1/pay/${orderId}`
        })
            .then(function (res) {
                console.log(res)
                alert('You have successfully paid wait for your order to be approved')
                setPayedFlag(true);
            })
            .catch(function (error) {
                alert("error occured")
                console.log(error)
            });
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                let userId = localStorage.getItem("farmerId")
                const response = await axios.get(`http://localhost:3002/api/v1/orders/${userId}`);
                setOrder(response.data.data);
                console.log(response)
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom sx={{ textAlign: "center" }}>
                        Farmer Details
                    </Typography>
                    {order ? (
                        <Box sx={{ width: "30rem", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "column" }}>
                            <Box >
                                <Typography variant="subtitle1">
                                    Farmer Name: {order.farmerName}
                                </Typography>
                            </Box>
                            <Box >
                                <Typography variant="subtitle1">
                                    Land Size: {order.landSize} per acre
                                </Typography>
                            </Box>
                            <Box >
                                <Typography variant="subtitle1">
                                    Fertilizer: {order.fertilizer}
                                </Typography>
                            </Box>
                            <Box >
                                <Typography variant="subtitle1">
                                    Fertilizer Quantity: {order.fertilizerQuantity} kgs
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle1">
                                    Seeds: {order.seeds}
                                </Typography>
                            </Box>
                            <Box >
                                <Typography variant="subtitle1">
                                    Seeds Quantity: {order.seedsQuantity} kgs
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle1">
                                    Amount to be Paid: {order.amountToBePaid} $
                                </Typography>
                            </Box>
                            <Box>
                                {
                                    !payedFlag ?
                                        <Button onClick={() => handlePayment(order._id)} variant="contained" color="success" size="small">
                                            Pay Order
                                        </Button> :
                                        <Button variant="contained" color="success" size="small" disabled>
                                            Payed
                                        </Button>
                                }
                            </Box>
                        </Box>
                    ) : (
                        <Typography variant="body1" align="center">
                            {order === null ? 'No order found' : 'Loading...'}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Container >
    );
};

export default FarmerDetails;
