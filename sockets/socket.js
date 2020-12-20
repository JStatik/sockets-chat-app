const colors = require( 'colors' );
const { io } = require( '../app' );
const moment = require( 'moment' );
const { Usuarios } = require( '../classes/usuarios' );

const usuarios = new Usuarios();

io.on( 'connection', async( client ) => {
    console.log( colors.yellow( 'Usuario conectado' ) );



    client.on( 'ingresoUsuario', async( data, callback ) => {
        if( !callback ) return;

        if( !data.name || !data.room ) {
            callback( { err: 'El nombre y sala son obligatorios' } );
            return;
        }

        const { msg } = await usuarios.obtenerUsuarioPorNameSala( data.name, data.room );

        if( msg === 'No existe el usuario en esta sala' ) {
            callback( { ok: 'No existe el usuario en esta sala' } );
            return;
        }

        return callback( { err: msg } );
    } );



    client.on( 'disconnect', async() => {
        const { user } = await usuarios.eliminarUsuario( client.id );

        if( typeof user === 'string' ) return;

        const newMessage = {
            img: 'admin.jpg',
            name: 'Admin',
            message: `${ user.name } se desconecto.`,
            time: moment().locale( 'es' ).format( 'LT' )
        };

        client.broadcast.to( user.chatRoom ).emit( 'usuarioDesconectado', newMessage );
        client.broadcast.to( user.chatRoom ).emit( 'usuariosConectados', await usuarios.obtenerUsuariosPorSala( user.chatRoom ) );
    } );



    client.on( 'ingresarChat', async( data, callback ) => {
        if( !callback ) return;

        if( !data.name || !data.room ) {
            callback( { err: 'El nombre y sala son obligatorios' } );
            return;
        }

        client.join( data.room );

        await usuarios.crearUsuario( client.id, data.name, data.room, `${ Math.round( Math.random() * 13 ) + 1 }.jpg` );

        client.broadcast.to( data.room ).emit( 'usuariosConectados', await usuarios.obtenerUsuariosPorSala( data.room ) );
        return callback( await usuarios.obtenerUsuariosPorSala( data.room ) );
    } );



    client.on( 'mensaje', async( data, callback ) => {
        if( !callback ) return;

        if( !data.message ) {
            callback( { err: 'El mensaje es obligatorio' } );
            return;
        }

        const { user } = await usuarios.obtenerUsuarioPorIdSocket( client.id );

        const newMessage = {
            img: user.img,
            name: user.name,
            message: data.message,
            time: moment().locale( 'es' ).format( 'LT' )
        };

        client.broadcast.to( user.chatRoom ).emit( 'nuevoMensaje', newMessage );
        return callback( newMessage );
    } );



    client.on( 'mensajePrivado', async( data, callback ) => {
        if( !callback ) return;

        if( !data.idSocket || !data.message || !data.name ) {
            callback( { err: 'El usuario y mensaje son obligatorios' } );
            return;
        }

        if( data.idSocket === client.id ) {
            callback( { err: 'Los mensajes privados deben ser enviados a otra persona' } );
            return;
        }

        const { user } = await usuarios.obtenerUsuarioPorIdSocket( client.id );

        const newPrivateMessage = {
            img: user.img,
            message: data.message,
            time: moment().locale( 'es' ).format( 'LT' )
        };

        client.broadcast.to( data.idSocket ).emit( 'nuevoMensajePrivado', { ...newPrivateMessage, name: `Mensaje privado de: ${ user.name }` } );
        return callback( { ...newPrivateMessage, name: `Mensaje privado a: ${ data.name }` } );
    } );
} );
