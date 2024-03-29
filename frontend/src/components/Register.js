import React from 'react'
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from 'react-bootstrap';
import axios from 'axios';
const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;



export const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState(''); //email input
    const [validEmail, setValidEmail] = useState(false); //boolean (valida ou nao)
    const [userFocus, setUserFocus] = useState(false); //boolean (existe focus no input ou nao)

    const [pwd, setPwd] = useState(''); //password input
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');//confirmpassword input
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState(''); //mensagem de erro
    const [success, setSuccess] = useState(false); //mensagem sucess

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd, matchPwd])

    const handleSubmit = async (e) => {

        try {
            const response = await axios.post('http://127.0.0.1:5000/registo',
                JSON.stringify({ email: email, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: false
                }
            );
            console.log(response.data);
            setSuccess(true);
        } catch (err) {

        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
                <section style={{ width: "500px"}}>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 style={{textAlign:"center",marginLeft:"-45px"}}>Registo </h1>
                    <form onSubmit={handleSubmit} style={{
                        margin: "0 auto",
                        width: "250px",
                        marginLeft:"15px"
                    }}>
                        <label htmlFor="email">
                            Email:
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} /> {/*se for valid mostra ICON(icon de validacao) senao DESAPARECE */}
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} /> {/*se for valido ou se nao existir DESAPARECE senao mostra ICON(icon de invalido)*/}
                        </label>
                        <input
                            type="text"
                            id="email"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                            style={{ width: "300px", Align: "center" }}

                        />
                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            style={{ width: "300px" }}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"} style={{marginLeft:"-16px", width:"450px"}}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Entre 8 a 24 caracteres.<br />
                            Tem que incluir uma letra maiúscula e outra minuscula, um número e um caracter especial.<br />
                            Caracteres especiais permitidos: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label htmlFor="confirm_pwd" >
                            Confirmar Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                            style={{ width: "300px" }}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Insira a mesma password.
                        </p>
                        <br />
                        <button style={{ width: "200px" }} disabled={!validEmail || !validPwd || !validMatch ? true : false}>Validar</button>
                        <p>
                            <br />
                            Já se econtra registado?<br />
                            <span className="line">
                                {/*trocar por link de login*/}
                                <a href="/login">Iniciar Sessão</a>
                            </span>
                        </p>
                    </form>
                </section>
            )}
        </>
    )
}
export default Register;