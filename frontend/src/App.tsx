import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import Login from './pages/login';
import Layout from './pages/layout';
import Register from "./pages/register";

import 'semantic-ui-css/semantic.min.css'
import './App.css'
import About from "./pages/about";
import Deposit from "./pages/deposit";
import AddItem from "./pages/add_item";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import { trpc } from './utils/trpc';

function App() {
    const token = localStorage.getItem('token')
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
        links: [
            httpBatchLink({
                url: window.location.host === 'localhost:3000' ? 'http://localhost:4000/trpc' : '/trpc',
                headers: {
                    Authorization: token ?? ''
                }
            }),
            
        ],
        }),
    );
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <Router>
                    <Routes>
                        <Route path='/' element={<Layout/>}>
                            <Route index element={<Home/>}></Route>
                            <Route path='/deposit' element={<Deposit/>}></Route>
                            <Route path='/add_item' element={<AddItem/>}></Route>
                        </Route>
                        <Route path='/login' element={<Login/>}></Route>
                        <Route path='/register' element={<Register/>}></Route>
                        <Route path='/about' element={<About/>}></Route>
                    </Routes>
                </Router>
            </div>
        </QueryClientProvider>
        </trpc.Provider>
    );
}

export default App;
