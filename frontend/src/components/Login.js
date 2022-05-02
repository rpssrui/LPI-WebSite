import React from 'react';
import { useRef, useState, useEffect, useContext } from 'react';

import axios from 'axios';

const LOGIN_URL = 'http://127.0.0.1:5000/login';


const Login = () => {
  
    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [id,setId]= useState('');
    const [token,setToken]=useState('');

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
                JSON.stringify({ email:email,password:pwd }),
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
            if(err.response.request.status===401)
                setErrMsg('Não existe nenhum utilizador com este email.');
            else if(err.response.request.status===400)
                setErrMsg('Palavra-passe ou Email incorretos.');
            else
                setErrMsg('Erro do Servidor');
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href={"/home/"+id+"?tk="+token}>Página Inicial</a>
                    </p>
                </section>
            ) : (
                <section>
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
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <br />
                        <button>Sign In</button>
                    </form>
                    <p>
                        Ainda não tem conta?<br />
                        <span className="line">
                            {}
                            <a href="/register">Registe-se</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login;