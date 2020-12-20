$( function() {
    $( '.preloader' ).fadeOut();
} );

const socket = io();
const formLogin = $( '.login' )[ 0 ];

const showSweetAlert = ( color, icon, title, text ) => {
    Swal.fire({
        confirmButtonColor: color,
        hideClass: {
            popup: 'animate__animated animate__zoomOut'
        },
        icon: icon,
        iconColor: color,
        showClass: {
            icon: 'animate__animated animate__flipInX',
            popup: 'animate__animated animate__zoomIn'
        },
        title: title,
        text: text,
        width: '24rem'
    } );
};



socket.on( 'connect', () => {
    console.log( 'Servidor conectado: Index' );
} );

socket.on( 'disconnect', () => {
    console.log( 'Servidor desconectado: Index' );
} );



formLogin.addEventListener( 'submit', ( event ) => {
    event.preventDefault();

    const name = event.target.name.value;
    const room = event.target.room.value;

    if( name.trim().length < 2 || room.trim().length < 2 ) {
        showSweetAlert( '#990000', 'error', 'Error...', 'Ingrese un nombre de usuario y sala de chat válidos' );
        document.getElementsByTagName( 'input' )[ 0 ].value = '';
        document.getElementsByTagName( 'input' )[ 1 ].value = '';
        return;
    }

    if( name.trim() === 'Admin' || name.trim() === 'Administrador' ) {
        showSweetAlert( '#990000', 'error', 'Error...', 'Usuario inválido' );
        document.getElementsByTagName( 'input' )[ 0 ].value = '';
        document.getElementsByTagName( 'input' )[ 1 ].value = '';
        return;
    }

    socket.emit( 'ingresoUsuario', { name: name, room: room }, ( data ) => {
        if( data.err ) {
            showSweetAlert( '#990000', 'error', 'Error...', data.err );
            document.getElementsByTagName( 'input' )[ 0 ].value = '';
            document.getElementsByTagName( 'input' )[ 1 ].value = '';
            return;
        }

        window.location = `chat.html?name=${ encodeURI( name ) }&room=${ encodeURI( room ) }`;
    } );
} );
