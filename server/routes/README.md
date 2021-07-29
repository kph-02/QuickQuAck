# Routes

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
<th>
Status
</th>
<th>
Body 
</th>
</tr>

<tr>

<td>
<pre>
<br/><br/><br/>200<br/><br/><br/><br/><br/>400<br/>
</pre>
</td>

<td>
<pre>
json
  {
    "id": 10,
    "username": "alanpartridge",
    "email": "alan@alan.com",
    "password_hash": "$2a$10$uhUIUmVWVnrBWx9rrDWhS.CPCWCZsyqqa8./whhfzBZydX7yvahHS",
    "password_salt": "$2a$10$uhUIUmVWVnrBWx9rrDWhS.",
    "created_at": "2015-02-14T20:45:26.433Z",
    "updated_at": "2015-02-14T20:45:26.540Z"
}
</pre>
</td>

</tr>
</table>
