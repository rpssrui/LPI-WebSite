import React from 'react';
import { useRef, useState, useEffect, useContext } from 'react';
import {BrowserRouter as Router, Link} from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const LOGIN_URL = 'http://127.0.0.1:5000/login';


const Login = () => {

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [id, setId] = useState('');
    const [token, setToken] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email: email, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: false
                }
            );
            //console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            //const accessToken = response?.data?.accessToken;
            //const roles = response?.data?.roles;
            // setAuth({ email, pwd,});~
            console.log(response.data)
            setEmail(email);
            setPwd(pwd);
            setToken(response.data.login.token);
            setId(response.data.login.id);
            setSuccess(true);
        } catch (err) {
            console.log(err.response.request.status);
            if (err.response.request.status === 401)
                setErrMsg('Não existe nenhum utilizador com este email.');
            else if (err.response.request.status === 400)
                setErrMsg('Palavra-passe ou Email incorretos.');
            else
                setErrMsg('Erro do Servidor');
            errRef.current.focus();
        }
    }

    sessionStorage.setItem("token", token);

    return (
        <>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <Link to={"/home/"+id}>
                        <button >Página Inicial</button>
                        </Link>
                    </p>
                </section>
            ) : (
                <section style={{ width: "400px", height: "600" }}>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Iniciar Sessão</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Email:</label>
                        <input
                            type="text"
                            id="email"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            style={{ width: "300px" }}
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            style={{ width: "300px" }}
                        />
                        <br />
                        <button style={{ width: "200px" }}>Sign In</button>
                    </form>
                    <p>
                        Ainda não tem conta?<br />
                        <span className="line">
                            { }
                            <a href="/register">Registe-se</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login;