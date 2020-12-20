const colors = require( 'colors' );
const Usuario = require( '../models/Usuario' );

class Usuarios {
    obtenerUsuarioPorNameSala = async( name, room ) => {
        try {
            const usuario = await Usuario.findOne( { name: name, chatRoom: room } );

            if( !usuario ) {
                return {
                    msg: 'No existe el usuario en esta sala'
                };
            }

            return {
                msg: 'El usuario ingresado ya está en uso'
            };
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    crearUsuario = async( idSocket, name, room, img ) => {
        try {
            const newUser = { idSocket: idSocket, name: name, chatRoom: room, img: img };
            const usuario = new Usuario( newUser );

            await usuario.save();
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    obtenerUsuariosPorSala = async( room ) => {
        try {
            const usuarios = await Usuario.find( { chatRoom: room } );

            return {
                users: usuarios
            };
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    obtenerUsuarioPorIdSocket = async( idSocket ) => {
        try {
            const usuario = await Usuario.findOne( { idSocket: idSocket } );

            return {
                user: usuario
            };
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };    

    eliminarUsuario = async( idSocket ) => {
        try {
            const { user } = await this.obtenerUsuarioPorIdSocket( idSocket );

            if( !user ) {
                return {
                    user: 'No existe el usuario para eliminar'
                };
            };

            const usuarioEliminado = await Usuario.findByIdAndDelete( user._id );

            return {
                user: usuarioEliminado
            };
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };
};

module.exports = {
    Usuarios
};
