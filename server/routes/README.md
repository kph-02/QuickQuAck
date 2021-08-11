# Routes
Note: May have to make the URIs more intuitive/specific
## Users
| Verb | URI | Authenticated | Operation | Description
| :---: | :--- | :---: | :---: | :---
| POST      | /auth/register | No | Create | Register a user and create it in the database
| POST   | /auth/login       | No | Read | Log in a user, generate auth token, refresh token
| PUT | /auth/edit-password | Yes | Update | Set user's password
| PUT | /auth/edit-email | Yes | Update | Set user's email
| TODO

### [POST] /auth/register
Parameters
| Name | Required | Description
| :---: | :---:| :---
| username | Yes | Username of user 

Responses
<table>
  <tr>
    <td> 
      <b>Status</b>
    </td>
    <td>
      <b>Body</b>
  </tr>
  <tr>
    <td>  
      200
    </td>
    <td>   
      
      ```
      {
        "firstName": "John",
        "lastName": "Doe",
        "email": "johndoe@gmail.com",
        "password": "password",
        "dob": "01-01-2020",
        "college": "UCSD",
        "gy": "2030"
      }

    </td>
  </tr>
</table>
