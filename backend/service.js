const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const app = express();
const prisma = new PrismaClient();
const cors = require('cors');
const bodyParser = require('body-parser'); // Import body-parser jika belum ada
const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); 

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        // Kembalikan token, name, dan email
        res.json({ token, name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

//GET, POST, & DELETE
app.get('/api/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.post('/api/users', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.delete({
            where: { id: parseInt(id) },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/api/todolist', async (req, res) => {
    try {
        const todos = await prisma.todo.findMany(); // Pastikan model Todo sudah dibuat di schema Prisma
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.post('/api/todolist', async (req, res) => {
    const { title, description } = req.body;
    try {
        const todo = await prisma.todo.create({
            data: {
                title,
                description,
            },
        });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Update a todo
app.put('/api/todolist/:id', async (req, res) => {
    const { title, description } = req.body;
    const { id } = req.params;

    try {
        const updatedTodo = await prisma.todo.update({
            where: { id: Number(id) },
            data: { title, description },
        });
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Delete a todo
app.delete('/api/todolist/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.todo.delete({
            where: { id: Number(id) },
        });
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
