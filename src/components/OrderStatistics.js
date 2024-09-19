import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Grid, Card, CardContent, CircularProgress, Alert, Box } from '@mui/material';
import { styled } from '@mui/system';
import * as XLSX from 'xlsx';

const getStatusDescription = (status) => {
    switch (status) {
        case "1":
            return 'Не обработано';
        case "2":
            return 'Принято';
        case "3":
            return 'Выполнено';
        default:
            return 'Неизвестный статус';
    }
};

const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

const StyledButton = styled(Button)({
    borderRadius: '20px',
    margin: '5px',
});

const OrderStatistics = () => {
    const today = new Date();
    const [statistics, setStatistics] = useState(null);
    const [startDate, setStartDate] = useState(formatDate(today));
    const [endDate, setEndDate] = useState(formatDate(today));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStatistics = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('jwtToken');

        try {
            const response = await axios.get(`/api/orders/statistics?startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    Pragma: 'no-cache',
                    Expires: '0'
                }
            });

            setStatistics(response.data);
        } catch (e) {
            setError(e.message);
        }

        setLoading(false);
    };

    const exportToExcel = () => {
        if (!statistics || !statistics.orders || statistics.orders.length === 0) return;

        const ordersForExport = statistics.orders.map(order => ({
            'Заказ №': order.id,
            'Имя': `${order.firstName} ${order.lastName}`,
            'Телефон': order.phoneNumber,
            'Адрес': order.address,
            'Продукты': order.products.map(p => `${p.name} (Кол-во: ${p.quantity})`).join(', '),
            'Доставка': order.deliveryMethod,
            'Оплата': order.paymentMethod,
            'Статус': getStatusDescription(order.status),
            'Общая стоимость': order.totalCost,
            'Дата заказа': new Date(order.createdAt).toLocaleDateString()
        }));

        const worksheet = XLSX.utils.json_to_sheet(ordersForExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
        XLSX.writeFile(workbook, `orders_${formatDate(new Date())}.xlsx`);
    };

    const setToday = () => {
        const today = new Date();
        setStartDate(formatDate(today));
        setEndDate(formatDate(today));
    };

    const setLastWeek = () => {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        setStartDate(formatDate(lastWeek));
        setEndDate(formatDate(today));
    };

    const setLastMonth = () => {
        const today = new Date();
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        setStartDate(formatDate(lastMonth));
        setEndDate(formatDate(today));
    };

    useEffect(() => {
        fetchStatistics();
    }, [startDate, endDate]);

    return (
        <Container maxWidth="lg">

            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Начальная дата"
                        type="date"
                        fullWidth
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        sx={{ borderRadius: '10px' }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Конечная дата"
                        type="date"
                        fullWidth
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        sx={{ borderRadius: '10px' }}
                    />
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <StyledButton variant="contained" color="primary" onClick={fetchStatistics}>
                    Обновить статистику
                </StyledButton>
                <StyledButton variant="outlined" color="primary" onClick={setToday}>
                    За сегодня
                </StyledButton>
                <StyledButton variant="outlined" color="primary" onClick={setLastWeek}>
                    За последнюю неделю
                </StyledButton>
                <StyledButton variant="outlined" color="primary" onClick={setLastMonth}>
                    За последний месяц
                </StyledButton>
                <StyledButton variant="contained" color="secondary" onClick={exportToExcel}>
                    Экспорт в XLSX
                </StyledButton>
            </Box>
            {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
            {error && <Alert severity="error">Ошибка: {error}</Alert>}
            {statistics && (
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    {statistics.orders && statistics.orders.length > 0 ? (
                        statistics.orders.map((order, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ borderRadius: '20px' }}>
                                    <CardContent>
                                        <Typography variant="h6">Заказ №{order.id}</Typography>
                                        <Typography>Имя: {order.firstName} {order.lastName}</Typography>
                                        <Typography>Телефон: {order.phoneNumber}</Typography>
                                        <Typography>Адрес: {order.address}</Typography>
                                        <Typography>Продукты:</Typography>
                                        <br/><br/>

                                        <ul>
                                            {order.products.map((product, idx) => (
                                                <li key={idx}>
                                                    <i>{product.name}</i> - Количество: {product.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                        <br/><br/>
                                        <Typography>Доставка: {order.deliveryMethod}</Typography>
                                        <Typography>Оплата: {order.paymentMethod}</Typography>
                                        <Typography>Статус: {getStatusDescription(order.status)}</Typography>
                                        <Typography>Общая стоимость: {order.totalCost} тг.</Typography>
                                        <Typography>Дата заказа: {new Date(order.createdAt).toLocaleDateString()}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography>Заказы не найдены за указанный период.</Typography>
                    )}
                </Grid>
            )}
        </Container>
    );
};

export default OrderStatistics;
