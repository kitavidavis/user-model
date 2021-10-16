'use strict';
const e = React.createElement;

function App() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState("");

  const success = async (text)=> {
    console.log("Authenticated!");
    await localStorage.setItem("usersToken", text.access);
    window.location = "/";
  };

  const tryLogin = async (e) => {
    e.preventDefault();
    console.log("Loggin in with", username, password);
    await login_api(username, password, success, (text)=>{setMessage(text)});
  };

  return (
      <div style={{width: "400px", margin: "auto", marginTop: "200px",
        boxShadow: "5px 5px 20px #cccccccc",
        padding: "1em"
                }}>
        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Email</label>
            <input autoFocus type="email" className="form-control" id="username" placeholder="username"
              onChange={(e)=>{setUsername(e.target.value)}} value={username}/>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" placeholder="password"
              onChange={(e)=>{setPassword(e.target.value)}} value={password}/>
          </div>
          <div style={{margin: "1em", color: "red"}}>{message}</div>
          <button type="submit" className="btn btn-primary" onClick={tryLogin}>Login</button>
        </form>
      </div>
  );
}

const domContainer = document.querySelector('#root');
ReactDOM.render(
  e(App),
  domContainer
);