const { Schema, model } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

const Usuario = new Schema( {
    idSocket: {
        type: String,
        required: [ true, 'El socket ID es obligatorio' ],
        unique: true
    },
    name: {
        type: String,
        required: [ true, 'El nombre es obligatorio' ]
    },
    chatRoom: {
        type: String,
        required: [ true, 'La sala es obligatoria' ]
    },
    img: {
        type: String,
        required: [ true, 'La imagen es obligatoria' ]
    }
} );

Usuario.plugin( uniqueValidator, { message: 'El socket ID del usuario ya existe' } );

module.exports = model( 'Usuario', Usuario );
