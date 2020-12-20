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

const renderizarUsuarios = ( users, room ) => {
    let html = '';
    const contenedorUsuarios = document.getElementsByClassName( 'users' )[ 0 ];

    html += `<li>
                <a href="javascript:void(0)" class="active"><span>Sala de ${ room }</span></a>
            </li>`;

    users.map( user => {
        html += `<li>
                    <a href="javascript:void(0)" data-id="${ user.idSocket }" class="users-a" data-bs-toggle="modal" data-bs-target="#mensajePrivado">
                        <img src="assets/users/${ user.img }" alt="user-img" class="img-circle"/>
                        <span>
                            ${ user.name }<small class="text-success"> Online</small>
                        </span>
                    </a>
                </li>`;

        contenedorUsuarios.innerHTML = html;
    } );
};

const renderizarMensajePrivadoRecibido = ( img, name, message, time ) => {
    const contenedorMensajes = document.querySelector( '.messages ul' );

    const etiquetaLi = document.createElement( 'li' );
    const etiquetaDiv1 = document.createElement( 'div' );
    const etiquetaDiv2 = document.createElement( 'div' );
    const etiquetaDiv3 = document.createElement( 'div' );
    const etiquetaImg = document.createElement( 'img' );
    const etiquetaH5 = document.createElement( 'h5' );
    const etiquetaDiv4 = document.createElement( 'div' );

    etiquetaLi.setAttribute( 'class', 'animate__animated animate__fadeIn' );
    etiquetaDiv1.setAttribute( 'class', 'chat-img' );
    etiquetaDiv2.setAttribute( 'class', 'chat-content' );
    etiquetaDiv3.setAttribute( 'class', 'chat-time' );
    etiquetaImg.setAttribute( 'src', `assets/users/${ img }` );
    etiquetaImg.setAttribute( 'alt', 'user' );
    etiquetaDiv4.setAttribute( 'class', 'box bg-warning bg-gradient' );

    etiquetaDiv3.innerText = time;
    etiquetaH5.innerText = name;   
    etiquetaDiv4.innerText = message;

    etiquetaDiv1.appendChild( etiquetaImg );
    etiquetaDiv2.appendChild( etiquetaH5 );
    etiquetaDiv2.appendChild( etiquetaDiv4 );

    etiquetaLi.appendChild( etiquetaDiv1 );
    etiquetaLi.appendChild( etiquetaDiv2 );
    etiquetaLi.appendChild( etiquetaDiv3 );

    contenedorMensajes.appendChild( etiquetaLi );
};

const renderizarMensajeRecibido = ( img, name, message, time, admin ) => {
    const contenedorMensajes = document.querySelector( '.messages ul' );

    const etiquetaLi = document.createElement( 'li' );
    const etiquetaDiv1 = document.createElement( 'div' );
    const etiquetaDiv2 = document.createElement( 'div' );
    const etiquetaDiv3 = document.createElement( 'div' );
    const etiquetaImg = document.createElement( 'img' );
    const etiquetaH5 = document.createElement( 'h5' );
    const etiquetaDiv4 = document.createElement( 'div' );

    etiquetaLi.setAttribute( 'class', 'animate__animated animate__fadeIn' );
    etiquetaDiv1.setAttribute( 'class', 'chat-img' );
    etiquetaDiv2.setAttribute( 'class', 'chat-content' );
    etiquetaDiv3.setAttribute( 'class', 'chat-time' );
    etiquetaImg.setAttribute( 'src', `assets/users/${ img }` );
    etiquetaImg.setAttribute( 'alt', `${ admin ? 'admin' : 'user' }` );
    etiquetaDiv4.setAttribute( 'class', `${ admin ? 'box bg-dark bg-gradient text-white' : 'box bg-light-info' }` );

    etiquetaDiv3.innerText = time;
    etiquetaH5.innerText = name;   
    etiquetaDiv4.innerText = message;

    etiquetaDiv1.appendChild( etiquetaImg );
    etiquetaDiv2.appendChild( etiquetaH5 );
    etiquetaDiv2.appendChild( etiquetaDiv4 );

    etiquetaLi.appendChild( etiquetaDiv1 );
    etiquetaLi.appendChild( etiquetaDiv2 );
    etiquetaLi.appendChild( etiquetaDiv3 );

    contenedorMensajes.appendChild( etiquetaLi );
};

const renderizarMensajeEnviado = ( img, name, message, time ) => {
    const contenedorMensajes = document.querySelector( '.messages ul' );
    const input = document.querySelector( '.box-messages form div input' );

    const etiquetaLi = document.createElement( 'li' );
    const etiquetaDiv1 = document.createElement( 'div' );
    const etiquetaDiv2 = document.createElement( 'div' );
    const etiquetaDiv3 = document.createElement( 'div' );
    const etiquetaH5 = document.createElement( 'h5' );
    const etiquetaDiv4 = document.createElement( 'div' );
    const etiquetaImg = document.createElement( 'img' ); 
    
    etiquetaLi.setAttribute( 'class', 'reverse animate__animated animate__fadeIn' );
    etiquetaDiv1.setAttribute( 'class', 'chat-content' );
    etiquetaDiv2.setAttribute( 'class', 'chat-img' );
    etiquetaDiv3.setAttribute( 'class', 'chat-time' );
    etiquetaDiv4.setAttribute( 'class', 'box bg-light-inverse' );
    etiquetaImg.setAttribute( 'src', `assets/users/${ img }` );
    etiquetaImg.setAttribute( 'alt', 'user' );
    
    etiquetaDiv3.innerText = time;
    etiquetaH5.innerText = name;
    etiquetaDiv4.innerText = message;
    
    etiquetaDiv1.appendChild( etiquetaH5 );
    etiquetaDiv1.appendChild( etiquetaDiv4 );
    etiquetaDiv2.appendChild( etiquetaImg );

    etiquetaLi.appendChild( etiquetaDiv1 );
    etiquetaLi.appendChild( etiquetaDiv2 );
    etiquetaLi.appendChild( etiquetaDiv3 );

    contenedorMensajes.appendChild( etiquetaLi );

    input.value = '';
    input.focus();
};

const scrollBottom = () => {
    const contenedorMensajes = $( '.messages ul' );   
    const ultimoMensaje = contenedorMensajes.children( 'li:last-child' );

    const clientHeight = contenedorMensajes.prop( 'clientHeight' );
    const scrollTop = contenedorMensajes.prop( 'scrollTop' );
    const scrollHeight = contenedorMensajes.prop( 'scrollHeight' );

    const ultimoMensajeHeight = ultimoMensaje.innerHeight();
    const prevUltimoMensajeHeight = ultimoMensaje.prev().innerHeight() || 0;

    if( clientHeight + scrollTop + ultimoMensajeHeight + prevUltimoMensajeHeight >= scrollHeight ) {
        contenedorMensajes.scrollTop( scrollHeight );
    }
};
