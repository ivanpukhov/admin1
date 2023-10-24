import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from "styled-components";

const Container = styled.div`
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.h1`
  color: #333;
  margin-bottom: 1rem;
`;

const FilterSection = styled.div`
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  flex-direction: column;
  align-items: flex-start;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const Label = styled.label`
  margin: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  margin: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: #0CE3CB;
  color: #515151;
  border: none;
  font-weight: 600;
  width: 100%;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Card = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0.5rem;
  flex: 1;
  text-align: center;
  width: 100%;
`;

const StatisticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;


// Функция для конвертации числового статуса в строку
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



// Функция для форматирования даты
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

const OrderStatistics = () => {
    // Устанавливаем сегодняшнюю дату как дату по умолчанию
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
        <Container>
            <Header>Статистика по заказам</Header>
            <FilterSection>
                <Label>Начальная дата:</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <Label>Конечная дата:</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <Button onClick={fetchStatistics}>Обновить статистику</Button>
                <Button onClick={setToday}>За сегодня</Button>
                <Button onClick={setLastWeek}>За последнюю неделю</Button>
                <Button onClick={setLastMonth}>За последний месяц</Button>
            </FilterSection>
            {loading && <h2>Загрузка...</h2>}
            {error && <h2>Ошибка: {error}</h2>}
            {statistics && (
                <StatisticsContainer>
                    <Card>
                        <h2>Общее количество заказов</h2>
                        <h2>{statistics.totalOrders}</h2>
                    </Card>
                    <Card>
                        <h2>Выручка</h2>
                        <h2>{statistics.revenue} тг.</h2>
                    </Card>
                    <Card>
                        <h2>Средний чек</h2>
                        <h2>{parseFloat(statistics.averageCheck).toFixed(0)} тг.</h2>
                    </Card>
                    <Card>
                        <h2>Статусы заказов</h2>
                        <ul>
                            {Array.isArray(statistics.statusCounts) ?
                                statistics.statusCounts.map((item, index) => (
                                    <li key={index}>{getStatusDescription(item.status)}: {item.count}</li>
                                )) :
                                Object.entries(statistics.statusCounts || {}).map(([status, count]) => (
                                    <li key={status}>{getStatusDescription(parseInt(status))}: {count}</li>
                                ))
                            }
                        </ul>
                    </Card>
                </StatisticsContainer>
            )}
        </Container>
    );
};


export default OrderStatistics;
