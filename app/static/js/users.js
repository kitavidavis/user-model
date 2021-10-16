'use strict';
const e = React.createElement;

function App() {
  const [list, setList] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [pages, setPages] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);
  const [modalDescription, setModalDescription] = React.useState("");
  const [userId, setUserId] = React.useState(null);
  const [error, setError] = React.useState("");
  const [name, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [image, setImage] = React.useState("");
  const [pdf, setPDF] = React.useState("");

  const success = (data) => {
    setList(data.data);
    setCount(data.count);
    const newPages = [];
    if (data.count > 10) {
      for (let i=0; i<Math.ceil(data.count / 10); i++) {
        newPages.push({
          name: (i+1).toString(),
          page: i,
        });
        console.log("page",i);
      }
      if (page > newPages.length-1) {
        setPage(page-1);
      }
    } else {
      setPage(0);
    }
    setPages(newPages);
  };

  const logout = async (e)=>{
    await localStorage.setItem("usersToken",null);
    window.location = "/login";
  };

  const getData = ()=>{
    get_users_api(page, success, (text)=>{console.log("Error: ", text)});
  };

  const newUser = ()=>{
    setModalDescription("New User");
    setUserId(null);
    setUserName("");
    setEmail("");
    setImage("");
    setPDF("");
    setError("");
    setShowModal(true);
    const userInput = document.getElementById("userInput");
    setTimeout(()=>{userInput && userInput.focus()}, 1);
  };

  const editUser = (data)=>{
    setModalDescription("Edit User");
    setUserId(data.id);
    setUserName(data.name);
    setEmail(data.email);
    //setImage(data.image);
    //setPDF(data.pdf);
    setError("");
    setShowModal(true);
    const userInput = document.getElementById("userInput");
    setTimeout(()=>{userInput && userInput.focus()}, 1);
  };

  const uploadFile = file => {
    const API_ENDPOINT = "../uploads/files";
    const request = new XMLHttpRequest();
    const formData = new FormData();
  
    request.open("POST", API_ENDPOINT, true);
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        console.log(request.responseText);
      }
    };
    formData.append("file", file);
    request.send(formData);
  };

  const uploadImage = file => {
    const API_ENDPOINT = "../uploads/images";
    const request = new XMLHttpRequest();
    const formData = new FormData();
  
    request.open("POST", API_ENDPOINT, true);
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        console.log(request.responseText);
      }
    };
    formData.append("file", file);
    request.send(formData);
  };

  const handleImage = (event) => {
    const files = event.target.files;
    uploadImage(files[0]);
    console.log('yes');
  }

  const handleFile = (event) => {
    const files = event.target.files;
    uploadFile(files[0]);
  }

  const saveUser = (e)=>{
    e.preventDefault();
    setError("");
    console.log(image);
    console.log(pdf);
    console.log("saving new", name, email, image, pdf);
    if (name == ""){
      setError("Please enter user name");
    } else if(email == ""){
        setError("Please enter user email");
    } else if(image == ""){
        setError("Please upload users image");
    } else if(pdf == ""){
        setError("Please upload a pdf file");
    }else {
      if (userId === null)
        post_user_api({name, email, image, pdf}, ()=>{getData();});
      else
        put_user_api(userId, {name, email, image, pdf}, ()=>{getData();});
      setShowModal(false);
    }
  };

  const deleteUser = (userId)=>{
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete user!'
    }).then((result) => {
      if (result.isConfirmed) {
        delete_user_api(userId, ()=>{
          Swal.fire({
              title: 'Deleted!',
              text: "User has been deleted!",
              icon: 'success',
              timer: 1000,
          });
          getData();
        });
      }
    });
  };

  const keyDownHandler = (e)=>{
    if (e.which === 27)
      setShowModal(false);
  };

  React.useEffect(()=>{
    getData();
  }, [page]);

  return (
    <div onKeyDown={keyDownHandler}>
      <div style={{background: "#00000060"}}
          className={"modal " + (showModal?" show d-block":" d-none")} tabIndex="-1" role="dialog">
        <div className="modal-dialog shadow">
          <form method="post" encType="multipart/form-data">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalDescription}</h5>
              <button type="button" className="btn-close" onClick={()=>{setShowModal(false)}} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <label>Name</label>
                <div className="form-group">
                  <input type="text" className="form-control" name="name" id="nameInput"
                         value={name} onChange={(e)=>{setUserName(e.target.value)}}
                         placeholder="Name"/>
                </div>
                <label style={{marginTop: "1em"}}>Email</label>
                <div className="form-group" >
                  <input type="email" className="form-control" placeholder="Email"
                         value={email} onChange={(e)=>{setEmail(e.target.value)}}
                         name="email" />
                </div>
              <label style={{marginTop: "1em"}}>Image</label>
                <div className="form-group" >
                  <input type="file" className="form-control" placeholder="Image/Photo"
                         value={image} onChange={(e)=>{setImage(e.target.value); handleImage()}}
                         name="image" id="imageinput" />
                </div>
              <label style={{marginTop: "1em"}}>PDF</label>
                <div className="form-group">
                  <input type="file" className="form-control"
                         value={pdf} onChange={(e)=>{setPDF(e.target.value); handleFile()}}
                         placeholder="PDF" name="pdf" id="pdfinput" />
                </div>
              <small className="form-text text-muted">{error}</small>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={()=>{setShowModal(false)}} data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" onClick={saveUser}>Save changes</button>
            </div>
          </div>
          </form>
        </div>
      </div>

      <div style={{maxWidth: "800px", margin: "auto", marginTop: "1em", marginBottom: "1em",
                    padding: "1em"}} className="shadow">
        <div style={{display: "flex", flexDirection: "row"}}>
          <span>User Model</span>
          <a className="btn btn-light" style={{marginLeft: "auto"}} onClick={logout}>Logout</a>
        </div>
      </div>
      <div style={{maxWidth: "100%", margin: "auto", marginTop: "1em", marginBottom: "1em",
                    padding: "1em"}} className="shadow">
        <div style={{display: "flex", flexDirection: "row", marginBottom: "5px"}}>
          {pages.length > 0 && <nav className="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
            <ul className="pagination">
              <li className={"page-item " + (page === 0?"disabled":"")} onClick={(e)=>{
                    e.preventDefault();
                    setPage(Math.max(page-1,0));
              }}><a className="page-link" href="#" aria-label="Previous"><span
                  aria-hidden="true">«</span></a></li>
              {pages.map((el)=><li key={"page" + el.page} onClick={(e)=>{
                  setPage(el.page);
                }} className={"page-item "+(page===el.page?"active":"")}>
                <a className="page-link" href="#">
                  {el.name}
                </a></li>)}
              <li className={"page-item " + (page === pages.length-1?"disabled":"")} onClick={(e)=>{
                    setPage(Math.min(page+1,pages.length-1));
              }}><a className="page-link" href="#" aria-label="Next"><span
                  aria-hidden="true">»</span></a></li>
            </ul>
          </nav>}
          <a className="btn btn-light" style={{marginLeft: "auto"}}
             onClick={newUser}
          >New User</a>
        </div>
        <table className="table table-hover caption-top display responsive nowrap" style={{width: "100%"}} id="users">
          <thead className="table-light">
          <tr>
            <th>id</th>
            <th>Date</th>
            <th>Name</th>
            <th>Email</th>
            <th>Image</th>
            <th>PDF</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          { list.map((row)=>
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.date}</td>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>{row.image}</td>
              <td>{row.pdf}</td>
              <td>
                <a className="btn btn-light" style={{marginLeft: "auto"}}
                  onClick={(e)=>{editUser(row.id)}}>Edit</a>{" "}
                <a className="btn btn-light" style={{marginLeft: "auto"}}
                  onClick={(e)=>{deleteUser(row.id)}}>Delete</a>
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const domContainer = document.querySelector('#root');
ReactDOM.render(
  e(App),
  domContainer
);