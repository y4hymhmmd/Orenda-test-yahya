import React, { useEffect, useState } from 'react';
import {
    Container,
    CssBaseline,
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    AppBar,
    Toolbar,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Todo {
    id: number;
    title: string;
    description: string;
}

const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
        return nameParts[0][0];
    }
    return nameParts[0][0] + nameParts[1][0];
};

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [open, setOpen] = useState(false);
    const [newTodo, setNewTodo] = useState({ title: '', description: '' });
    const [editId, setEditId] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openProfileMenu = Boolean(anchorEl);

    const userName = localStorage.getItem('name') || 'User';
    const userEmail = localStorage.getItem('email') || 'email@example.com';
    const userInitials = getInitials(userName);

    const fetchTodos = async () => {
        const response = await fetch('http://localhost:5000/api/todolist');
        const data = await response.json();
        setTodos(data);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        window.location.href = '/login';
    };

    const handleAddOrUpdateTodo = async () => {
        if (editId) {
            await fetch(`http://localhost:5000/api/todolist/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTodo),
            });
        } else {
            await fetch('http://localhost:5000/api/todolist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTodo),
            });
        }
        setOpen(false);
        setNewTodo({ title: '', description: '' });
        setEditId(null);
        fetchTodos();
    };

    const handleEdit = (todo: Todo) => {
        setNewTodo({ title: todo.title, description: todo.description });
        setEditId(todo.id);
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        await fetch(`http://localhost:5000/api/todolist/${id}`, {
            method: 'DELETE',
        });
        fetchTodos();
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
            <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 'none', borderBottom: '1px solid black' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ color: 'black' }}>
                        What do you need to do today?
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button variant="contained" color="primary" onClick={() => setOpen(true)} startIcon={<AddIcon />}>
                            Add
                        </Button>
                        <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 2 }}>
                            <Avatar>{userInitials}</Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={openProfileMenu}
                            onClose={handleProfileMenuClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    mt: 1.5,
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem>
                                <Typography variant="subtitle1">{userName}</Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="subtitle2">{userEmail}</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 1 }} />
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <TableContainer sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {todos.map((todo) => (
                            <TableRow key={todo.id}>
                                <TableCell>{todo.title}</TableCell>
                                <TableCell>{todo.description}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(todo)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(todo.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editId ? 'Edit Todo' : 'Add Todo'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={newTodo.title}
                        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        value={newTodo.description}
                        onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddOrUpdateTodo}>
                        {editId ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TodoList;
