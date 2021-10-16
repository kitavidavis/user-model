const login_api = async (username, password, success, fail) => {
    const response = await fetch(
          `/api/token/`,
          {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                "username": username,
                "password": password,
              })
          }
      );
    const text = await response.text();
    if (response.status === 200) {
      console.log("success", JSON.parse(text));
      success(JSON.parse(text));
    } else {
      console.log("failed", text);
      Object.entries(JSON.parse(text)).forEach(([key, value])=>{
        fail(`${key}: ${value}`);
      });
    }
  };
  
  const get_users_api = async (pageNo="", success, fail) => {
    const token = await localStorage.getItem("usersToken");
    if (token === null) {
      console.log("No credentials found, redirecting...");
      window.location = "/login";
      return [];
    }
    const response = await fetch(
          `/users/?page_no=${pageNo}`,
          {
              method: 'GET',
              headers: {
                  'Content-Type': 'Application/JSON',
                  'Authorization': `Bearer ${token}`,
              }
          }
      );
    const text = await response.text();
    if (response.status === 401) {
      console.log("Token not valid");
      window.location = "/login";
      return [];
    }
    if (response.status === 200) {
      console.log("success", JSON.parse(text));
      success(JSON.parse(text));
    } else {
      console.log("failed", text);
      Object.entries(JSON.parse(text)).forEach(([key, value])=>{
        fail(`${key}: ${value}`);
      });
    }
  };
  
  const post_user_api = async (data, success) => {
    const token = await localStorage.getItem("usersToken");
    if (token === null) {
      console.log("No credentials found, redirecting...");
      window.location = "/login";
      return [];
    }
    var date = data.date;
    var email = data.email;
    var id = data.id;
    var name = data.name;
    var image_1 = data.image;
    var pdf_1 = data.pdf;

    var imageArr = image_1.split("fakepath");
    var image_2 = imageArr[1];
    var image = image_2.substring(1);
    console.log(image);

    var pdfArr = pdf_1.split("fakepath");
    var pdf_2 = pdfArr[1];
    var pdf = pdf_2.substring(1);
    console.log(pdf);

    var data2 = new Object();
    data2.date = date;
    data2.email = email;
    data2.id = id;
    data2.name = name;
    data2.image = image;
    data2.pdf = pdf;

    const response = await fetch(
          `/users/`,
          {
              method: 'POST',
              headers: {
                  'Content-Type': 'Application/JSON',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(data2)
          }
      );
    const text = await response.text();
    if (response.status === 401) {
      console.log("Token not valid");
      window.location = "/login";
      return [];
    }
    if (response.status === 201) {
      console.log("success", JSON.parse(text));
      success(JSON.parse(text));
    } else {
      console.log("failed", text);
      Object.entries(JSON.parse(text)).forEach(([key, value])=>{
        fail(`${key}: ${value}`);
      });
    }
  };
  
  const put_user_api = async (userId, data, success) => {
    const token = await localStorage.getItem("usersToken");
    if (token === null) {
      console.log("No credentials found, redirecting...");
      window.location = "/login";
      return [];
    }

    var date = data.date;
    var email = data.email;
    var id = data.id;
    var name = data.name;
    var image_1 = data.image;
    var pdf_1 = data.pdf;

    var imageArr = image_1.split("fakepath");
    var image_2 = imageArr[1];
    var image = image_2.substring(1);
    console.log(image);

    var pdfArr = pdf_1.split("fakepath");
    var pdf_2 = pdfArr[1];
    var pdf = pdf_2.substring(1);
    console.log(pdf);

    var data2 = new Object();
    data2.date = date;
    data2.email = email;
    data2.id = id;
    data2.name = name;
    data2.image = image;
    data2.pdf = pdf;

    const response = await fetch(
          `/users/${userId}/`,
          {
              method: 'PUT',
              headers: {
                  'Content-Type': 'Application/JSON',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(data2)
          }
      );
    const text = await response.text();
    if (response.status === 401) {
      console.log("Token not valid");
      window.location = "/login";
      return [];
    }
    if (response.status === 200) {
      console.log("success", JSON.parse(text));
      success(JSON.parse(text));
    } else {
      console.log("failed", text);
      Object.entries(JSON.parse(text)).forEach(([key, value])=>{
        fail(`${key}: ${value}`);
      });
    }
  };
  
  const delete_user_api = async (userId, success) => {
    const token = await localStorage.getItem("usersToken");
    if (token === null) {
      console.log("No credentials found, redirecting...");
      window.location = "/login";
      return [];
    }
    const response = await fetch(
          `/users/${userId}/`,
          {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'Application/JSON',
                  'Authorization': `Bearer ${token}`,
              }
          }
      );
    const text = await response.text();
    if (response.status === 401) {
      console.log("Token not valid");
      window.location = "/login";
      return [];
    }
    console.log(response.status);
    if (response.status === 410) {
      console.log("success", JSON.parse(text));
      success(JSON.parse(text));
    } else {
      console.log("failed", text);
      Object.entries(JSON.parse(text)).forEach(([key, value])=>{
        fail(`${key}: ${value}`);
      });
    }
  };