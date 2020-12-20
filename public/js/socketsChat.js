const socket = io();
const params = new URLSearchParams( window.location.search );

if( !params.has( 'name' ) || !params.has( 'room' ) ) {
    window.location = 'index.html';
    throw new Error( 'El nombre y la sala son obligatorios' );
}

const usuario = encodeURI( params.get( 'name' ) );
const room = encodeURI( params.get( 'room' ) );

if( usuario.trim().length < 2 || room.trim().length < 2 ) {
    window.location = 'index.html';
    throw new Error( 'El nombre y la sala son obligatorios' );
}

if( usuario.trim() === 'Admin' || usuario.trim() === 'Administrador' ) {
    window.location = 'index.html';
    throw new Error( 'Usuario inválido' );
}

let idSocket = '';
let recipientName = '';
const nameRoom = document.querySelector( '.name-room h3' );
const formMessages = document.querySelector( '.box-messages form' );
const myModal = document.getElementById( 'mensajePrivado' );
const formPrivateMessage = document.getElementById( 'formPrivateMessage' );
const inputPrivateMessage = document.getElementById( 'privateMessage' );
const buttonCloseModal = document.getElementById( 'closeModal' );
nameRoom.innerText = room;



socket.on( 'connect', () => {
    socket.emit( 'ingresoUsuario', { name: usuario, room: room }, ( data ) => {
        if( data.err ) {
            window.location = 'index.html';
            return;
        }

        socket.emit( 'ingresarChat', { name: usuario, room: room }, ( data ) => {
            if( data.err ) {
                showSweetAlert( '#990000', 'error', 'Error...', data.err );
                return;
            }
    
            renderizarUsuarios( data.users, room );
        } );
    } );
} );

socket.on( 'disconnect', () => {
    console.log( 'Servidor desconectado: Chat' );
} );

socket.on( 'usuariosConectados', ( { users } ) => {
    renderizarUsuarios( users, room );
} );

socket.on( 'usuarioDesconectado', ( data ) => {
    const { img, name, message, time } = data;
    renderizarMensajeRecibido( img, name, message, time, true );
    scrollBottom();
} );

socket.on( 'nuevoMensaje', ( data ) => {
    const { img, name, message, time } = data;
    renderizarMensajeRecibido( img, name, message, time, false );
    scrollBottom();
} );

socket.on( 'nuevoMensajePrivado', ( data ) => {
    const { img, name, message, time } = data;
    renderizarMensajePrivadoRecibido( img, name, message, time );
    scrollBottom();
} );


myModal.addEventListener( 'shown.bs.modal' , () => {
    inputPrivateMessage.focus();
});

document.body.addEventListener( 'click', ( event ) => {
    if( event.target.classList.value === 'users-a' ) {
        idSocket = event.target.attributes[ 1 ].value;
        recipientName = event.target.lastElementChild.firstChild.textContent.trim(); 
    }
});

buttonCloseModal.addEventListener( 'click', () => {
    inputPrivateMessage.value = '';
    idSocket = '';
    recipientName = '';
} );

formPrivateMessage.addEventListener( 'submit', ( event ) => {
    event.preventDefault();

    const privateMessage = event.target.privateMessage.value;
    const myModalInstance = bootstrap.Modal.getInstance( myModal );

    if( privateMessage.trim().length <= 0 ) {
        idSocket = '';
        recipientName = '';              
        myModalInstance.hide();
        return;        
    }

    socket.emit( 'mensajePrivado', { idSocket: idSocket, message: privateMessage, name: recipientName }, ( data ) => {
        inputPrivateMessage.value = '';
        idSocket = '';
        recipientName = '';
        myModalInstance.hide();

        if( data.err ) {
            showSweetAlert( '#990000', 'error', 'Error...', data.err );
            return;
        }

        const { img, name, message, time } = data;
        renderizarMensajeEnviado( img, name, message, time );
        scrollBottom();
    } );
} );

formMessages.addEventListener( 'submit', ( event ) => {
    event.preventDefault();

    const message = event.target.message.value;

    if( message.trim().length <= 0 ) {
        showSweetAlert( '#990000', 'error', 'Error...', 'Ingrese un mensaje válido' );
        return;
    }

    socket.emit( 'mensaje', { message: message }, ( data ) => {
        if( data.err ) {
            showSweetAlert( '#990000', 'error', 'Error...', data.err );
            return;
        }

        const { img, name, message, time } = data;
        renderizarMensajeEnviado( img, name, message, time );
        scrollBottom();
    } );
} );
