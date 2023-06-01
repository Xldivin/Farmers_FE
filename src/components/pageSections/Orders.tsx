import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Button, TablePagination, TableSortLabel } from '@mui/material';

interface IOrder {
    _id: number;
    farmerName: string;
    landSize: string;
    fertilizer: string;
    seeds: string;
    isPaid: boolean;
    status: string;
}

const OrdersListing = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [sortBy, setSortBy] = useState<keyof IOrder>('farmerName');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3002/api/v1/orders');
                setOrders(response.data.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    console.log(orders)

    const handleAccept = async (orderId: number) => {
        // Handle accept logic here
        console.log(`Accepted order with ID: ${orderId}`);

        await axios({
            method: 'PUT',
            url: `http://localhost:3002/api/v1/accept/${orderId}`
        })
        .then(function (res) {
                console.log(res)
                alert('The order have been accepted')
            })
        .catch(function (error) {
                alert("error occured")
                console.log(error)
            });
    };

    const handleReject = async (orderId: number) => {
        console.log(`Rejected order with ID: ${orderId}`);

        await axios({
            method: 'DELETE',
            url: `http://localhost:3002/api/v1/orders/${orderId}`
        })
        .then(function (res) {
                console.log(res)
                alert('The order have been rejected')
            })
        .catch(function (error) {
                alert("error occured")
                console.log(error)
            });

    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (property: keyof IOrder) => {
        const isAsc = sortBy === property && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortBy(property);
    };

    const sortedOrders = [...orders].sort((a, b) => {
        const isAsc = sortDirection === 'asc';
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return isAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        return isAsc ? (aValue as any) - (bValue as any) : (bValue as any) - (aValue as any);
    });

    const paginatedOrders = sortedOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={sortBy === 'farmerName'}
                                direction={sortDirection}
                                onClick={() => handleSort('farmerName')}
                            >
                                Farmer Name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={sortBy === 'landSize'}
                                direction={sortDirection}
                                onClick={() => handleSort('landSize')}
                            >
                                Land Size
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={sortBy === 'fertilizer'}
                                direction={sortDirection}
                                onClick={() => handleSort('fertilizer')}
                            >
                                Fertilizer
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel active={sortBy === 'seeds'} direction={sortDirection} onClick={() => handleSort('seeds')}>
                                Seeds
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel active={sortBy === 'isPaid'} direction={sortDirection} onClick={() => handleSort('isPaid')}>
                                Paid
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedOrders.length > 0 ? (
                        paginatedOrders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>{order.farmerName}</TableCell>
                                <TableCell>{order.landSize}</TableCell>
                                <TableCell>{order.fertilizer}</TableCell>
                                <TableCell>{order.seeds}</TableCell>
                                <TableCell>{order.isPaid ? 'Yes' : 'No'}</TableCell>
                                <TableCell sx={{ display: "flex" }}>
                                    {order.status === 'pending' ? (
                                        <>
                                            <Button variant="contained" color="success" size="small" onClick={() => handleAccept(order._id)}>
                                                Accept
                                            </Button>
                                            <Button variant="contained" color="error" size="small" sx={{ marginLeft: "5px" }} onClick={() => handleReject(order._id)}>
                                                Reject
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="contained" color="success" size="small" disabled>
                                                Accepted
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6}>No orders available</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5]}
                component="div"
                count={sortedOrders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
    );
};

export default OrdersListing;
