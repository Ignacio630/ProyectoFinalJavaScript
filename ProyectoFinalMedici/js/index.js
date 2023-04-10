const apiUsers = [];
const userList = [];
const url = 'https://jsonplaceholder.typicode.com/users';
const userForm = document.getElementById('formulario-usuario');
const buttonCreate = document.getElementById('boton-create');
const buttonDelete = document.getElementById('boton-delete');
const buttonLoad = document.getElementById('boton-load');
const checkDefault = document.getElementById('flexCheckDefault');

//constructor de usuarios
class User{
    constructor(name, username, email, phone){
        this.name = name;
        this.username = username;
        this.email = email;
        this.phone = phone;
    }
}
//listar usuarios en la tabla
const addUser = (userList) =>{
    const users = userList.map((user) => `<tr><th scope="row"><input type="checkbox" class="form-check-input" id="check-edit"></th><td>${user.name}</td><td>${user.username}</td><td>${user.email}</td><td>${user.phone}</td></tr>`).join('');
    document.querySelector('#filas-usuarios').innerHTML = users;
}
//funcion para tomar los datos de la api guardarlos en el array y guardarlos en el local storage
const getUsers = async () => {
    const response = await fetch(url);
    const users = await response.json();
    users.map((user) => userList.push(user));
    localStorage.setItem('users', JSON.stringify(userList));
}

const handleCreate = (e) =>{
    e.preventDefault();
    const target = e.target;
    //validar los datos
    if(!target.name.value || !target.username.value || !target.email.value || !target.phone.value){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Todos los campos son obligatorios',
        })
    }else{
        //crear usuario
        userList.push(new User(target.name.value, target.username.value, target.email.value, target.phone.value));
        //agregar usuario a la lista
        localStorage.setItem('users', JSON.stringify(userList));
        location.reload();
        swal.fire({
            icon: 'success',
            title: 'Usuario creado',
            text: 'El usuario se creo correctamente',
        })
        addUser(userList);
        //limpiar formulario
        userForm.reset();
    }
}

//funcion que recupera los datos del local storage los guardarlos en el array y los muestra en la tabla
const getUserStorage = (userList) =>{
    const users = JSON.parse(localStorage.getItem('users'));
    if(users){
        users.map((user) => userList.push(user));
		addUser(users);
    }
}

//funcion de eliminar usuarios, validando si se esta seleccionando un usuario o no y si existe en el local storage usuarios para eliminar
const handleDelete = (e) =>{
    e.preventDefault();
    
    if(localStorage.getItem('users') === null){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No hay usuarios para eliminar',
            })
        }else{
            const check = document.querySelectorAll('#check-edit');
            const users = JSON.parse(localStorage.getItem('users'));
            const usersFilter = users.filter((_users, index) => !check[index].checked);
            if(checkDefault.checked){
            localStorage.removeItem('users');
            swal.fire({
                icon: 'success',
                title: 'Usuarios eliminados',
                text: 'Todos los usuarios se eliminaron correctamente',
            }).then(() => {
                location.reload();
            })
        }else{
            if(usersFilter.length === users.length){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debe seleccionar al menos un usuario',
            })
        }else{
            localStorage.setItem('users', JSON.stringify(usersFilter));
            swal.fire({
                icon: 'success',
                title: 'Usuario eliminados',
                text: 'Los usuario se elimino correctamente',
            }).then(() => {
                location.reload();
            })
            addUser(usersFilter);
        }
    }
    }
}

//funcion para cargar los datos de la api e ingresarlos en el local storage
const handleLoad = (e) =>{
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users'));
    
    getUsers();
    swal.fire({
        icon: 'success',
        title: 'Usuarios cargados',
        text: 'Los usuarios se cargaron correctamente',
    }).then(() => {
        location.reload();
    })

}

userForm.onsubmit = handleCreate;
buttonDelete.onclick = handleDelete;
buttonLoad.onclick = handleLoad;

if(localStorage.getItem('users') === '[]'){
    localStorage.removeItem('users');
}
getUserStorage(userList);
addUser(userList);

