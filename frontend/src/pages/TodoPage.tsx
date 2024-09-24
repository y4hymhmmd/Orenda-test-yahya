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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';

interface Todo {
    id: number;
    title: string;
    description: string;
}

const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
        return nameParts[0][0]; // Ambil huruf pertama jika hanya ada satu kata
    }
    return nameParts[0][0] + nameParts[1][0]; // Ambil dua huruf pertama dari dua kata
};

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openProfileMenu = Boolean(anchorEl);

    const userName = localStorage.getItem('name') || 'User'; // Ambil nama dari localStorage
    const userEmail = localStorage.getItem('email') || 'email@example.com'; // Ambil email dari localStorage
    const userInitials = getInitials(userName); // Dapatkan inisial nama

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
                            <Avatar>{userInitials}</Avatar> {/* Tampilkan inisial di Avatar */}
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
                                <Typography variant="subtitle1">{userName}</Typography> {/* Nama dari localStorage */}
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="subtitle2">{userEmail}</Typography> {/* Email dari localStorage */}
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 1 }} />
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Render tabel Todo di sini */}
            <TableContainer sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {todos.map((todo) => (
                            <TableRow key={todo.id}>
                                <TableCell>{todo.title}</TableCell>
                                <TableCell>{todo.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for Add/Edit Todo */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add Todo</DialogTitle>
                <DialogContent>
                    {/* Form untuk Add/Edit Todo */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => {/* Tambahkan logika add/edit todo di sini */}}>Add</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TodoList;
