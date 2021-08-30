# Routes

## Users
| Verb | URI | Authenticated | Operation | Description
| :---: | :--- | :---: | :---: | :---
| POST  | /api/auth/register | No | Create | Register a user and create it in the database
| POST   | /api/auth/login       | No | Read | Log in a user, generate auth token, refresh token
| PUT | /api/auth/edit-user-info | Yes | Update | Update user information (name, email, college, grad year, password)

### [POST] /auth/register
Parameters
| Name | Required | Description
| :---: | :---:| :---
| username | Yes | Username of user 

Responses
<!---<table>
<tr>
<th> Status </th> <th> Response </th>
</tr>
<tr>
<td> 200 </td>
<td> -->

<!--- ^ Extra blank line above! -->
<!---```json
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
```
V Extra blank line below!

</td>
</tr>
<tr>
<td> 400 </td>
<td>

**Markdown** _here_. (Blank lines needed before and after!)

</td>
</tr>
</table> -->

| Code | Body | Header | Description
| :-----: | :---------: | :---: | :---: 
| 200    |<pre lang="json">{<br>  "id": 10,<br>  "username": "alanpartridge",<br>  "email": "alan@alan.com",<br>  "password_hash": "$2a$10$uhUIUmVWVnrBWx9rrDWhS.CPCWCZsyqqa8./whhfzBZydX7yvahHS",<br>  "password_salt": "$2a$10$uhUIUmVWVnrBWx9rrDWhS.",<br>  "created_at": "2015-02-14T20:45:26.433Z",<br>  "updated_at": "2015-02-14T20:45:26.540Z"<br>}</pre>|
| 400    |<code>{<br>  "code": 400,<br>  "msg": balabala"<br>}</code>|
