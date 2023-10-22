const express = require('express');
const path = require('path');
const app = express();

// Укажите путь к собранным файлам
app.use(express.static(path.join(__dirname, 'build')));

// Обслуживайте index.html для всех оставшихся маршрутов, чтобы поддерживать клиентский роутинг
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
